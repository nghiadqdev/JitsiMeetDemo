import {
    CONFERENCE_JOINED,
    CONFERENCE_WILL_LEAVE,
    setPassword
} from "/features/base/conference";
import {
    PARTICIPANT_JOINED,
    PARTICIPANT_LEFT,
    PARTICIPANT_UPDATE,
    getLocalParticipant
} from "/features/base/participants";
import { MiddlewareRegistry } from "/features/base/redux";
import {
    addUser,
    removeUser,
    updateBanView,
    changeRoomInfo,
    addLogQuiz,
} from "./actions";
import {
    ROLE_AC,
    ROLE_STUDENT,
    ROLE_TEACHER,
    ROLE_KEY_AC,
    ROLE_KEY_STUDENT,
    ROLE_KEY_TEACHER,
    ROOM_PASSWORD,
    ACTION_KICK
} from "./base";
import UIEvents from "../../service/UI/UIEvents";
import VideoLayout from "../../modules/UI/videolayout/VideoLayout";
import { getUserLog, getInfoClass, saveLogInOut, getRoomLog } from "./base/apis";

MiddlewareRegistry.register(store => next => action => {
    const result = next(action);

    switch (action.type) {
        case CONFERENCE_JOINED:
            let { role, userName, id } = APP.store.getState()['emg'].userInfo;
            if (role) {
                let newUserName;
                switch (role) {
                    case ROLE_AC:
                        newUserName = ROLE_KEY_AC + '-' + userName + '-' + id;
                        break;
                    case ROLE_STUDENT:
                        newUserName = ROLE_KEY_STUDENT + '-' + userName + '-' + id;
                        break;
                    case ROLE_TEACHER:
                        newUserName = ROLE_KEY_TEACHER + '-' + userName + '-' + id;
                        break;
                    case 'JIBRI':
                        newUserName = 'JIBRI' + '-' + userName + '-' + id;
                        break;
                }
                APP.conference.changeLocalDisplayName(newUserName);
                let user = {
                    local: true,
                    name: newUserName,
                    userId: id,
                    id : action.conference.myUserId(),
                    star: 0,
                    draw: false,
                    banChat: false,
                    banCam: false,
                }
                const roomId = APP.store.getState()['features/base/conference'].room
                saveLogInOut({ roomId, userId: id, role, name: userName })
                getUserLog(roomId, id).then( async res => {
                    if (res.logStar) {
                        user.star = res.logStar.star
                    }
                    if (res.logBan) {
                        user.banCam = res.logBan.banCam
                        user.banChat = res.logBan.banChat
                    }
                    
                    await APP.store.dispatch(addUser(user));
                    if (res.logQuiz) {
                        APP.store.dispatch(addLogQuiz(res.logQuiz))
                    }
                    res.logBan && (res.logBan.banCam || res.logBan.banChat) && updateBanView(res.logBan) 
                })
                getInfoClass(roomId).then( res => {
                    if (res){
                        let infoClass = {}
                        if (res.videoOpening){
                            infoClass = {
                                ...infoClass,
                                enableVideo: res.videoOpening,
                                playVideo: res.videoPlaying
                            }
                        }
                        if (res.showQuiz){
                            infoClass = {
                                ...infoClass,
                                showQuiz: res.showQuiz,
                            }
                        }
                        if (res.onState) {
                            infoClass = {
                                ...infoClass,
                                onState: res.onState,
                                onStateId: res.onStateId,
                            }
                        }
                        APP.store.dispatch(changeRoomInfo(infoClass));
                        if (res.videoPlaying) {
                            $("#video-warmup").prop("muted", false);
                        }
                    }
                    setTimeout(() => {
                        const participant =  getLocalParticipant(APP.store.getState());
                        if (participant.role == "moderator"){
                            const {
                                conference,
                            } = APP.store.getState()['features/base/conference'];
                            APP.store.dispatch(setPassword(
                                conference,
                                conference.lock,
                                ROOM_PASSWORD
                            ));
                        }
                    }, 500);
                    
                })
            }

            if(config.audioMutedWhenJoined){
                APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);
            }
            // if(role == ROLE_AC){
            //     APP.UI.emitEvent(UIEvents.VIDEO_MUTED, true, true);
            // }
            setTimeout(() => {
                VideoLayout.updateLargeVideo(); 
            }, 3000);

            let { userInfo }    =  APP.store.getState()['emg'];
            let paticipants     =  APP.store.getState()['features/base/participants'];
    
            paticipants.filter(function (user) {
                let displayName ; 
                
                displayName = user.name && user.name.slice(3);
                if(displayName){
                    let strTemp = displayName.split("-");
                    let userId  = strTemp[strTemp.length-1];
                    if(userId == userInfo.id && !user.local){
                        APP.conference.sendCommandVcrxRoom(ACTION_KICK,user.id, {action: 'kick dublicate'});
                    }
                }

            });
          
            break;

        case CONFERENCE_WILL_LEAVE:
            break;

        case PARTICIPANT_JOINED:
            if (action.participant.id) {
                const name = action.participant.name
                let user = {
                    local: false,
                    name,
                    id : action.participant.id,
                    star: 0,
                    draw: false,
                    banChat: false,
                    banCam: false,
                }
                
                if (name && name.split("-").length === 3) {
                    const userId = name.split("-")[2]
                    const roomId = APP.store.getState()['features/base/conference'].room
                    getUserLog(roomId, userId).then( async res => {
                        if (res.logStar) {
                            user.star = res.logStar.star
                        }
                        if (res.logBan) {
                            user.banCam = res.logBan.banCam
                            user.banChat = res.logBan.banChat
                        }
                        
                        await APP.store.dispatch(addUser(user));
                        
                        setTimeout(() => {
                            res.logBan && (res.logBan.banCam || res.logBan.banChat) && updateBanView(res.logBan) 
                        }, 100);
                    })
                } else {
                    APP.store.dispatch(addUser(user));
                }
            }
            break;

        case PARTICIPANT_LEFT:
            APP.store.dispatch(removeUser(action.participant.id));
            break;
    }

    return result;
})