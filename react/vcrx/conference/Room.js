import _                                from 'lodash';
import React, { Component }             from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { Filmstrip }                    from '/features/filmstrip';
import { 
    Header,
    Slide,
    VideoWarmup,
    Timer,
    TeacherCamera,
    ModalListAnswer,
    UserList,
    SmallTeacherCamera,
    CameraSmallLargeView,
    CountDown
}                                       from './components';
import { Chat }                         from '/features/chat';
import { LAYOUTS, getCurrentLayout } from '/features/video-layout';
import CameraParticipant from './components/camera-participant/CameraParticipant';
import { socket } from '../config';
import {changeRoomInfo, changeUserInfo} from '../actions'
import { LARGE_VIEW_MODE, ROLE_STUDENT, LARGE_ICON_DRAWING } from '/vcrx/base';
import { Icon, IconChevronsDown, IconChevronsUp } from '/features/base/icons';
import { Resizable, ResizableBox } from 'react-resizable';
import Labels from '/features/conference/components/web/Labels';

declare var APP: Object;
declare var interfaceConfig: Object;

const LAYOUT_CLASSNAMES = {
    [LAYOUTS.HORIZONTAL_FILMSTRIP_VIEW]: 'horizontal-filmstrip',
    [LAYOUTS.TILE_VIEW]: 'tile-view',
    [LAYOUTS.VERTICAL_FILMSTRIP_VIEW]: 'vertical-filmstrip'
};

class Room extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            width: 700, 
            height: 393.75
        };
    }

    componentDidMount() {
        const height = this.viewportToPixels('31vh')
        this.setState({width: height * 1.7777777777777777777777777, height})
        socket.on("set-on-state-id", function(data) {
            APP.store.dispatch(changeRoomInfo({ onStateId : data.onStateId }));
        })
        socket.on("on-state", function(data) {
            APP.store.dispatch(changeRoomInfo({ onState : data.onState }));
        })
        socket.on("end-session",function () {
            window.history.back();
        })

        socket.on("enable-count-down",function (data) {
            APP.store.dispatch(changeRoomInfo({ countDown : data.countDown }));
        })
    }
    viewportToPixels(value) {
        var parts = value.match(/([0-9\.]+)(vh|vw)/)
        var q = Number(parts[1])
        var side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
        return side * (q/100)
    }

    onResize(event, {element, size, handle}){
        if (size.height > this.viewportToPixels('31vh') && size.height < this.viewportToPixels('65vh')){
            this.setState({width: size.width, height: size.height});
        }
    };

    _openChat(showChat) {
        APP.store.dispatch(changeUserInfo({
            showChat
        }));
    }

    render() {
        const { width, height } = this.state;
        const { filmStripOnly } = interfaceConfig;
        const {_fullScreen, _tileViewEnabled, _enableVideo, _onState, 
            _largeView, _role, _showChat, _showSlide, _swapCam,
            _largeSmallCam, countDown
        } = this.props;
        const renderCountDown = countDown && _largeView == "1" && _role == ROLE_STUDENT

        const largeMode = _largeView == 1 && LARGE_VIEW_MODE.includes(_role)
        return (
            <div id="vcr-body">
                {_fullScreen ? 
                    <div style = {{ backgroundColor: "#000", height: '100vh', width: '100vw', position: 'absolute', zIndex : 9999 }}>
                        <Slide />
                    </div> : null
                }
                { renderCountDown &&
                    <div style ={{ position: "absolute", top: '10vh', left: '1vw', zIndex: 999 }}>
                        <CountDown/>
                    </div>
                }
                { largeMode ? <div id = 'largeHeader'><Header/></div> : <Header/> }
                {/* <Labels/> */}
                <ModalListAnswer/>
                <UserList/>
                <div className="row" id = {`${largeMode ? 'largeMiddle' : 'midle'}`}>
                    {_tileViewEnabled && _largeSmallCam && <CameraSmallLargeView/>}
                    <div className = {`${largeMode ? 'large-student-area' : 'col-xs-9 left-box'}`} >
                        {!largeMode &&
                            <div className = {`col-md-12 ${_tileViewEnabled ? 'hiddenElement' : 'enableElement'}`} id = "slide-area">
                                {!_fullScreen && <Slide />}
                                { _enableVideo && <VideoWarmup/>} 
                                { _onState && !_swapCam && <CameraParticipant/>} 
                            </div>
                        }
                        <div className = "col-md-12" id = "student-area"
                        style = {largeMode ? { position: 'absolute', bottom: 0, zIndex: 2}: {}}>
                            {largeMode && <Timer/>}
                            <Filmstrip filmstripOnly={filmStripOnly} />
                        </div>
                    </div>
                    <div className ={`${largeMode ? '' : 'col-xs-3'} ${_swapCam && 'hiddenElement'}`}>
                        <div className="col-md-12" id = "teacher-area"
                            style = {largeMode ? { height: '100vh', position: 'absolute', top: 0}: {}}>
                            <TeacherCamera />
                        </div>
                        {
                            !largeMode && 
                            <>
                                <div className ="col-md-12" id = "time-area">
                                    <Timer/>
                                </div>
                                <div className="col-md-12" id = "chat-area" >
                                    <Chat />
                                </div>
                                <div class="col-md-12 support-area" >
                                    <div>Hotline: {config.support.hotline}</div>
                                    <div>Email: {config.support.email}</div>
                                </div>
                            </>
                        }
                    </div>
                </div>
                {
                    _swapCam ?
                    <div id = 'slidespace'>
                        <Slide />
                        { _enableVideo && <VideoWarmup/>}
                        { _onState && <CameraParticipant/>}
                    </div> : null
                }
                {largeMode && 
                    <div id = 'largeSlide' className = {`${_showSlide ? 'zIndex-10': ''} `}>
                        <Resizable
                            height={this.state.height} width={this.state.width}
                            className="custom-box box resize-slide-box" 
                            style ={{height: this.state.height, width: this.state.width}}
                            handle={<span className="custom-handle custom-handle-se"/>}
                            handleSize={[18, 18]}
                            onResize ={(event, {element, size, handle})=> this.onResize(event, {element, size, handle})} 
                            lockAspectRatio={true}>
                            <div>
                                {_swapCam ?
                                    <SmallTeacherCamera/>
                                    : 
                                    <>
                                        <Slide boxW ={width} boxH = {height} test = {4}/>
                                        { _enableVideo && <VideoWarmup/>}
                                        { _onState && <CameraParticipant/>} 
                                    </>
                                }
                            </div>
                        </Resizable>
                    </div>
                }
                {largeMode && 
                    <>
                        <div id = 'largeChat' className = {!_showChat ?'hiddenElement' : ''}>
                            {<Chat />}
                        </div>
                        <div className = {`openChat ${_showChat && 'rdsOpen'}`} onClick = { () => this._openChat(!_showChat)}>
                            <span>Open chat</span> <Icon src = { _showChat ? IconChevronsDown : IconChevronsUp}/>
                        </div>
                    </>
                }
                {/* <div className = "public-footer">
                    <div className = "support-info">
                        <span><b>Hotline:</b> {config.support.hotline} - <b>Email:</b> {config.support.email}</span>
                    </div>
                </div> */}
            </div>
        );
    }
}


function _mapStateToProps(state) {
    const currentLayout = getCurrentLayout(state);
    let {enableVideo, onState, largeView, largeSmallCam, countDown} = state['emg'].roomInfo
    let {showChat, showSlide, swapCam} = state['emg'].userInfo;
    let localMute = APP.conference.isLocalAudioMuted()
    let user = APP.store.getState()['emg'].userList.find(({local}) => local == true)
    let draw = false;
    if(user) draw = user.draw;
    return {
        _enableVideo: enableVideo,
        _tileViewEnabled: state['features/video-layout'].tileViewEnabled,
        _layoutClassName: LAYOUT_CLASSNAMES[currentLayout],
        _onState: onState,
        _fullScreen: state['features/toolbox'].fullScreen,
        _largeView: largeView,
        _role: state['emg'].userInfo.role,
        _showChat: showChat,
        _showSlide: showSlide,
        _swapCam: swapCam,
        _largeSmallCam: largeSmallCam,
        localMute,
        onDraw: draw,
        countDown
    };
}

export default reactReduxConnect(_mapStateToProps)(Room);
