import {
    ACTION_TOGGLE_VIDEO_WARMUP,
    ACTION_TOGGLE_MICRO,
    ACTION_KICK,
    ACTION_CLICK_CAMERA,
    ACTION_UPDATE_P,
    ACTION_TOGGLE_DRAW,
    ACTION_TOGGLE_STAR,
    CREATE_QUIZ,
    SUBMIT_QUIZ,
    STOP_QUIZ,
    ACTION_BAN_CAM,
    ACTION_BAN_CHAT,
    ACTION_DELETE_CHAT,
}   from "./base";

export function sendCommandVcrx(room, command, value, attributes) {
    switch(command){
        case ACTION_CLICK_CAMERA:
            room.sendCommand(ACTION_CLICK_CAMERA, { value ,  attributes });
            break;
        case ACTION_TOGGLE_VIDEO_WARMUP:
            room.sendCommandOnce(ACTION_TOGGLE_VIDEO_WARMUP, { value });
            break;
        case ACTION_TOGGLE_MICRO:
            room.sendCommandOnce(ACTION_TOGGLE_MICRO, {value, attributes});
            break;
        case ACTION_KICK:
            room.sendCommand(ACTION_KICK, {value, attributes});
            break; 
        case ACTION_UPDATE_P:
            room.sendCommand(ACTION_UPDATE_P, {value, attributes});
            break; 
        case ACTION_TOGGLE_DRAW:
            room.sendCommandOnce(ACTION_TOGGLE_DRAW, {value, attributes});
            break;
        case ACTION_TOGGLE_STAR:
            room.sendCommandOnce(ACTION_TOGGLE_STAR, {value, attributes});
            break;
        case CREATE_QUIZ:
            room.sendCommandOnce(CREATE_QUIZ, {value, attributes});
            break;
        case SUBMIT_QUIZ:
            room.sendCommandOnce(SUBMIT_QUIZ, {value, attributes});
            break;
        case STOP_QUIZ:
            room.sendCommandOnce(STOP_QUIZ, {value, attributes});
            break;
        case ACTION_BAN_CAM:
            room.sendCommandOnce(ACTION_BAN_CAM, {value, attributes});
            break;
        case ACTION_BAN_CHAT:
            room.sendCommandOnce(ACTION_BAN_CHAT, {value, attributes});
            break;
        case ACTION_DELETE_CHAT:
            room.sendCommandOnce(ACTION_DELETE_CHAT, {value, attributes});
            break;
    }
}