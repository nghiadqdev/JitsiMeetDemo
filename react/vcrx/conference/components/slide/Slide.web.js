import React from 'react';
import { connect } from 'react-redux';
import {
    SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE, TOOL_TEXT, TOOL_LASER
} from './module_draw';
import { socket } from '../../../config';
import PDF from './react-pdf-js/src';
import { AbstractSlide, _mapStateToProps } from './AbstractSlide';
import {
    ROLE_TEACHER, ROLE_KEY_TEACHER, ROLE_AC, ROLE_KEY_AC, ROLE_STUDENT, ROLE_KEY_STUDENT,
} from '/vcrx/base';
import { Quiz, CountDown } from '../';
import { 
    ICON_MORE, TOOL_COMPACT, LIST_SIZE, LIST_COLOR,
    PENCIL_SRC, LINE_SRC, RECTANGLE_SRC, ELLIPSE_SRC, TEXT_SRC, LASER_SRC,
    COLOR_SRC, CLEAR_SRC, NEXT_SRC, BACK_SRC, UNDO_SRC, SIZE_SRC,
    KEY_EVENT_NEXT_SLIDE, KEY_EVENT_BACK_SLIDE
} from './constants';
import {setFullScreen} from '/features/toolbox/actions';
import KeyboardEventHandler from 'react-keyboard-event-handler';

class Slide extends AbstractSlide {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.socketListenEvent() 
    }

    UNSAFE_componentWillReceiveProps({ boxW, boxH }) {
        if(boxW != this.props.boxW && boxH != this.props.boxH) {
            this.onResizePdf(this.state.refreshPending)
            if(!this.state.refreshPending){
                this.setState({refreshPending: true})
                setTimeout(() => { this.setState({refreshPending: false})}, 10);
            }
        }
    }

    conpareKeycode(key) {
        const { _fullScreen } = this.props;
        const { tool , enableNext, enableBack } = this.state;
        if (tool != TOOL_TEXT) {
            if (_fullScreen && KEY_EVENT_NEXT_SLIDE.includes(key) && enableNext ) {
                this.nextSlide()
            }
            if (_fullScreen && KEY_EVENT_BACK_SLIDE.includes(key) && enableBack) {
                this.backSlide()
            }
        }
        
        if (_fullScreen && key == 'esc'){
            APP.store.dispatch(setFullScreen(false));
        }
    }

    checkColor(size) {
        return size == this.state.size ? 'tomato' : '#000';
    }

    getRoleKey= role => {
        switch (role) {
        case ROLE_AC:
            return ROLE_KEY_AC;
        case ROLE_STUDENT:
            return ROLE_KEY_STUDENT;
        case ROLE_TEACHER:
            return ROLE_KEY_TEACHER;
        case 'JIBRI':
            return 'JIBRI';
        }
    }

    getImgTool = () => {
        const { tool } = this.state;
        let src;

        switch (tool) {
            case TOOL_PENCIL:
                src = PENCIL_SRC;
                break;
            case TOOL_LINE:
                src = LINE_SRC;
                break;
            case TOOL_RECTANGLE:
                src = RECTANGLE_SRC;
                break;
            case TOOL_ELLIPSE:
                src = ELLIPSE_SRC;
                break;
            case TOOL_TEXT:
                src = TEXT_SRC;
                break;
            case TOOL_LASER:
                src = LASER_SRC;
                break;
            default:
                src = PENCIL_SRC;
                break;
            }

        return src;
    }
    
    _renderButtonToolDraw(toolInfo, key) {
        const { tool, src, title } = toolInfo;
        if (config.collapseDrawTool) {
            return (
                <li key = {key}>
                    <div
                        className = { `vcr-tool-icon ${tool == this.state.tool && 'border'}` }
                        onClick = { () => this.setState({ tool }) }>
                        <img src = { src } className = 'icon-tool' title = {title}/>
                    </div>
                </li>
            );
        }

        return (
            <div key = {key}
                className = { `vcr-tool-icon ${tool == this.state.tool && 'border'}` }
                onClick = { () => this.setState({ tool }) }>
                <img src = { src } className = 'icon-tool' title = {title} />
            </div>
        );
    }

    renderToolDraw() {
        const { _fullScreen } = this.props;
        if (config.collapseDrawTool) {
            return (
                <div className = 'vcr-tool-icon'>
                    <div id = 'dTool' data-toggle = 'dropdown' aria-haspopup = 'true' aria-expanded = 'false'>
                        <img src = { this.getImgTool() } className = 'icon-tool' title = 'Tool draw' />
                        <img src = { ICON_MORE } className = 'extra-icon-tool' title = 'Tool draw' />
                    </div>
                    <ul className = {`dropdown-menu vcr-item-tool-slide ${_fullScreen && 'full-dropdown-menu'}`} aria-labelledby = 'dTool' >
                        {TOOL_COMPACT.map((toolInfo, key) => this._renderButtonToolDraw(toolInfo, key))}
                    </ul>
                </div>
            );
        }

        return TOOL_COMPACT.map((toolInfo, key) => this._renderButtonToolDraw(toolInfo, key));
    }

    _renderNoDraw () {
        const { userRole, enableDraw } = this.props;
        const { canvasHeight , canvasWidth } = this.state;
        return (
            <div id = 'noDraw'
                className = { `${(enableDraw || config.permission.onDraw.includes(userRole)) && 'hiddenElement'}` }
                style = {{ height: canvasHeight, width: canvasWidth }} 
            />
        );
    }

    _renderQuiz(){
        const { canvasHeight, canvasWidth, page } = this.state;
        const { showQuiz } = this.props;
        return (
            <div id = 'quiz'
                className = { `${!showQuiz && 'hiddenElement'}` }
                style = {{ height: canvasHeight, width: canvasWidth }}>
                <Quiz pageNumber = { page } />
            </div>
        );
    }

    _renderSketchPad(){
        const { tool, size, color, fill, fillColor, items, checkResize,
            canvasHeight, canvasWidth, drawText, animate, page } = this.state;
        const { userRole, userId, roomId, boxW, _fullScreen } = this.props;
        return (
            <SketchPad
                ref = { o => { this.sketchPad = o } }
                animate = { animate }
                size = { size }
                checkResize = { checkResize }
                color = { color }
                fillColor = { fill ? fillColor : '' }
                items = { items }
                tool = { tool }
                drawText = { drawText }
                fullScreen = {_fullScreen}
                socket = { socket }
                height = { canvasHeight }
                width = { canvasWidth }
                userId = {userId}
                userName = { `${this.getRoleKey(userRole)}-${userId}` }
                roomId = { roomId }
                page = { page }
                boxW = { boxW }
                onCompleteItem = { i => this.sendDrawWeb(i) } />
        );
    }

    _renderPDF(){
        const { page } = this.state;
        const { slide, _fullScreen } = this.props
        return (
            <PDF
                className = {`canvas-slide ${_fullScreen && 'full-canvas-slide'}`}
                file = { slide }
                onDocumentComplete = { this.onDocumentComplete }
                onPageComplete = { this.onPageComplete }
                page = { page }
                fullScreen = { _fullScreen }
                tileViewEnabled = { this.props._tileViewEnabled } />
        );
    }

    _renderNextBackSlide(){
        const { page, loadComplete } = this.state;
        const { userRole, enableVideo, _fullScreen } = this.props;
        if(_fullScreen){
            return (
                config.permission.onNextSlide.includes(userRole) ? 
                <div className = { `full-page-box ${enableVideo && 'hiddenElement'}` }>
                    {
                        loadComplete
                        && <div>
                            <div className = 'full-prev-slide' onClick = { () => this.backSlide() }>
                                <img src = { BACK_SRC } className = 'full-slide-image' title = 'Previous Slide' />
                            </div>
                            <div className = 'full-page' >{page}</div>
                            <div className = 'full-next-slide' onClick = { () => this.nextSlide() }>
                                <img src = { NEXT_SRC } className = 'full-slide-image' title = 'Next Slide' />
                            </div>
                        </div>
                    }
                </div>
                : null
            );
        }
        return (
            config.permission.onNextSlide.includes(userRole) ? 
                <div className = { `vcr-next-page ${enableVideo && 'hiddenElement'}` }>
                    {
                        loadComplete
                        && <div className = 'vcr-content-next-page is-centered'>
                            <div className = 'prev-slide-image' onClick = { () => this.backSlide() }>
                                <img src = { BACK_SRC } className = 'slide-image' title = 'Previous Slide' />
                            </div>
                            <div className = 'new-page' >{page}</div>
                            <div className = 'next-slide-image' onClick = { () => this.nextSlide() }>
                                <img src = { NEXT_SRC } className = 'slide-image' title = 'Next Slide' />
                            </div>
                        </div>
                    }
                </div>
            : null
        );
    }

    _renderChooseColor(){
        const { _fullScreen } = this.props;
        return (
            <div className = 'vcr-tool-icon'>
                <div id = 'dLabel' data-toggle = 'dropdown' aria-haspopup = 'true' aria-expanded = 'false'>
                    <img src = { COLOR_SRC } className = 'icon-tool' title = 'Color' />
                    <img src = { ICON_MORE } className = 'extra-icon-tool' title = 'More' />
                </div>
                <ul className = {`dropdown-menu vcr-item-color-slide ${_fullScreen && 'full-dropdown-menu'}`} aria-labelledby = 'dLabel' >
                    {
                        LIST_COLOR.map((color, key) => {
                            return (
                                <li key = {key}>
                                    <a onClick={() => this.setState({ color })} style ={{ backgroundColor: color }}/>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    _renderSize(){
        const { _fullScreen } = this.props;
        return (
            <div className = 'vcr-tool-icon' >
                <div id = 'dSize' data-toggle = 'dropdown' aria-haspopup = 'true' aria-expanded = 'false' >
                    <img src = { SIZE_SRC } className = 'icon-tool' title = 'Change size' />
                    <img src = { ICON_MORE } className = 'extra-icon-tool' title = 'Change size' />
                </div>
                <ul className = {`dropdown-menu vcr-item-size-draw ${_fullScreen && 'full-dropdown-menu'}`} aria-labelledby = 'dSize' >
                    {
                        LIST_SIZE.map((size, key) => {
                            return(
                                <li key = {key}>
                                    <a onClick = { () => this.setState({ size }) }>
                                        <p style = {{ height: `${size}px`, background: this.checkColor(size) }}/>
                                    </a>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        
        );
    }

    _renderClearTool(){
        const { userRole, roomId, _fullScreen } = this.props;
        const { page } = this.state;
        return(
            config.permission.onDraw.includes(userRole) && 
                <>
                    <div className = 'vcr-tool-icon' onClick = { () => this.undoDraw()}>
                        <img src = { UNDO_SRC }  className = 'icon-tool' title = 'Undo' />
                    </div>
                    <div className = 'vcr-tool-icon' onClick = { () => { socket.emit("clearCanvas", { page, roomId }) } }>
                        <img src = { CLEAR_SRC } className = 'icon-tool' title = 'Clear all' />
                    </div>
                </>
        );
    }

    _renderCountDown(){
        return (
            <div style ={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 999
            }}>
                <CountDown/>
            </div>
        );
    }

    render() {
        const { canvasHeight, loadComplete } = this.state;
        const { userRole, slide, enableDraw, _fullScreen, countDown, largeView } = this.props
        const renderCountDown = countDown && !(largeView == 1 && userRole == ROLE_STUDENT)
        return (
            <div className = 'vcr-slider vcr-box-list' >
                {
                    _fullScreen && <KeyboardEventHandler
                        handleKeys={KEY_EVENT_NEXT_SLIDE.concat(KEY_EVENT_BACK_SLIDE)}
                        onKeyEvent={ (key) => this.conpareKeycode(key) }/>
                }
                
                <div id = 'vcr-slide-box' className = 'vcr-slide-box'>
                    <div id = 'drawSlide' className = 'col-md-12 col-xs-12 center-n-p' >
                        {slide && 
                            <div style ={{position:'relative'}}>
                                {renderCountDown && this._renderCountDown()}
                                {this._renderNoDraw()}
                                {this._renderQuiz()}
                                {this._renderSketchPad()}
                                {this._renderPDF()}
                                {this._renderNextBackSlide()}
                            </div>
                        }
                        {loadComplete && 
                            <div
                                className = {`
                                    vcr-slide-tool 
                                    ${enableDraw || config.permission.onDraw.includes(userRole) ? '' : 'hiddenElement'}
                                    ${(_fullScreen || (enableDraw && largeView)) && 'full-screen-tool-box'}
                                `}
                                id = { 'vcr-slide-tool' } style = {!(_fullScreen || (enableDraw && largeView)) ? { height: canvasHeight } : {}}>
                                {this.renderToolDraw()}
                                {this._renderClearTool()}
                                {this._renderChooseColor()}
                                {this._renderSize()}
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(_mapStateToProps)(Slide);
