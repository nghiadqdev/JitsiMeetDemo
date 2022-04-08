// @flow

import React from 'react';
import { toArray } from 'react-emoji-render';


import { translate } from '../../../base/i18n';
import { Linkify } from '../../../base/react';

import { MESSAGE_TYPE_LOCAL } from '../../constants';

import AbstractChatMessage, {
    type Props
} from '../AbstractChatMessage';
import PrivateMessageButton from '../PrivateMessageButton';
import { banChat } from '/vcrx/actions';
import { Icon, IconDeleteChat, IconCamChat, IconRemoveChat } from '/features/base/icons';
import { ACTION_DELETE_CHAT } from '/vcrx/base';
import {ROLE_STUDENT} from '/vcrx/base';

/**
 * Renders a single chat message.
 */
class ChatMessage extends AbstractChatMessage<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { message } = this.props;
        const processedMessage = [];

        // content is an array of text and emoji components
        const content = toArray(this._getMessageText(), { className: 'smiley' });

        content.forEach(i => {
            if (typeof i === 'string') {
                processedMessage.push(<Linkify key = { i }>{ i.replace( new RegExp(config.chat.regex,"gi"), function (x) {

                    MaskedText = x.replace(/./gi,"*");
                    return x.charAt(0) + MaskedText.substr(1,MaskedText.length-1);
                  }) }</Linkify>);
            } else {
                processedMessage.push(i);
            }
        });

        return (
            <div className = 'chatmessage-wrapper'>
                { this.props.showDisplayName && this._renderDisplayName() }
                <div className = { `chatmessage ${message.privateMessage ? 'privatemessage' : ''}` }>
                    <div className = 'replywrapper'>
                        {
                            APP.store.getState()['emg'].userInfo.role != ROLE_STUDENT &&
                            this._renderChatMenu(message.chatId,message.id,message.messageType)
                        }
                        <div className = 'messagecontent'>
                            <div className = 'usermessage'>
                                { processedMessage }
                            </div>
                            { message.privateMessage && this._renderPrivateNotice() }
                        </div>
                        { message.privateMessage && message.messageType !== MESSAGE_TYPE_LOCAL
                            && (
                                <div className = 'messageactions'>
                                    <PrivateMessageButton
                                        participantID = { message.id }
                                        reply = { true }
                                        showLabel = { false } />
                                </div>
                            ) }
                    </div>
                </div>
                { this.props.showTimestamp && this._renderTimestamp() }
            </div>
        );
    }

    _getFormattedTimestamp: () => string;

    _getMessageText: () => string;

    _getPrivateNoticeMessage: () => string;

    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderDisplayName() {
        return (
            <div className = 'display-name'>
                { this.props.message.displayName }
            </div>
        );
    }

    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    _renderPrivateNotice() {
        return (
            <div className = 'privatemessagenotice'>
                { this._getPrivateNoticeMessage() }
            </div>
        );
    }

    onShowCollapse(chatId){
        setTimeout(() => {
            $(`#chat-menu-${chatId}`).css('display') == 'none'
            ? $(`#chat-menu-${chatId}`).css('display','block')
            : $(`#chat-menu-${chatId}`).css('display','none')
        }, 100);
    }

    deleteMessage(chatId) {
        $(`#chat-menu-${chatId}`).css('display','none')
        APP.conference.sendCommandVcrxRoom(
            ACTION_DELETE_CHAT, 
            JSON.stringify({
                chatId
            })
        );
    }

    muteChat(participantID, chatId) {
        $(`#chat-menu-${chatId}`).css('display','none')
        APP.store.dispatch(banChat(true, participantID));
    }


    _renderChatMenu(chatId, participantID,local) {
        let isLocal = local == 'local' ? true : false
        return (
            <div className = "chat-menu-button">
                <div onClick = { () => this.onShowCollapse(chatId)}>
                    <Icon
                        size = '1em'
                        src = { IconRemoveChat }
                        title = 'Remote user controls' />
                </div>
                <div className={`chat-menu ${isLocal ? 'right0' : 'left0'}`} id={`chat-menu-${chatId}`}>
                    <div className="well">
                        <div className = "chat-menu-item" onClick = { () => this.deleteMessage(chatId)}>
                            <Icon
                                size = '1em'
                                src = { IconDeleteChat }
                                title = 'Remote user controls' />
                            <span>Delete message</span>
                        </div>
                        {
                            !isLocal &&
                            <div className = "chat-menu-item" onClick = { () => this.muteChat(participantID, chatId)}>
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
        );
    }

    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    _renderTimestamp() {
        return (
            <div className = 'timestamp'>
                { this._getFormattedTimestamp() }
            </div>
        );
    }
}

export default translate(ChatMessage);
