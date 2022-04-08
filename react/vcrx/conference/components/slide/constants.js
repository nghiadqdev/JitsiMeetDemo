import { TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE, TOOL_TEXT, TOOL_LASER} from './module_draw';
export const ICON_MORE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgBAMAAADoA3fSAAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMA/xaV1VS6IRbyAAAA2klEQVR4nO3UwU0DMRRF0cgzLuCXMCIpwBINuIQR6b8WRFaQsGDjt+GcBq709O3LBQAAAAAAAAAAAAAAAAAAAAAAgP+upYNbOnhNB890cIR7rcLBng7u6eCRDo50cIaDvcLBLR080sEzHZzhYKtwcEsH93TwTAdHOPh1M9FgTwf3dPBIB0c6OMPBx80kg1s6eE0Hz3RwhIOPjy0Z7OngHg7eZjTYPqqSwf5e0eDbrGSw3auSwT4qGvw+ZyD4c871wac5lwef51wcfJ1zbfD2OufS4G9zZt4h8Befs4IbC/yY1jcAAAAASUVORK5CYII='
export const PENCIL_SRC = '../../images/emg/pencil.png';
export const LINE_SRC = '../../images/emg/line.png';
export const RECTANGLE_SRC = '../../images/emg/square.png';
export const ELLIPSE_SRC = '../../images/emg/circle.png';
export const TEXT_SRC = '../../images/emg/text.png';
export const LASER_SRC = '../../images/emg/laser.png';
export const COLOR_SRC = '../../images/emg/color.png';
export const CLEAR_SRC = '../../images/emg/delete.png';
export const NEXT_SRC = '../../../../../images/emg/next.png';
export const BACK_SRC = '../../../../../images/emg/back.png';
export const UNDO_SRC = '../../images/emg/undo.png';
export const SIZE_SRC = '../../images/emg/size.png';

export const TOOL_COMPACT = [
    {
        tool: TOOL_PENCIL,
        src: PENCIL_SRC,
        title: 'Tool pencil'
    },
    {
        tool: TOOL_LINE,
        src: LINE_SRC,
        title: 'Tool line'
    },
    {
        tool: TOOL_RECTANGLE,
        src: RECTANGLE_SRC,
        title: 'Tool rectangle'
    },
    {
        tool: TOOL_ELLIPSE,
        src: ELLIPSE_SRC,
        title: 'Tool ellipse'
    },
    {
        tool: TOOL_TEXT,
        src: TEXT_SRC,
        title: 'Tool text'
    },
    {
        tool: TOOL_LASER,
        src: LASER_SRC,
        title: 'Tool pencil'
    },
];

export const LIST_SIZE = [ 2, 4, 6, 8, 10];

export const LIST_COLOR = [ '#ff0000', '#ffff00', '#0000ff', '#000000', '#cc33ff', '#00ff00'];

export const RATIO = 9 / 16;

export const KEY_EVENT_NEXT_SLIDE = config.event_key_next_slide || ['enter', 'n', 'right', 'down', 'space', 'pagedown'];
export const KEY_EVENT_BACK_SLIDE = config.event_key_back_slide || ['pageup', 'p', 'left', 'up', 'backspace'];