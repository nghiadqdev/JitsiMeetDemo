import {Component} from 'react';
import $ from 'jquery';
import {
    TOOL_PENCIL,
    TOOL_LINE,
    TOOL_RECTANGLE,
    TOOL_CLEAR_RECT,
    TOOL_TRIANGLE,
    TOOL_ELLIPSE,
    TOOL_TEXT,
    TOOL_LASER,
} from './module_draw';
import {socket} from '../../../config';
import { getLocalParticipant } from '/features/base/participants';
import { RATIO } from './constants';

export class AbstractSlide extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tool            : TOOL_PENCIL,
            size            : 2,
            color           : '#f00',
            fill            : false,
            fillColor       : '#444444',
            items           : [],
            canvasHeight    : 0,
            canvasWidth     : 0,
            page            : 1,
            checkResize     : true,
            animate         : false,
            loadComplete    : false,
            enableNext      : true,
            enableBack      : true,
        };
        this.nextSlide = this.nextSlide.bind(this);
        this.backSlide = this.backSlide.bind(this);
        this.onDocumentComplete = this.onDocumentComplete.bind(this);
        this.onPageComplete = this.onPageComplete.bind(this);
        this.sendDrawWeb = this.sendDrawWeb.bind(this);
        this.undoDraw = this.undoDraw.bind(this);
        this.convertPoint = this.convertPoint.bind(this);
        this.socketListenEvent = this.socketListenEvent.bind(this);
        this.onResizePdf = this.onResizePdf.bind(this);
    }

    socketListenEvent(){
        const { roomId } = this.props
        socket.on('whoConnected', () => {
            socket.emit('join-room', { roomId });
        });

        socket.on("refreshVCR", (data) => this.refreshVCR(data));

        socket.on("nextSlide", (data) => this.setState({
            enableNext : true,
            page: data.page
        }));
        socket.on("backSlide", (data) => this.setState({
            enableBack : true,
            page: data.page
        }));

        socket.on("sendDrawWeb", async (data) => {
            let items = [];
            const itemConvert = await this.convertPoint(data);
            items.push(itemConvert)
            this.setState({items});
        })

        socket.on('clearCanvas', () => {
            if(this.sketchPad) this.sketchPad.clearAll()
        } );

        $(window).resize(() => this.onResizePdf());
    }

    nextSlide() {
        const { page, pages } = this.state;
        const { roomId, _fullScreen } = this.props;
        const newPage = page + 1
        if(newPage <= pages) {
            _fullScreen && this.setState({enableNext: false});
            socket.emit("nextSlide",{ roomId, page: newPage });
        }
    }
    
    backSlide() {
        const { page } = this.state;
        const { roomId, _fullScreen } = this.props;
        if(page > 1) {
            _fullScreen && this.setState({enableBack: false});
            socket.emit("backSlide",{ roomId, page: page - 1 });
        }
    }
    
    onDocumentComplete = (pages) => {
      this.setState({ page: 1, pages });
    }

    onPageComplete = (page) => {
        const { roomId } = this.props;
        if($("#drawSlide").width() * RATIO < $("#vcr-slide-box").height()) {
            let h = $("#drawSlide").width() * RATIO;
            let w = $("#drawSlide").width();
            this.setState({ 
                page,
                canvasWidth : w,
                canvasHeight: h,
                loadComplete: true
            }, ()=> {
                let cvSlide = document.getElementsByClassName("canvas-slide");
                if(cvSlide && cvSlide[0]) {
                    cvSlide[0].style.height = h;
                    cvSlide[0].style.width = w;
                }
            })
        } else {
            let h = $("#vcr-slide-box").height();
            let w = $("#vcr-slide-box").height() / RATIO;
            this.setState({ 
                page,
                canvasWidth : w,
                canvasHeight: h,
                loadComplete: true
            }, ()=> {
                let cvSlide = document.getElementsByClassName("canvas-slide");
                if(cvSlide && cvSlide[0]) {
                    cvSlide[0].style.height = h;
                    cvSlide[0].style.width = w;
                }
            })
        }
        socket.emit("refreshVCR", roomId);        
    }

    sendDrawWeb(item){
        const { userId, roomId } = this.props;
        const { canvasHeight: height, canvasWidth: width, page } = this.state;
        socket.emit("sendDrawWeb",{ roomId, page, userId, height, width, item });
    }

    undoDraw(){
        const { roomId } = this.props;
        const { page } = this.state;
        socket.emit("undo",{ roomId, page });
    }
    
    async refreshVCR(data) {
        if(!this.sketchPad) return;
        this.setState({ page: data.page });
        this.sketchPad.clearAll();
        let items = [];
        const promise = data.dataItem.map(async item => {
            if(item.page == data.page){
                const itemConvert = await this.convertPoint(item);
                items.push(itemConvert)
            }
        })
        await Promise.all(promise)
        this.setState({items});
    }

    async convertPoint(itemPoint) {
        let data = {}
        const { width, item } = itemPoint
        const { color, id, tool, size } = item
        const rateWCanvas = this.state.canvasWidth / width;
        switch (tool) {
            case TOOL_LINE:
            case TOOL_ELLIPSE:
            case TOOL_RECTANGLE:
            case TOOL_TRIANGLE:
            case TOOL_CLEAR_RECT:
                const { end, start } = item;
                data = {
                    color, id, tool, size: size * rateWCanvas,
                    end : {
                        x: end.x * rateWCanvas,
                        y: end.y * rateWCanvas,
                    },
                    start : {
                        x: start.x * rateWCanvas,
                        y: start.y * rateWCanvas,
                    },
                };
                break;
            case TOOL_PENCIL:
                data = { color, id, tool, points: [], size: size * rateWCanvas }
                const promise = item.points.map(point => {
                    const { x, y } = point;
                    data.points.push({
                        x: x * rateWCanvas,
                        y: y * rateWCanvas
                    })
                })
                await Promise.all(promise);
                break;
            case TOOL_TEXT:
                const { height, width } = itemPoint
                data = { ...item, heightCanvas: height, widthCanvas: width}
            default:
                break;
        }
        return data;
    }

    onResizePdf(refreshPending){
        const {roomId} = this.props;
        let canvasHeight, canvasWidth;
        if ($('#drawSlide').width() * RATIO <= $('#vcr-slide-box').height()) {
            canvasHeight = $('#drawSlide').width() * RATIO;
            canvasWidth = $('#drawSlide').width();
        } else {
            canvasHeight = $('#vcr-slide-box').height();
            canvasWidth = $('#vcr-slide-box').height()/RATIO;
        }
        this.setState({ canvasHeight, canvasWidth }, () => {
            const cvSlide = document.getElementsByClassName('canvas-slide');
            if (cvSlide && cvSlide[0]) {
                cvSlide[0].style.height = canvasHeight;
                cvSlide[0].style.width = canvasWidth;
            }
        });
        if(!refreshPending) socket.emit('refreshVCR', roomId);
    }
}
export function _mapStateToProps(state) {
    let localParticipant = getLocalParticipant(state);
    let { userList , userInfo, roomInfo } = state['emg'];
    let user = userList.find(x=>x.id == localParticipant.id)
    let enableDraw = user ? user.draw : false;
    let { role: userRole, userName, id: userId } = userInfo;
    let { enableVideo, slide, showQuiz, countDown, largeView } = roomInfo;
    return {
        enableVideo, slide, showQuiz,
        userRole, userName, userId,
        enableDraw,countDown,largeView,
        roomId: state['features/base/conference'].room,
        _tileViewEnabled: state['features/video-layout'].tileViewEnabled,
        _fullScreen: state['features/toolbox'].fullScreen,
    };
}