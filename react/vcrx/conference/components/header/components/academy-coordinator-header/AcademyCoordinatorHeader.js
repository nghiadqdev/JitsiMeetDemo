import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import VideoMuteButton from '/features/toolbox/components/VideoMuteButton';
import {SettingsButton} from '/features/settings';
import AudioMuteButton from '/features/toolbox/components/AudioMuteButton';
import { TileViewButton } from '/features/video-layout';
import { Icon, 
    IconOnState,
} from '/features/base/icons';
import { changeRoomInfo } from '/vcrx/actions';
import {socket} from '/vcrx/config';

class AcademyCoordinatorHeader extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onState(){
        socket.emit("on-state", {
            room: this.props._room,
            onState : !this.props._onState
        })
        APP.store.dispatch(changeRoomInfo({ onState : !this.props._onState }));
    }

    render() {
        return (
            <>
                <div  className={`headerTool ${this.props._onState && 'isMosaic'}`} 
                    onClick={() => this.onState()}>
                    <Icon src = { IconOnState }/>
                </div>
                <div className={`headerTool pad0101 ${this.props._tileViewEnabled && 'isMosaic'}`}>
                    <TileViewButton/>
                </div>
                <div className="mediaControl headerTool">
                    <AudioMuteButton />
                </div>
                <div className="mediaControl headerTool">
                    <VideoMuteButton />
                </div>
                <div className="mediaControl headerTool">
                    <SettingsButton />
                </div>
            </>
        );
    }
}
function _mapStateToProps(state) {
    return {
        _tileViewEnabled: state['features/video-layout'].tileViewEnabled,
        _onState : state['emg'].roomInfo.onState,
        _room : state['features/base/conference'].room,
    };
}

export default reactReduxConnect(_mapStateToProps)(AcademyCoordinatorHeader);
