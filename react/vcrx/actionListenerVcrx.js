import { JitsiConferenceEvents }                from "../features/base/lib-jitsi-meet";
import VideoLayout                              from "../../modules/UI/videolayout/VideoLayout";
import {
    actionToggleMicro,
    kickUser,
    actioneToggleVideoWarmup,
    actionToggleDraw,
    actionClickStar,
    changeRoomInfo,
    updateQuizAnswerList,
    updateUser,
    banChat,
}                                               from "./actions";
import { deleteMessage } from "../features/chat/actions";
import {
    ACTION_TOGGLE_VIDEO_WARMUP,
    ACTION_TOGGLE_MICRO,
    ACTION_KICK,
    ACTION_CLICK_CAMERA,
    ACTION_TOGGLE_DRAW,
    ACTION_BAN_CAM,
    ACTION_BAN_CHAT,
    ACTION_TOGGLE_STAR,
    CREATE_QUIZ,
    SUBMIT_QUIZ,
    STOP_QUIZ,
    ACTION_DELETE_CHAT
}                                               from "./base";
import UIEvents                     from "../../service/UI/UIEvents";
import {saveBanChat, saveBanCam} from './base/apis'

export function addVcrxListeners(room) {
    room.on(JitsiConferenceEvents.USER_JOINED, (id, user) => {
    //    console.log("USER_JOINED");
        setTimeout(() => {
            VideoLayout.updateLargeVideo();     
        }, 2000);  
    });
    room.addCommandListener(
        ACTION_TOGGLE_VIDEO_WARMUP,
        (data, id) => {
            APP.store.dispatch(actioneToggleVideoWarmup(data));
        }
    );
    room.addCommandListener(
        ACTION_TOGGLE_MICRO,
        (data, id) => {
            let d = JSON.parse(data.value);
            APP.store.dispatch(actionToggleMicro(d));
        }
    );
    room.addCommandListener(
        ACTION_TOGGLE_DRAW,
        (data, id) => {
            let d = JSON.parse(data.value);
            APP.store.dispatch(actionToggleDraw(d));
        }
    );
    room.addCommandListener(
        ACTION_KICK,
        (data, id) => {
            APP.store.dispatch(kickUser(data));
        }
    );
    room.addCommandListener(
        ACTION_CLICK_CAMERA,
        (data, id) => {
            if(data.value){
                setTimeout(function(){
                    VideoLayout.updateLargeVideo(data.value); 
                }, 3000);                       
            }
        }
    );
    room.addCommandListener(
        SUBMIT_QUIZ,
        (data, id) => {
            let d = JSON.parse(data.value);
            APP.store.dispatch(updateQuizAnswerList(d,false))
        }
    );

    room.addCommandListener(
        ACTION_TOGGLE_STAR,
        (data, id) => {
            let d = JSON.parse(data.value);
            APP.store.dispatch(actionClickStar(d));
        }
    );
    room.addCommandListener(
        CREATE_QUIZ,
        (data, id) => {
            let d = JSON.parse(data.value);
            if(d.show == true){
                APP.store.dispatch(updateQuizAnswerList(d,true))
            }
            APP.store.dispatch(changeRoomInfo({
                showQuiz : d.show
            }))

        }
    );
    room.addCommandListener(
        STOP_QUIZ,
        (data, id) => {
            APP.store.dispatch(changeRoomInfo({
                showQuiz : false
            }));
        }
    );
    room.addCommandListener(
        ACTION_BAN_CAM,
        (data, id) => {
            let d = JSON.parse(data.value);
            let user = {
                id: d.id,
                banCam: d.banCam
            }
            APP.store.dispatch(updateUser(user));
            if(APP.conference.isLocalId(d.id)){
                const { id } = APP.store.getState()['emg'].userInfo;
                const roomId = APP.store.getState()['features/base/conference'].room
                saveBanCam(roomId, id, d.banCam)
            }
            if(APP.conference.isLocalId(d.id) && d.banCam == true) {
                APP.UI.emitEvent(UIEvents.AUDIO_MUTED, true, true);
            }
            APP.UI.setPermissionDrawChange(d.id,false);
        }
    );
    room.addCommandListener(
        ACTION_BAN_CHAT,
        (data, id) => {
            let d = JSON.parse(data.value);
            let user = {
                id: d.id,
                banChat: d.banChat
            }
            if(APP.conference.isLocalId(d.id)){
                const { id } = APP.store.getState()['emg'].userInfo;
                const roomId = APP.store.getState()['features/base/conference'].room
                saveBanChat(roomId, id, d.banChat)
            }
            APP.store.dispatch(updateUser(user));
            APP.UI.setPermissionDrawChange(d.id,false);
        }
    );
    room.addCommandListener(
        ACTION_DELETE_CHAT,
        (data, id) => {
            let d = JSON.parse(data.value);
            APP.store.dispatch(deleteMessage(d.chatId));
        }
    );
}