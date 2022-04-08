import jitsiLocalStorage from '../../../modules/util/JitsiLocalStorage';
import {
    initRoom
} from "../actions";
import {
    SECRET
} from "./constants";
import sha1 from 'js-sha1';
import { Base64 } from 'js-base64';
import { loginBE, getRoomInfo } from './apis';

export function initConference(params) {
    if(!config.iAmRecorder) {
        let URL = APP.store.getState()['features/base/connection'].locationURL.pathname;
        let idRoom = parseInt(URL.substring(1, URL.length));
        if (!params) {
            let tokenRoom = jitsiLocalStorage.getItem("token-" + APP.store.getState()["features/base/conference"].room);
            if (!tokenRoom) {
                // alert("Token error !");
                window.location.href = config.domain.homePage;
                return;
            } else {
                params = tokenRoom;
            }
        }
        jitsiLocalStorage.setItem('token-' + APP.store.getState()['features/base/conference'].room, params);
        let paramUrl = atob(params);
        paramUrl = decodeURIComponent(paramUrl).replace(/\+/g, " ");
        let properties = paramUrl.split('&');
        let objParam = {};
        properties.forEach(function (property) {
            let tup = property.split('=');
            objParam[tup[0].replace("amp;", "")] = tup[1];
        });
        let userName = decodeURIComponent(objParam.userName)
        const {
            roomId, userId, userRole, link_slide, link_video, timeStartClass, largeView, isolated, title
        } = objParam
        
        let securedToken = `roomId=${roomId}&userId=${userId}&userName=${encodeURIComponent(userName)}&userRole=${userRole}&link_slide=${link_slide}&link_video=${link_video}&timeStartClass=${timeStartClass}&largeView=${largeView}&isolated=${isolated}&title=${title}&secretValue=${SECRET}`;
        let checkSum = sha1(securedToken);
        if(checkSum == objParam.checkSum){
            APP.store.dispatch(initRoom(objParam, idRoom));
        }else{
           alert("Token error for " + userName  +" !");
           window.location.href = config.domain.homePage;
        }
        return;
    }else {
        let URL = APP.store.getState()['features/base/connection'].locationURL.pathname;
        let idLMS = parseInt(URL.substring(1, URL.length));
        getRoomInfo(idLMS).then(RoomInfoRes=>{
            if (RoomInfoRes.status){
                let data = JSON.parse(RoomInfoRes.data)
                let objParam = {
                    link_slide: data.Presentations[0],
                    link_video: data.Videos[0],
                    roomId: idLMS,
                    userName: 'jibri',
                    userRole: "JIBRI",
                    timeStartClass: data.openingtime
                }
                APP.store.dispatch(initRoom(objParam));
            }
        })
        return;
    }
}
