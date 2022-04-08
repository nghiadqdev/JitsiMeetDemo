import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {changeRoomInfo} from '/vcrx/actions';
import {socket} from '/vcrx/config';
import {ROLE_TEACHER, ROLE_STUDENT, ROLE_AC} from '/vcrx/base';
import {
    TeacherHeader,
    StudentHeader,
    AcademyCoordinatorHeader
} from './components';
import UIEvents from "../../../../../service/UI/UIEvents";
import Tooltip from '@atlaskit/tooltip';

class Header extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        }
    }

    changeTitleWidth = () => {
        this.setState({
            width: $("#header").width() - $(".headerRight").width() - $(".headerLeft").width()
        })
    }

    componentDidMount() {
        socket.on("open-video",(open) => {
            this.openVideoWarmup(open)
        })
        socket.on('mute-all',() => {
            APP.UI.emitEvent(UIEvents.AUDIO_MUTED,true,true);
        })
        setTimeout(() => {
            this.changeTitleWidth();
        }, 3000);
        $(window).resize(() => this.changeTitleWidth());
    }

    openVideoWarmup(open) {
        APP.store.dispatch(changeRoomInfo({
            enableVideo: open
        }));
    }

    redirectHome() {
        window.open(config.domain.homePage);
    }

    render() {
        return (
            <div className="row" id="header">
                <div className="headerLeft">
                    <img
                    className="pad2vh"
                        src="../images/watermark.png"
                        height = "100%"
                        alt="Italian Trulli"
                        onClick={() => this.redirectHome()}
                    />
                </div>
                <div className = "headerTitle" style = {{ width: this.state.width}}>
                <Tooltip
                    content = {this.props._title}
                    position = { 'bottom' }>
                    <div className ="ellipsis">{this.props._title}</div>
                </Tooltip>
                </div>
                <div className="headerRight">
                    {
                        this.props._role == ROLE_TEACHER && <TeacherHeader />
                    }
                    {
                        this.props._role == ROLE_STUDENT && <StudentHeader />
                    }
                    {
                        this.props._role == ROLE_AC && <AcademyCoordinatorHeader />
                    }
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _role: state['emg'].userInfo.role,
        _title: state['emg'].roomInfo.title,
    };
}

export default reactReduxConnect(_mapStateToProps)(Header);
