import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom'
import {
  Pencil,TOOL_PENCIL,
  Line,TOOL_LINE,
  Ellipse,TOOL_ELLIPSE,
  Rectangle,TOOL_RECTANGLE,
  TOOL_CLEAR_RECT,Clearrect,
  TOOL_TRIANGLE,Triangle,
  TOOL_TEXT,Text,
  TOOL_LASER,Laser
} from './tools'
import $ from 'jquery';
export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
  [TOOL_LINE]: Line,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse,
  [TOOL_CLEAR_RECT]: Clearrect,
  [TOOL_TRIANGLE]: Triangle,
  [TOOL_TEXT]: Text,
  [TOOL_LASER]: Laser
};
import {TIME_SEND_LASER_MOVE} from '/vcrx/base';
import {
  Icon,
  IconTextSend
} from '/features/base/icons';

let socket = null;

/**
 * Desciption of file
 * Author     : Tungns4
 * @extends Component
 */

export default class SketchPad extends Component {

  static propTypes = {
  };

  static defaultProps = {
    width: 500,
    height: 500,
    color: '#000',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
    debounceTime: 1000,
    animate: true,
    tool: TOOL_PENCIL,
    toolsMap
  };

  tool = null;
  interval = null;

  constructor(props) {
    super(props);

    socket = this.props.socket;

    this.state = {
      wTextBox: 200,
      hTextBox: 200,
      textDrawText: '',
      fontText: 'Arial',
      sizeT: 4,
      colorText: 'black',
      onLaserMode: false
    }

    this.initTool = this.initTool.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onDebouncedMove = this.onDebouncedMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.getTouchPosition = this.getTouchPosition.bind(this);
    this.sendText = this.sendText.bind(this);
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef);
    this.ctx = this.canvas.getContext('2d');
    this.initTool(this.props.tool);

    $('#drawText').keydown((event) => {
      if (event.keyCode === 13 && this.state.textDrawText != '') {        
        this.sendText()
      }
    });

    socket.on("drawText", (data) => {
      this.ctx.font = (data.item.size * this.canvas.width / data.width) + "vh " + data.item.font;
      this.ctx.fillStyle = data.item.color;
      this.ctx.fillText(data.item.text, data.item.width * this.canvas.width / data.width, data.item.height * this.canvas.height / data.height);
    })

    socket.on("laser-start", (data)=>{
      let newElement = document.getElementById(data.userName)
      if(!document.getElementById(data.userName)) {
        newElement = this.createLaser(data);
      }

      newElement.style.left = data.width* this.canvas.width / data.widthCanvas;
      newElement.style.top = data.height* this.canvas.height / data.heightCanvas;
    })

    socket.on("laser-move", (data)=>{
      let laserElement = document.getElementById(data.userName)
      if (laserElement) {
        laserElement.style.left = data.width* this.canvas.width / data.widthCanvas;
        laserElement.style.top = data.height* this.canvas.height / data.heightCanvas;
      }
    })

    socket.on("laser-end", (data)=>{
      this.deleteLaser(data.userName)
    })
  }

  sendText (){
    let data = {
      roomId: this.props.roomId,
      userId: this.props.userId,
      item: {
        tool: this.props.tool,
        height: Number(this.state.hTextBox) + Number(this.state.sizeT),
        width: this.state.wTextBox,
        text: this.state.textDrawText,
        font: this.state.fontText,
        size: this.state.sizeT,
        color: this.state.colorText,
      },
      page: this.props.page,
      height: this.canvas.height,
      width: this.canvas.width
    }
    socket.emit("drawText", data);
    this.setState({ textDrawText : '' });
    $('.input-draw-text, .text-draw').css('display', 'none');
    this.inputDrawText.value = '';
  }

  createLaser = (data) => {
    let p = document.getElementById('laser-container');
    let newElement = document.createElement('div');
    newElement.setAttribute('id', data.userName);
    newElement.setAttribute('class', 'laser-div');
    newElement.innerHTML = `
      <span class ="laser-point"></span>
      <span class="laser-name">${data.userName}</span>
    `;
    p.appendChild(newElement);
    return newElement
  }

  deleteLaser = (elementId) => {
    var element = document.getElementById(elementId);
    element && element.parentNode.removeChild(element);
  }

  componentWillReceiveProps({ tool, items }) {
    items
      .filter(item => this.props.items.indexOf(item) === -1)
      .forEach(item => {
        switch (item.tool) {
          case TOOL_CLEAR_RECT:
            const startX = item.end.x < item.start.x ? item.end.x : item.start.x;
            const startY = item.end.y < item.start.y ? item.end.y : item.start.y;
            const widthX = Math.abs(item.start.x - item.end.x);
            const widthY = Math.abs(item.start.y - item.end.y);
            this.ctx.clearRect(startX - 1, startY - 1, widthX + 1, widthY + 2);
            break;
          case TOOL_TEXT:
            this.ctx.font = item.size * (this.canvas.width / item.widthCanvas) + "vh " + item.font;
            this.ctx.fillStyle = item.color;
            this.ctx.fillText(item.text, item.width * this.canvas.width / item.widthCanvas, item.height * this.canvas.height / item.heightCanvas);
            break;
          default:
            this.initTool(item.tool);
            this.tool.draw(item, this.props.animate);
            break;
        }
      });
    this.initTool(tool);
  }

  initTool(tool) {
    tool != 'text' && $('.input-draw-text, .text-draw').css('display', 'none');
    this.tool = this.props.toolsMap[tool](this.ctx, socket);
  }

  onMouseDown(e) {
    let cursorPosition = this.getCursorPosition(e)
    const { tool, roomId, userName, fillColor, size, color, onItemStart, onDebouncedItemChange, debounceTime } = this.props;
    switch (tool) {
      case TOOL_TEXT:
        this.setState({
          wTextBox: cursorPosition[0],
          hTextBox: cursorPosition[1],
          textDrawText: ''
        });
        $('.input-draw-text, .text-draw').css('display', 'block')
        this.inputDrawText.value = '';
        setTimeout(() => { $('#drawText').focus() }, 100);
        break;
      case TOOL_LASER:
        socket.emit("laser-start", {
          tool, roomId, userName,
          height: cursorPosition[1],
          width: cursorPosition[0],
          heightCanvas: this.canvas.height,
          widthCanvas: this.canvas.width,
        });
        this.laser = setInterval(() => {
          this.setState({onLaserMode : true})
        }, TIME_SEND_LASER_MOVE);
        break;
      default:
        $('.input-draw-text, .text-draw').css('display', 'none')
        const data = this.tool.onMouseDown(...cursorPosition, color, size, fillColor);
        data && data[0] && onItemStart && onItemStart.apply(null, data);
        if (onDebouncedItemChange) {
          this.interval = setInterval(this.onDebouncedMove, debounceTime);
        }
        break;
    }
  }
  onTouchStart(e) {
    let cursorPosition = this.getTouchPosition(e);
    const { tool, roomId, userName, fillColor, size, color, onItemStart, onDebouncedItemChange, debounceTime } = this.props;
    switch (tool) {
      case TOOL_TEXT:
        this.setState({
          wTextBox: cursorPosition[0],
          hTextBox: cursorPosition[1],
          textDrawText: ''
        });
        $('.input-draw-text, .text-draw').css('display', 'block')
        this.inputDrawText.value = '';
        setTimeout(() => { $('#drawText').focus() }, 100);
        break;
      case TOOL_LASER:
        socket.emit("laser-start", {
          tool, roomId, userName,
          height: cursorPosition[1],
          width: cursorPosition[0],
          heightCanvas: this.canvas.height,
          widthCanvas: this.canvas.width,
        });
        this.laser = setInterval(() => {
          this.setState({onLaserMode : true})
        }, TIME_SEND_LASER_MOVE);
        break;
      default:
        $('.input-draw-text, .text-draw').css('display', 'none')
        const data = this.tool.onMouseDown(...cursorPosition, color, size, fillColor);
        data && data[0] && onItemStart && onItemStart.apply(null, data);
        if (onDebouncedItemChange) {
          this.interval = setInterval(this.onDebouncedMove, debounceTime);
        }
        break;
    }
  }

  onDebouncedMove() {
    if (typeof this.tool.onDebouncedMouseMove == 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove());
    }
  }

  onMouseMove(e) {
    let cursorPosition = this.getCursorPosition(e)
    if (this.props.tool == TOOL_LASER){
      if(this.state.onLaserMode){
        const data = {
          tool: this.props.tool,
          height: cursorPosition[1],
          width: cursorPosition[0],
          heightCanvas: this.canvas.height,
          widthCanvas: this.canvas.width,
          userName: this.props.userName,
          roomId: this.props.roomId
        }
        socket.emit("laser-move", data);
        this.setState({onLaserMode : false})
      }
    }
    const data = this.tool.onMouseMove(...cursorPosition);
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
  }
  onTouchMove(e) {
    let cursorPosition = this.getTouchPosition(e)
    if (this.props.tool == TOOL_LASER){
      if(this.state.onLaserMode){
        const data = {
          tool: this.props.tool,
          height: cursorPosition[1],
          width: cursorPosition[0],
          heightCanvas: this.canvas.height,
          widthCanvas: this.canvas.width,
          userName: this.props.userName,
          roomId: this.props.roomId
        }
        socket.emit("laser-move", data);
        this.setState({onLaserMode : false})
      }
    }
    const data = this.tool.onMouseMove(...cursorPosition);
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
  }

  onMouseUp(e) {
    if (this.props.tool == TOOL_LASER){
      if (this.laser) {
        clearInterval(this.laser)
      }
      socket.emit("laser-end", {
        userName: this.props.userName,
        roomId: this.props.roomId
      });
    }
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onTouchEnd(e) {
    if (this.props.tool == TOOL_LASER){
      if (this.laser) {
        clearInterval(this.laser)
      }
      socket.emit("laser-end", {
        userName: this.props.userName,
        roomId: this.props.roomId
      });
    }
    const data = this.tool.onMouseUp(...this.getEndTouchPosition(e));
    data && data[0] && this.props.onCompleteItem && this.props.onCompleteItem.apply(null, data);
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect();
    return [
      e.clientX - left,
      e.clientY - top
    ];
  }

  getTouchPosition(e){
    const { top, left } = this.canvas.getBoundingClientRect();
    return [
      e.touches[0].clientX - left,
      e.touches[0].clientY - top
    ];
  }

  getEndTouchPosition(e){
    const { top, left } = this.canvas.getBoundingClientRect();
    return [
      e.changedTouches[0].clientX - left,
      e.changedTouches[0].clientY - top
    ];
  }


  clearAll() {
    $('.input-draw-text, .text-draw').css('display', 'none')
    let w = this.canvas.width;
    let h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);
  }


  changeSizeText(sizeT) {
    this.setState({ sizeT })
    $('#drawText').focus();
  }

  changeColorText(colorText) {
    this.setState({ colorText })
    $('#drawText').focus();
  }

  render() {
    const { width, height, canvasClassName, fullScreen } = this.props;
    const { sizeT, hTextBox, wTextBox, fontText, colorText, widthCanvas, textDrawText } = this.state;
    return (
      <div id="main">
        <div className='input-draw-text' style={{ top: `calc(${hTextBox}px - ${sizeT}vh)`, left: wTextBox }}>
          <input
            id="drawText" type="text" placeholder={'Enter text...'}
            style={{ 
              fontSize: `${sizeT}vh`, color: colorText, fontFamily: fontText , 
              display: "inline-block",
              maxWidth: `36vh`
            }}
            ref={(text) => { this.inputDrawText = text }}
            onChange={(e) => this.setState({ textDrawText: e.target.value })}
          />
          {
            fullScreen && textDrawText != '' && 
            <Icon 
              onClick = { () => this.sendText()}
              style ={{display: "inline-block", cursor :"poiter"}} 
              src = { IconTextSend }
            />
          }
          
        </div>
        <div className="text-draw" style={{ top: `calc(${hTextBox}px - 12vh)`, left: `calc(${wTextBox}px - 17vh)` }}>
          <select style={{ float: 'left' }} id="sizeText" type="text" 
              ref={(text) => { this.inputFontText = text; }}
              onChange={(e) => {this.setState({ sizeT: $("#sizeText").val() }), $('#drawText').focus()}}>
            <option onClick={() => this.changeSizeText(4)}>4</option>
            <option onClick={() => this.changeSizeText(6)}>6</option>
            <option onClick={() => this.changeSizeText(8)}>8</option>
            <option onClick={() => this.changeSizeText(10)}>10</option>
          </select>
          <div className="dropdown" style={{ float: 'left' }}>
            <button id="dLabel" className="vcr-icon-slide" type="button" title='color' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" 
              style={{ backgroundColor: this.state.colorText, padding: 10, border: 0, width: 23 }}>
            </button>
            <ul className="dropdown-menu vcr-item-colorslide" aria-labelledby="dLabel" >
              <li><a onClick={() => this.changeColorText('#ff0000')} style={{ backgroundColor: '#ff0000', padding: 10 }}></a></li>
              <li><a onClick={() => this.changeColorText('#ffff00')} style={{ backgroundColor: '#ffff00', padding: 10 }}></a></li>
              <li><a onClick={() => this.changeColorText('#0000ff')} style={{ backgroundColor: '#0000ff', padding: 10 }}></a></li>
              <li><a onClick={() => this.changeColorText('#000000')} style={{ backgroundColor: '#000000', padding: 10 }}></a></li>
              <li><a onClick={() => this.changeColorText('#cc33ff')} style={{ backgroundColor: '#cc33ff', padding: 10 }}></a></li>
              <li><a onClick={() => this.changeColorText('#00ff00')} style={{ backgroundColor: '#00ff00', padding: 10 }}></a></li>
            </ul>
          </div>
        </div>
        <canvas
          id="main-canvas"
          style={{ position: "absolute", zIndex: 10 ,cursor: `${this.props.tool != 'laser' ? "crosshair": 'default'}` }}
          ref={(canvas) => { this.canvasRef = canvas; }}
          className={`${canvasClassName} ${this.props.boxW ? 'left0' : ''}`}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseUp}
          onMouseUp={this.onMouseUp}
          onTouchStart = {this.onTouchStart}
          onTouchMove = {this.onTouchMove}
          onTouchEnd = {this.onTouchEnd}
          width={width}
          height={height}
        />
        <div id = "laser-container"></div>
      </div>

    )
  }
}
