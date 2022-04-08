import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { banChat, banCam } from '/vcrx/actions';
import { Icon, IconDeleteChat, IconCamChat, IconRemoveChat } from '/features/base/icons';
import { ACTION_DELETE_CHAT } from '/vcrx/base';


class ChatMenuButton extends Component<Props> {
    constructor(props) {
        super(props);
    }

    banChat(isEnable) {
        APP.store.dispatch(banChat(!isEnable, this.props.participantID, this.props.role));
    }

    banCam(isEnable) {
        APP.store.dispatch(banCam(!isEnable, this.props.participantID, this.props.role));
    }
    onShowCollapse(){

    }

    deleteMesage(chatId) {
        APP.conference.sendCommandVcrxRoom(
            ACTION_DELETE_CHAT, 
            JSON.stringify({
                chatId
            })
        );
    }

    muteChat() {
        APP.store.dispatch(banChat(true, this.props.participantID));
    }

    render() {
        let isLocal = this.props.local == 'local' ? true : false
        return (
            <div className = "chat-menu-button">
                <div 
                    data-toggle="collapse" 
                    href={`#chat-menu-${this.props.chatId}`} 
                    aria-expanded="false" 
                    aria-controls={`chat-menu-${this.props.chatId}`}
                    onClick = { () => this.onShowCollapse()}>
                    <Icon
                        size = '1em'
                        src = { IconRemoveChat }
                        title = 'Remote user controls' />
                </div>
                <div className={`collapse chat-menu ${isLocal ? 'right0' : 'left0'}`} id={`chat-menu-${this.props.chatId}`}>
                    <div className="well">
                        <div className = "chat-menu-item" onClick = { () => this.deleteMesage(this.props.chatId)}>
                            <Icon
                                size = '1em'
                                src = { IconDeleteChat }
                                title = 'Remote user controls' />
                            <span>Delete message</span>
                        </div>
                        {
                            !isLocal &&
                            <div className = "chat-menu-item" onClick = { () => this.muteChat()}>
                                <Icon
                                    size = '1em'
                                    src = { IconCamChat }
                                    title = 'Remote user controls' />
                                <span>Mute chat</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
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

export default reactReduxConnect(_mapStateToProps)(ChatMenuButton);
