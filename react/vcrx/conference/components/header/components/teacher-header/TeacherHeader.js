import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import AudioMuteButton from '/features/toolbox/components/AudioMuteButton';
import VideoMuteButton from '/features/toolbox/components/VideoMuteButton';
import {SettingsButton} from '/features/settings';
import {setFullScreen} from '/features/toolbox/actions';
import { TileViewButton } from '/features/video-layout';
import {socket} from '/vcrx/config';
import { CREATE_QUIZ } from '/vcrx/base';
import { Icon, 
    IconShareVideo, 
    IconFullScreen, 
    IconExitFullScreen, 
    IconMuteEveryoneElse, 
    IconQuiz,
    IconShareDesktop,
    IconOnState,
    IconUserList,
    IconPresentation,
    IconCountDown
} from '/features/base/icons';

import {
    LiveStreamButton,
    RecordButton
} from '/features/recording';

import { getLocalVideoTrack, toggleScreensharing } from '/features/base/tracks';
import { OverflowMenuItem } from '/features/base/toolbox';
import ToolbarButton from '/features/toolbox/components/web/ToolbarButton';

import {
    ACTION_SHORTCUT_TRIGGERED,
    createShortcutEvent,
    sendAnalytics
} from '/features/analytics';
import { getActiveSession } from '/features/recording/functions';
import { JitsiRecordingConstants } from '/features/base/lib-jitsi-meet';
import { changeRoomInfo } from '/vcrx/actions';

class TeacherHeader extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {}
        this._onToolbarToggleScreenshare = this._onToolbarToggleScreenshare.bind(this);
    }

    onCreateQuiz() {
        socket.emit("show-quiz",{
            show : !this.props._showQuiz,
            room : this.props._room
        })
        APP.conference.sendCommandVcrxRoom( CREATE_QUIZ, JSON.stringify({show : !this.props._showQuiz}));  
    }

    onFullScreen() {
        APP.store.dispatch(setFullScreen(!this.props._fullScreen));
    }

    onEndSession() {
        confirm("Are you sure want to log out?") && this.endSession()
    }
    
    endSession() {
        socket.emit("end-session",this.props._room)
        window.history.back();
    }

    onOpenVideoWarmup () {
        socket.emit("open-video",{
            open : ! this.props._enableVideo,
            room : this.props._room
        })
    }

    onMuteAll(){
        socket.emit('mute-all',this.props._room);
    }

    onState(){
        socket.emit("on-state", {
            room: this.props._room,
            onState : !this.props._onState
        })
        APP.store.dispatch(changeRoomInfo({ onState : !this.props._onState }));
    }

    _isDesktopSharingButtonVisible() {
        const {
            _desktopSharingEnabled,
            _desktopSharingDisabledTooltipKey
        } = this.props;

        return (_desktopSharingEnabled || _desktopSharingDisabledTooltipKey) && this.props._enableDesktopSharing  ;
    }
    _onToolbarToggleScreenshare: () => void;

    _onToolbarToggleScreenshare() {
        if (!this.props._desktopSharingEnabled) {
            return;
        }

        sendAnalytics(createShortcutEvent(
            'toggle.screen.sharing',
            ACTION_SHORTCUT_TRIGGERED,
            { enable: !this.props._screensharing }));

        this._doToggleScreenshare();
    }

    _doToggleScreenshare() {
        if (this.props._desktopSharingEnabled) {
            this.props.dispatch(toggleScreensharing());
        }
    }

    _renderDesktopSharingButton(isInOverflowMenu = false) {
        const {
            _desktopSharingEnabled,
            _desktopSharingDisabledTooltipKey,
            _screensharing,
            t
        } = this.props;

        if (!this._isDesktopSharingButtonVisible()) {
            return null;
        }

        if (isInOverflowMenu) {
            return (
                <OverflowMenuItem
                    accessibilityLabel
                        = { "Share your screen " }
                    disabled = { _desktopSharingEnabled }
                    icon = { IconShareDesktop }
                    iconId = 'share-desktop'
                    key = 'desktop'
                    onClick = { this._onToolbarToggleScreenshare }
                    text = {_screensharing ? "Stop screen sharing" : "Start screen sharing"} />
            );
        }

        const tooltip = _desktopSharingEnabled
        ? "Toggle screenshare" : _desktopSharingDisabledTooltipKey;

        return (
            <ToolbarButton
                accessibilityLabel
                    = { "Share your screen" }
                disabled = { !_desktopSharingEnabled }
                icon = { IconShareDesktop }
                onClick = { this._onToolbarToggleScreenshare }
                toggled = { _screensharing }
                tooltip = { tooltip } 
                className = {`headerTool ${_screensharing && 'isMosaic'}`}/>
        );
    }

    showTitle(key) {
        $(`.${key}`).css('display', 'block');
    }

    hideTitle(key) {
        $(`.${key}`).css('display', 'none');
    }

    setCountDown(countDown){
        APP.store.dispatch(changeRoomInfo({ countDown }));
        socket.emit("enable-count-down", {
            room: this.props._room,
            countDown
        })
    }
    
    render() {
        return(
            <>
                <div className="exitClass headerTool" onClick={() => this.onEndSession()}>
                    <span className="bold">{this.props._languages.vcrx.header.end_session}</span>
                </div>
                <div className="mediaControl headerTool">
                    <SettingsButton />
                </div>
                {
                    this.props._enableRecording ? 
                    (<div className = {`mediaControl headerTool ${this.props._isRecordingRunning && 'isMosaic'}`}>
                        <RecordButton
                            key = 'record'
                            showLabel = { false } />
                    </div>) : null
                }   
                {
                    this.props._enableStreaming ? 
                    ( <div className="mediaControl headerTool">
                        <LiveStreamButton
                            key = 'livestreaming'
                            showLabel = { false } />
                    </div>) : null
                }
                <div className="mediaControl headerTool">
                    <VideoMuteButton />
                </div>
                <div className="mediaControl headerTool">
                    <AudioMuteButton />
                </div>
                <div className={`headerTool pad0101 ${this.props._tileViewEnabled && 'isMosaic'}`}>
                    <TileViewButton/>
                </div>
                <div className={`headerTool ${this.props._enableVideo && 'isMosaic'}`} 
                    onClick={() => this.onOpenVideoWarmup()}
                    onMouseOver={ () => this.showTitle('videoWarmup')}
                    onMouseOut={ () => this.hideTitle('videoWarmup')}>
                    <Icon src = { IconShareVideo }/>
                    <span className = 'videoWarmup'>Video</span>
                </div>
                <div className={`headerTool ${this.props._fullScreen && 'isMosaic'}`} onClick={() => this.onFullScreen()}
                    onMouseOver={ () => this.showTitle('fullScreen')}
                    onMouseOut={ () => this.hideTitle('fullScreen')}>
                    <Icon src = { IconPresentation  }/>
                    <span className = 'fullScreen'>Presentation</span>
                </div>
                <div className={`headerTool ${this.props._showQuiz && 'isMosaic'}`} 
                    onClick={() => this.onCreateQuiz()}
                    onMouseOver={ () => this.showTitle('oQuiz')}
                    onMouseOut={ () => this.hideTitle('oQuiz')}>
                    <Icon src = { IconQuiz }/>
                    <span className = 'oQuiz'>Quiz</span>
                </div>

                <div className="headerTool" onClick={() => this.onMuteAll()}
                    onMouseOver={ () => this.showTitle('muteAll')}
                    onMouseOut={ () => this.hideTitle('muteAll')}>
                    <Icon src = { IconMuteEveryoneElse }/>
                    <span className = 'muteAll'>Mute all</span>
                </div>
                <div 
                    className={`headerTool ${this.props._onState && 'isMosaic'}`} 
                    onClick={() => this.onState()}
                    onMouseOver={ () => this.showTitle('onState')}
                    onMouseOut={ () => this.hideTitle('onState')}
                    >
                    <Icon src = { IconOnState }/>
                    <span className = 'onState'>On stage</span>
                </div>
                <div 
                    data-toggle="modal" data-target={"#modal-user-list"}
                    className={`headerTool ${this.props._openGrades && 'isMosaic'}`} 
                    onMouseOver={ () => this.showTitle('grades')}
                    onMouseOut={ () => this.hideTitle('grades')}
                    >
                    <Icon src = { IconUserList }/>
                    <span className = 'grades'>Grades</span>
                </div>
                <div 
                    className={`headerTool ${this.props.countDown && 'isMosaic'}`} 
                    onClick={() => this.setCountDown(!this.props.countDown)}
                    onMouseOver={ () => this.showTitle('is-count-down')}
                    onMouseOut={ () => this.hideTitle('is-count-down')}
                    >
                    <Icon src = { IconCountDown }/>
                <span className = 'is-count-down'>Count down</span>
                </div>
                {this._renderDesktopSharingButton()}
            </>
        );
    }
}
function _mapStateToProps(state) {
    let desktopSharingDisabledTooltipKey;
    let { desktopSharingEnabled } = state['features/base/conference'];
    const localVideo = getLocalVideoTrack(state['features/base/tracks']);
    if (state['features/base/config'].enableFeaturesBasedOnToken) {
        // we enable desktop sharing if any participant already have this
        // feature enabled
        desktopSharingEnabled = getParticipants(state)
            .find(({ features = {} }) =>
                String(features['screen-sharing']) === 'true') !== undefined;

        // we want to show button and tooltip
        if (state['features/base/jwt'].isGuest) {
            desktopSharingDisabledTooltipKey
                = "Guests can't screen share.";
        } else {
            desktopSharingDisabledTooltipKey
                = "Screen sharing disabled.";
        }
    }
    return {
        _fullScreen: state['features/toolbox'].fullScreen,
        _languages: state['emg'].languages,
        _enableVideo : state['emg'].roomInfo.enableVideo,
        _role : state['emg'].userInfo.role,
        _room : state['features/base/conference'].room,
        _showQuiz : state['emg'].roomInfo.showQuiz,
        countDown : state['emg'].roomInfo.countDown,
        _tileViewEnabled: state['features/video-layout'].tileViewEnabled,
        _desktopSharingEnabled: desktopSharingEnabled,
        _screensharing: localVideo && localVideo.videoType === 'desktop',
        _desktopSharingDisabledTooltipKey: desktopSharingDisabledTooltipKey,
        _isRecordingRunning:
            Boolean(getActiveSession(state, JitsiRecordingConstants.mode.FILE)),
        _enableDesktopSharing : config.adminFeatures.enableSharingDesktop,
        _enableStreaming : config.adminFeatures.enableStreaming,
        _enableRecording : config.adminFeatures.enableRecording,
        _onState : state['emg'].roomInfo.onState,
        _onStateId : state['emg'].roomInfo.onStateId,
        _openGrades : state['emg'].roomInfo.openGrades,
    };
}

export default reactReduxConnect(_mapStateToProps)(TeacherHeader);
