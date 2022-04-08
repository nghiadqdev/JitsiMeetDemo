import { BE_AUTH, BASE_BE_URL, API_URL } from './constants';
const LOGIN_URL = `${BASE_BE_URL}/login/token.php?service=moodle_mobile_app`;
const ROOM_INFO_URL = `${BASE_BE_URL}/webservice/rest/server.php?wsfunction=mod_bigbluebuttonbn_get_mercury_session_info&moodlewsrestformat=json`;

export function loginBE() {
    return new Promise((resolve, reject)=>{
        fetch(`${LOGIN_URL}&username=${BE_AUTH.userName}&password=${BE_AUTH.password}`, {
            method: "GET",
        }).then(function(response) {
            resolve(response.json())
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getRoomInfo(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${ROOM_INFO_URL}&wstoken=${BE_AUTH.wstoken}&mercuryid=${roomId}`, {
            method: "GET",
        }).then(function(response) {
            resolve(response.json())
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveStar(roomId, userId, star) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/star`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId, userId, star 
            })
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getUserStar(roomId, userId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/star/${roomId}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getStarByRoomId(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/star/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveBanChat(roomId, userId, banChat) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/ban-cam-chat/banChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId, userId, banChat 
            })
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveBanCam(roomId, userId, banCam) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/ban-cam-chat/banCam`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId, userId, banCam 
            })
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveQuizAnswer(roomId, userId, pageNumber, answer, time, name) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/quiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId, userId, pageNumber, answer, time, name
            })
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getBanByRoomId(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/ban-cam-chat/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getUserLog(roomId,userId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/get-room-log/${roomId}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getRoomLog(roomId, userId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/get-room-log/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getInfoClass(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/get-room-log/info-class/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveLogChat(data) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    })
}

export function getLogChat(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/chat/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveLogInOut(data) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/log-in-out`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function getLogGrades(roomId) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/get-room-log/log-grades/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(function(response) {
            resolve(response.json());
        }).catch(err=>{
            reject(err);
        });
    })
}

export function saveLogGrades(data) {
    return new Promise((resolve, reject)=>{
        fetch(`${API_URL}/save-room-log`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }).catch(err=>{
            reject(err);
        });
    })
}
