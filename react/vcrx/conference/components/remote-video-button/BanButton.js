import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { banChat, banCam } from '/vcrx/actions';
import { Icon, IconBanChat, IconBanCam } from '/features/base/icons';

class BanButton extends Component<Props> {
    constructor(props) {
        super(props);
    }

    banChat(isEnable) {
        APP.store.dispatch(banChat(!isEnable, this.props.participantID, this.props.role));
    }

    banCam(isEnable) {
        APP.store.dispatch(banCam(!isEnable, this.props.participantID, this.props.role));
    }

    render() {
        let user = this.props.userList.find(x=>x.id == this.props.participantID)
        let isBanChat = user.banChat;
        let isBanCam = user.banCam;
        return (
            <li className = 'popupmenu__item'>
                <a
                    className = { `popupmenu__link ban-icon` }
                    id = { `privmsglink_${this.props.participantID}` }
                    onClick = { () => this.banChat(isBanChat) }>
                    <span className = 'popupmenu__icon'>
                        <Icon 
                            src = { IconBanChat } 
                            className = {'hw2vh'}
                        />
                    </span>
                    <span className = 'popupmenu__text'>
                        {`Chat ${isBanChat ? 'on' : 'off'}`}
                    </span>
                </a>
                <a
                    className = { `popupmenu__link ban-icon` }
                    id = { `privmsglink_${this.props.participantID}` }
                    onClick = { () => this.banCam(isBanCam) }>
                    <span className = 'popupmenu__icon'>
                        <Icon 
                            src = { IconBanChat } 
                            className = {'hw2vh'}
                        />
                    </span>
                    <span className = 'popupmenu__text'>
                        {`Cam ${isBanCam ? 'on' : 'off'}`}
                    </span>
                </a>
            </li>
        )
    }
}
function _mapStateToProps(state) {
    return {
        participants : state["features/base/participants"],
        role : state['emg'].userInfo.role,
        userList : state['emg'].userList
    };
}

export default reactReduxConnect(_mapStateToProps)(BanButton);
