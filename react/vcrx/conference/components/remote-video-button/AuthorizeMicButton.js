import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { clickMic } from '/vcrx/actions';
import { isRemoteTrackMuted } from '/features/base/tracks';
import { MEDIA_TYPE } from '/features/base/media';
import RemoteVideoMenuButton from '/features/remote-video-menu/components/web/RemoteVideoMenuButton';
import { IconMic } from '/features/base/icons';

class AuthorizeMicButton extends Component<Props> {
    constructor(props) {
        super(props);
    }

    authMic(isEnable) {
        APP.store.dispatch(clickMic(isEnable, this.props.participantID, this.props.role,this.props.tracks));
    }

    render() {
        let isEnable = isRemoteTrackMuted(this.props.tracks, MEDIA_TYPE.AUDIO, this.props.participantID)
        let text = isEnable ? 'Turn on mic':'Turn off mic'
        return (
            <RemoteVideoMenuButton
                buttonText = { text }
                classNameIcon = {' hw2vh'}
                icon = { IconMic }
                id = { `privmsglink_${this.props.participantID}` }
                onClick = { () => this.authMic(isEnable) } 
            />
        )
    }
}
function _mapStateToProps(state) {
    return {
        tracks :state['features/base/tracks'],
        role : state['emg'].userInfo.role
    };
}

export default reactReduxConnect(_mapStateToProps)(AuthorizeMicButton);
