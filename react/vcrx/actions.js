import {
    CHANGE_ROOM_INFO,
    CHANGE_LANGUAGE,
    CHANGE_USER_INFO,
    ADD_USER,
    REMOVE_USER,
    UPDATE_QUIZ_ANSWER_LIST,
    UPDATE_USER,
    ADD_LOG_QUIZ
} from './actionTypes';
import {
    KEY_LANGUAGE, LANGUAGE_EN, LANGUAGE_VI,
    ROLE_AC, ROLE_STUDENT, ROLE_TEACHER,
    ROLE_KEY_AC, ROLE_KEY_STUDENT, ROLE_KEY_TEACHER,
    ACTION_TOGGLE_MICRO, MICRO, ACTION_BAN_CHAT,
    ACTION_BAN_CAM, ACTION_TOGGLE_DRAW, ACTION_TOGGLE_STAR,
    FILMSTRIP
} from './base/constants';
import {
    getLocalParticipant
} from '/features/base/participants';
import UIEvents from '../../service/UI/UIEvents';
import { Base64 } from 'js-base64';
import {
    saveStar,
    getStarByRoomId,
    getBanByRoomId
} from './base/apis';

export function initRoom(objParam) {
    return function(dispatch, getState) {
        let languages;

        switch (localStorage.getItem(KEY_LANGUAGE)) {
        case LANGUAGE_EN:
            languages = require('./lang/en.json');
            break;
        case LANGUAGE_VI:
            languages = require('./lang/vi.json');
            break;
        default:
            languages = require('./lang/en.json');
        }
	let userNameStr = decodeURIComponent(objParam.userName);
        dispatch(setLanguage(languages));
        dispatch(changeUserInfo({
            id: objParam.userId,
            role: objParam.userRole,
            userName: objParam.userName == 'jibri' ? 'jibri' : userNameStr
        }));
        APP.store.dispatch(changeRoomInfo({
            idRoom: objParam.roomId,
            slide: objParam.link_slide,
            video: objParam.link_video,
            timeStartClass: objParam.timeStartClass ? objParam.timeStartClass : 0,
            timeNow: Math.ceil(new Date().getTime() / 1000),
            isolated: objParam.isolated,
            largeView: objParam.largeView,
            title: objParam.title || "default title"
        }));
        if (objParam.largeView == "0" && !FILMSTRIP.enableLocalCameraLargeView.includes(objParam.userRole)) {
            $('#filmstripLocalVideo').css('display', 'none');
        }
        if (objParam.largeView == "1" && !FILMSTRIP.enableLocalCamera.includes(objParam.userRole)) {
            $('#filmstripLocalVideo').css('display', 'none');
        }
    };
}

export function changeRoomInfo(roomInfo) {
    return {
        type: CHANGE_ROOM_INFO,
        roomInfo
    };
}

export function setLanguage(languages) {
    return {
        type: CHANGE_LANGUAGE,
        languages
    };
}

export function changeUserInfo(userInfo) {
    return {
        type: CHANGE_USER_INFO,
        userInfo
    };
}

export function actionToggleMicro(data) {
    return function(dispatch, getState) {
        const localParticipant = getLocalParticipant(getState);

        if (data.id == localParticipant.id) {
            APP.UI.emitEvent(UIEvents.AUDIO_MUTED, data.status, true);
        }
    };
}

export function clickMic(isMuted, participantID, role, tracks) {
    return function(dispatch, getState) {
        const checkTrack = tracks.find(x => x.participantId === participantID && x.mediaType == 'audio');

        if (checkTrack === undefined) {
            alert('Student not allow mic permission or not have mic');

            return;
        }
        if (MICRO.enableAction.includes(role)) {
            if (participantID == APP.conference.getMyUserId()) { // nếu là tắt mic của chính mình
                if (APP.conference.isLocalAudioMuted()) {
                    APP.UI.emitEvent(UIEvents.AUDIO_MUTED, false, true);
                } else {
                    APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);
                }
            } else {
                APP.conference.sendCommandVcrxRoom(ACTION_TOGGLE_MICRO, JSON.stringify({ status: !isMuted,
                    id: participantID }));
            }
        } else if (participantID == APP.conference.getMyUserId()) { // nếu là tắt mic của chính mình
            if (APP.conference.isLocalAudioMuted()) {
                alert('Permission deny');

                return;
            }
            APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);

        } else { // nếu là tắt mic của người khac
            alert('Permission deny');

            return;
        }
    };
}

export function sharePermissionDraw(enable, participantID, role) {
    return function(dispatch, getState) {
        if (MICRO.enableAction.includes(role)) {
            const user = {
                id: participantID,
                draw: enable
            };

            dispatch(updateUser(user));
            APP.conference.sendCommandVcrxRoom(ACTION_TOGGLE_DRAW, JSON.stringify(
                {
                    status: enable,
                    id: participantID
                }
            ));
        } else {
            alert('Permission deny');

            return;
        }
    };
}

export function actionToggleDraw(data) {
    return function(dispatch, getState) {
        const user = {
            id: data.id,
            draw: data.status
        };

        dispatch(updateUser(user));
        APP.UI.setPermissionDrawChange(data.id, data.status);
    };
}

export function clickStar(star, participantId) {
    return function(dispatch, getState) {
        const user = {
            id: participantId,
            star
        };

        dispatch(updateUser(user));
        APP.conference.sendCommandVcrxRoom(
            ACTION_TOGGLE_STAR,
            JSON.stringify({
                field: 'click-star',
                star,
                id: participantId
            })
        );
    };
}

export function actionClickStar(data) {
    return function(dispatch, getState) {
        const user = {
            id: data.id,
            star: data.star
        };

        dispatch(updateUser(user));
        const localParticipant = getLocalParticipant(getState);

        if (data.id == localParticipant.id) {
            const { id } = getState().emg.userInfo;
            const roomId = APP.store.getState()['features/base/conference'].room;

            saveStar(roomId, id, data.star)
            dispatch(changeUserInfo({
                star: data.star
            }));
        }
    };
}

export function updateQuizAnswerList(answer, isStart) {
    return {
        type: UPDATE_QUIZ_ANSWER_LIST,
        answer,
        isStart
    };
}

export function addUser(user) {
    return {
        type: ADD_USER,
        user
    };
}

export function addLogQuiz(quizAnswerList) {
    return {
        type: ADD_LOG_QUIZ,
        quizAnswerList
    };
}

export function removeUser(id) {
    return {
        type: REMOVE_USER,
        id
    };
}

export function updateUser(user) {
    return {
        type: UPDATE_USER,
        user
    };
}

export function banChat(banChat, participantId, role) {
    return function(dispatch, getState) {
        const user = {
            id: participantId,
            banChat
        };

        dispatch(updateUser(user));
        APP.conference.sendCommandVcrxRoom(
            ACTION_BAN_CHAT,
            JSON.stringify({
                banChat,
                id: participantId
            })
        );
    };
}

export function banCam(banCam, participantId, role) {
    return function(dispatch, getState) {
        const user = {
            id: participantId,
            banCam
        };

        dispatch(updateUser(user));
        APP.conference.sendCommandVcrxRoom(
            ACTION_BAN_CAM,
            JSON.stringify({
                banCam,
                id: participantId
            })
        );
    };
}

function hiddenElement(isLocal, participantID) {
    const element = isLocal ? $('#filmstripLocalVideo') : $(`#participant_${participantID}`)
    element.addClass('hiddenElement');
}

function showElement(isLocal, participantID) {
    const element = isLocal ? $('#filmstripLocalVideo') : $(`#participant_${participantID}`)
    element.removeClass('hiddenElement');
}

export function updateLocalCamera() {
    return function(dispatch, getState) {
        const { userList, userInfo } = getState().emg;
        const user = userList.find(({ local }) => local == true);
        user && user.banCam == true
            ? $('#localVideoWrapper').find('.ban__cam').css('display', 'block')
            : $('#localVideoWrapper').find('.ban__cam').css('display', 'none')
        user && user.banChat == true
            ? $('#localVideoWrapper').find('.ban__chat').css('display', 'block')
            : $('#localVideoWrapper').find('.ban__chat').css('display', 'none')
    };
}

function isLastParticipantInList(user, userList) {
    let foundUser = false;
    let isLast = true;
    for (var i = 0; i < userList.length; i++) {
        if (userList[i].id === user.id) {
            foundUser = true;
            break;
        }          
    }
    if(foundUser){  //Continue searching for duplicated user
        i=i++;  //Next participant
        for ( ; i < userList.length; i++) {
            if (userList[i].name === user.name) {
                isLast = false;
                break;
            }          
        }
    }
    return isLast;
}

export function updateRemoteCamera(participantID) {
    return function(dispatch, getState) {
        const { userList, userInfo, roomInfo } = getState().emg;
        const user = userList.find(({ id }) => id == participantID);
        const connectionStatus = APP.conference.getParticipantConnectionStatus(participantID);
        let displayName = APP.conference.getParticipantDisplayName(participantID);
        if ((connectionStatus == 'interrupted') 
            || (connectionStatus == 'restoring')) {
            if(!isLastParticipantInList(user,userList)){
                hiddenElement(false, participantID)
            }            
        } else {
            showElement(false, participantID);
            if (displayName && !FILMSTRIP.enableSmallCamera.includes(displayName.split('-')[0])) { 
                hiddenElement(false, participantID);
            } else {
                if (user && !FILMSTRIP.showCamBan.includes(userInfo.role)) {
                    user.banCam == true
                        ? hiddenElement(false, participantID)
                        : showElement(false, participantID);
                } else {
                    user && user.banCam == true
                        ? $(`#participant_${participantID}`).find('.ban__cam').css('display', 'block')
                        : $(`#participant_${participantID}`).find('.ban__cam').css('display', 'none')
                    user && user.banChat == true
                        ? $(`#participant_${participantID}`).find('.ban__chat').css('display', 'block')
                        : $(`#participant_${participantID}`).find('.ban__chat').css('display', 'none')
                }
            }

            if (displayName && displayName.split('-')[0] == ROLE_KEY_AC) {
                $(`#participant_${participantID} .videocontainer__toolbar`).css('background', '#187BCD')
            }
            
            if(roomInfo.largeView == "1" && displayName && displayName.split('-')[0] == ROLE_KEY_AC) {
                hiddenElement(false,participantID)
            }
        }
    };
}

export function kickUser(data) {
    return function(dispatch, getState) {
        const localParticipant = getLocalParticipant(getState);

        if (data.value == localParticipant.id) {
            window.location.href = config.domain.homePage;
        }
    };
}

export function getAllLogClass() {
    const roomId = APP.store.getState()['features/base/conference'].room;

    getStarByRoomId(roomId).then(res => {
        res.forEach(data => {
            APP.store.dispatch(updateUser({
                userId: data.userId,
                star: data.star
            }));
        });
    });
    getBanByRoomId(roomId).then(res => {
        const participants = APP.store.getState()['features/base/participants'];

        res.forEach(data => {
            APP.store.dispatch(updateUser({
                userId: data.userId,
                banCam: data.banCam,
                banChat: data.banChat
            }));
            const { id } = participants.find(x => x.name.split('-')[2] == data.userId);

            if (APP.conference.isLocalId(id) && data.banCam == true) {
                APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);
            }
            APP.UI.setPermissionDrawChange(id, false);
        });
    });
}

export function updateBanView(data) {
    const participants = APP.store.getState()['features/base/participants'];
    const { id } = participants.find(x => x.name.split('-')[2] == data.userId);

    if (APP.conference.isLocalId(id) && data.banCam == true) {
        APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);
    }
    APP.UI.setPermissionDrawChange(id, false);
}
