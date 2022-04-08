import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { sharePermissionDraw } from '/vcrx/actions';
import RemoteVideoMenuButton from '/features/remote-video-menu/components/web/RemoteVideoMenuButton';
import { IconDraw } from '/features/base/icons';

class AuthorizeDrawButton extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    authDraw(isEnable){
        APP.store.dispatch(sharePermissionDraw(!isEnable, this.props.participantID, this.props.role));
    }

    render() {
        let isEnable = this.props.userList.find(x=>x.id == this.props.participantID).draw
        let text = `${isEnable ? 'Disable' : 'Enable'} draw`
        return (
            <RemoteVideoMenuButton
                buttonText = { text }
                classNameIcon = {' hw2vh'}
                icon = { IconDraw }
                id = { `privmsglink_${this.props.participantID}` }
                onClick = { () => this.authDraw(isEnable) } 
            />
        )
    }
}
function _mapStateToProps(state) {
    return {
        role : state['emg'].userInfo.role,
        participants : state["features/base/participants"],
        userList : state['emg'].userList
    };
}

export default reactReduxConnect(_mapStateToProps)(AuthorizeDrawButton);
