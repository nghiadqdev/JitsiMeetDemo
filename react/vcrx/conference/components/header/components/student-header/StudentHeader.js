import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import VideoMuteButton from '/features/toolbox/components/VideoMuteButton';
import ToolbarButton from '/features/toolbox/components/web/ToolbarButton';
import {
    getLocalParticipant,
    participantUpdated
} from '/features/base/participants';
import {
    IconRaisedHand,
    IconHiddenSlide,
    Icon,
    IconSwitchSlide
} from '/features/base/icons';
import {
    createToolbarEvent,
    sendAnalytics
} from '/features/analytics';
import StarRatingComponent from 'react-star-rating-component';
import {SettingsButton} from '/features/settings';
import AudioMuteButton from '/features/toolbox/components/AudioMuteButton';
import { changeUserInfo } from '/vcrx/actions';
import { openDialog, toggleDialog } from '/features/base/dialog';
import {
    OverflowMenuVideoQualityItem,
    VideoQualityDialog
} from '/features/video-quality';

class StudentHeader extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            countStar: 0,
            star: 0,
            showAnimation:false
        }
    }

    _onToolbarToggleRaiseHand() {
        sendAnalytics(createToolbarEvent(
            'raise.hand',
            {enable: !this.props._raisedHand}));

        this._doToggleRaiseHand();
    }

    _doToggleRaiseHand() {
        const {_localParticipantID,_raisedHand} = this.props;

        APP.store.dispatch(participantUpdated({
            id: _localParticipantID,
            local: true,
            raisedHand: !_raisedHand
        }));
    }

    UNSAFE_componentWillReceiveProps(NextProps){
        if(NextProps._star != this.state.star){
            this.setState({
                showAnimation : true,
            })
            setTimeout(() => {
                this.setState({
                    showAnimation : false,
                    star : NextProps._star
                })
            }, 3000);
        }
    }

    _doToggleShowSlide(showSlide) {
        APP.store.dispatch(changeUserInfo({ showSlide }));
    }
    _doToggleSwapCam(swapCam){
        APP.store.dispatch(changeUserInfo({ swapCam }));
    }

    _renderStar(nextValue, prevValue, name) {
        switch (nextValue) {
            case 1:
                return (
                    <>
                        <span className='star-icon'>★</span>
                        {
                            this.props._star == nextValue && 
                            this.state.showAnimation &&
                            <span className='star-icon star-animation star-1'>★</span>
                        }
                    </>
                )
            case 2:
                return (
                    <>
                        <span className='star-icon'>★</span>
                        {
                            this.props._star == nextValue && 
                            this.state.showAnimation &&
                            <span className='star-icon star-animation star-2'>★</span>
                        }
                    </>
                )
            case 3:
                return (
                    <>
                        <span className='star-icon'>★</span>
                        {
                            this.props._star == nextValue && 
                            this.state.showAnimation &&
                            <span className='star-icon star-animation star-3'>★</span>
                        }
                    </>
                )
            case 4:
                return (
                    <>
                        <span className='star-icon'>★</span>
                        {
                            this.props._star == nextValue && 
                            this.state.showAnimation &&
                            <span className='star-icon star-animation star-4'>★</span>
                        }
                    </>
                )
            case 5:
                return (
                    <>
                        <span className='star-icon'>★</span>
                        {
                            this.props._star == nextValue && 
                            this.state.showAnimation &&
                            <span className='star-icon star-animation star-5'>★</span>
                        }
                    </>
                )
            default:
                break;
        }
        
    }

    _doToggleVideoQuality() {
        this.props.dispatch(toggleDialog(VideoQualityDialog));
    }

    render() {
        const {_showSlide, _swapCam, _largeView } = this.props;
        return (
            <>
                <div className={`mediaControl headerTool ${this.props._raisedHand && 'userRaisedHand'}`}>
                    <ToolbarButton
                        icon={IconRaisedHand}
                        onClick={() => this._onToolbarToggleRaiseHand()}
                        toggled={this.props._raisedHand}
                    />
                </div>
                {
                    _largeView == 1 && 
                    <>
                        <div 
                            className={`headerTool`} 
                            onClick={() => this._doToggleShowSlide(!_showSlide)}
                        >
                            <Icon src = { IconHiddenSlide }/>
                            <span className = 'onState'>large slide</span>
                        </div>
                        <div 
                            className={`headerTool`} 
                            onClick={() => this._doToggleSwapCam(!_swapCam)}
                            >
                            <Icon src = { IconSwitchSlide }/>
                            <span className = 'onState'>swap camera</span>
                        </div>
                        
                    </>
                }
                {/* <div 
                    className={`headerTool ${this.props._onState && 'isMosaic'}`} 
                    onClick={() => this._doToggleVideoQuality(!_swapCam)}
                    >
                    <Icon src = { IconSwitchSlide }/>
                    <span className = 'onState'>swap camera</span>
                </div> */}
                {/* <div className="mediaControl headerTool">
                    <AudioMuteButton />
                </div>
                <div className="mediaControl headerTool">
                    <VideoMuteButton />
                </div> */}
                <div className="mediaControl headerTool">
                    <SettingsButton />
                </div>
                <StarRatingComponent
                    name="star-rating"
                    value={this.state.star}
                    starCount={5}
                    renderStarIcon={(nextValue, prevValue, name) => this._renderStar(nextValue, prevValue, name) }
                    starColor={"#e8772c"}
                    emptyStarColor={"gray"}
                />
            </>
        );
    }
}
function _mapStateToProps(state) {
    const localParticipant = getLocalParticipant(state);
    let { role, showSlide, swapCam } = state['emg'].userInfo
    const userList = state['emg'].userList
    let star = 0
    const user = userList.find(x => x.local == true)
    if(user) star = user.star
    
    return {
        _isRecording: state['features/base/config'].iAmRecorder,
        _fullScreen: state['features/toolbox'].fullScreen,
        _languages: state['emg'].languages,
        _enableVideo: state['emg'].roomInfo.enableVideo,
        _role: role,
        _room: state['features/base/conference'].room,
        _raisedHand: localParticipant.raisedHand,
        _localParticipantID: localParticipant.id,
        _star : star ,
        _showSlide: showSlide,
        _swapCam: swapCam,
        _largeView: state['emg'].roomInfo.largeView
    };
}

export default reactReduxConnect(_mapStateToProps)(StudentHeader);
