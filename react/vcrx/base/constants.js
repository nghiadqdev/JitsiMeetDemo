//Language
export const KEY_LANGUAGE = "LANGUAGE";
export const LANGUAGE_EN = "en";
export const LANGUAGE_VI = "vi";

// Role
export const ROLE_AC = "AC";
export const ROLE_TEACHER = "TEACHER";
export const ROLE_ASSISTANT = "ASSISTANT";
export const ROLE_STUDENT = "STUDENT";
export const ROLE_MOBILE = "MOBILE";
export const ROLE_AUDIT = "AUDIT";

export const ROLE_KEY_AC = "AC";
export const ROLE_KEY_TEACHER = "GV";
export const ROLE_KEY_ASSISTANT = "TG";
export const ROLE_KEY_STUDENT = "HV";
export const ROLE_KEY_MOBILE = "MB";
export const ROLE_KEY_AUDIT = "DT";

export const ROLE_KEY = {
    ac: "AC",
    gv: "GV",
    tg: "TG",
    hv: "HV",
    mb: "MB",
    dt: "DT"
};

export const ACTION_TOGGLE_VIDEO_WARMUP = "video-warmup";
export const ACTION_TOGGLE_MICRO        = "toggleMicro";
export const ACTION_KICK                = "kick";
export const ACTION_CLICK_CAMERA        = "clickCamera";
export const ACTION_TOGGLE_DRAW         = "toggleDraw";
export const ACTION_UPDATE_P            = "ACTION_UPDATE_P";
export const ACTION_TOGGLE_STAR         = "ACTION_TOGGLE_STAR";
export const CREATE_QUIZ                = "CREATE_QUIZ";
export const SUBMIT_QUIZ                = "SUBMIT_QUIZ";
export const STOP_QUIZ                  = "STOP_QUIZ";
export const ACTION_BAN_CHAT            = "ACTION_BAN_CHAT";
export const ACTION_BAN_CAM             = "ACTION_BAN_CAM";
export const ACTION_DELETE_CHAT         = "ACTION_DELETE_CHAT";

export const SECRET = '8cd8ef52e8e101574e400365b55e11a6';

export const BE_AUTH = {
    userName :'emg_student',
    password : 'Emg@2020',
    wstoken  : 'bd807ecf59115bfe417c16ac5319924b'
}

export const MICRO = {
    enableAction : [ROLE_TEACHER,ROLE_AC]
}

export const FILMSTRIP = {
    enableSmallCamera : [ROLE_KEY_STUDENT,ROLE_KEY_AC],
    enableLocalCamera : [ROLE_STUDENT],
    enableLocalCameraLargeView : [ROLE_STUDENT, ROLE_KEY_AC],
    showCamBan : [ROLE_TEACHER, ROLE_AC],
}

export const LARGE_ICON_UNMUTE = '../../../images/emg/icon_unmute.png';
export const LARGE_ICON_DRAWING = '../../../images/emg/icon_draw_orange.png';

export const CONTROL_VIDEO_WARMUP = config.control_video_warmup || [ROLE_TEACHER,ROLE_AC];
export const SHOW_IN_LIST_GRADES = config.show_in_list_grades || [ROLE_STUDENT];
export const TIME_SEND_LASER_MOVE = config.time_send_laser_move || 300;
export const ROOM_PASSWORD = config.room_pass || SECRET;
export const LARGE_VIEW_MODE = config.large_view_mode || [ROLE_STUDENT];
export const VIEW_LARGE_SMALL_CAM = config.view_large_small_cam || [ROLE_TEACHER, ROLE_AC];

export const BASE_BE_URL = config.domain.backEnd || 'https://athena-dev.emg.edu.vn';
export const API_URL = `${config.domain.socket}/api` || 'https://mercury-api.emg.edu.vn';