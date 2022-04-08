import { ReducerRegistry } from "../features/base/redux";
import {
    CHANGE_ROOM_INFO,
    CHANGE_LANGUAGE,
    CHANGE_USER_INFO,
    UPDATE_QUIZ_ANSWER_LIST,
    REMOVE_USER,
    ADD_USER,
    UPDATE_USER,
    ADD_LOG_QUIZ
} from "./actionTypes";
import { ROLE_STUDENT } from './base';

let stateDefault = {
    languages: require("./lang/en.json"),
    roomInfo: {
        timeAvailable: 0,
        timeStarted: 0,
        enableVideo : false,
        playVideo: false,
        showQuiz : false,
        onState: false,
        onStateId: "123",
        openGrades: false,
        largeSmallCam : false,
        largeSmallCamId: '123',
        countDown: false,
        title: "default title"
    },
    userInfo: {
        star : 0,
        quizSubmitDisabled : false,
        isBanChat: false,
        showChat: false,
        showSlide: false,
        swapCam: false,
        answer: 0,
        time: '00'
    },
    quizAnswerList: [],
    userList: []
};

ReducerRegistry.register('emg', (state = stateDefault, action) => {
    switch (action.type) {
        case CHANGE_ROOM_INFO:
            return {
                ...state,
                roomInfo: { ...state.roomInfo, ...action.roomInfo }
            };
        case CHANGE_LANGUAGE:
            return {
                ...state,
                languages: action.languages
            };
        case CHANGE_USER_INFO:
            return {
                ...state,
                userInfo: { ...state.userInfo, ...action.userInfo }
            };
        case ADD_USER:
            return {
                ...state,
                userList: [...state.userList, action.user]
            };
        case REMOVE_USER:
            return {
                ...state, 
                userList: state.userList.filter(({ id }) => id != action.id)
            }
        case UPDATE_USER:
            const { user } = action;
            const newState = { ...state };
            let userIndex = newState.userList.findIndex(({id, name}) => id == user.id || (name && name.split("-")[2] == user.userId))

            if (userIndex != -1 ){
                for (key in user) {
                    if(key != 'id'){
                        newState.userList[userIndex][key] = user[key]
                    }
                }
            }
            return newState;
        case UPDATE_QUIZ_ANSWER_LIST:
            if(action.isStart) {
                let roomInfo = {showQuiz : true}
                return {
                    ...state,
                    roomInfo: { ...state.roomInfo, ...roomInfo },
                    quizAnswerList : []
                };
            }
            let quizAnswer = state.quizAnswerList.find(x=> x.userId == action.answer.userId)
            if(quizAnswer == undefined) {
                return {
                    ...state,
                    quizAnswerList: [...state.quizAnswerList, action.answer]
                };
            }
            if(quizAnswer.userId == action.answer.userId && quizAnswer.answer != action.answer.answer){
                let quizIndex = state.quizAnswerList.findIndex(x => x.userId == action.answer.userId)
                state.quizAnswerList[quizIndex].answer = action.answer.answer
                state.quizAnswerList[quizIndex].time = action.answer.time
                return state;
            }
            return state;
        case ADD_LOG_QUIZ:
            return {
                ...state,
                quizAnswerList: action.quizAnswerList
            };
        default:
            return state;
    }
});