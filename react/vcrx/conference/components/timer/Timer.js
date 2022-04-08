import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {changeRoomInfo} from '/vcrx/actions';
import {socket} from '/vcrx/config';
import {ROLE_TEACHER, ROLE_STUDENT} from '/vcrx/base';

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeText: "00:00:00",
            time: 0,
            startClass: false,
        }
    }

    componentDidMount(){
        this.timerId = setInterval(() => this._timer(), 1000 );
    }

    _timer(){
        let time = this.state.time;
        let timeCounter = time + this.props.time;
        if(timeCounter >= 0 || ((this.props.flag == 1 && time < 0))){
            let day      =  Math.floor(( timeCounter / 86400));
            let hours      =  Math.floor(( timeCounter % (86400)) / (3600));
            let mins       =  Math.floor(( timeCounter % (86400)) % (3600) / 60);
            let secs       =  Math.floor(( timeCounter % (86400)) % (3600) % 60);
            let dayString = day > 0 ?  `${day} day ${"\n"}` : "";
            let hourString = "";
            if(hours > 0) {
                hourString = `${(hours < 10) ? "0"+ hours : hours}:`
            }
            hourString = (hours < 10) ? "0"+ hours : hours;
            mins  = (mins < 10) ? "0"+ mins : mins;
            secs  = (secs < 10) ? "0"+ secs : secs;
            if (this.props.flag == 1 && time < 0){
                this.setState({
                    time : 0
                });
            } else {
                if(this.state.startClass && this.props.flag == -1 && !this.props.isInClass) {
                    this.setState({
                        timeText: `${dayString}  ${hourString}:${mins}:${secs}`,
                        time : time - this.props.flag
                    });
                } else {
                    this.setState({
                        timeText: `${dayString}  ${hourString}:${mins}:${secs}`,
                        time : time + this.props.flag
                    });
                }
            }
            if(timeCounter === 0 && !this.state.startClass && this.props.flag !== 0) {
                if(this.props.flag === 1) {
                    this.setState({
                        startClass: true,
                        time : time + this.props.flag
                    })
                } else {
                    this.setState({
                        startClass: true,
                        time : time - this.props.flag
                    })
                }
            }

            if(this.props.flag > 0 && ((timeCounter === config.timer.timeEndClass && this.state.startClass) || timeCounter > config.timer.timeEndClass )){
                if(config.timer.kickAllAfterEndClass){
                    alert("The class has ended");
                    window.location.href = config.domain.homePage;
                }
                clearInterval(this.timerId);
                this.setState({
                    timeText: "Class has ended"
                })
            }
        }
    }

    render() {
        return (
            <div className="row" id = "timer">
                <span className = 'text-timer'>
                    {this.state.timeText}
                </span>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    let _timeNow = state['emg'].roomInfo.timeNow;
    let flag = 0;
    let _timeStart = state['emg'].roomInfo.timeStartClass;
    let time = 0;
    if(_timeNow < _timeStart){
        flag = -1;
        time = _timeStart - _timeNow; 
    }else{
        flag = 1;
        time = _timeNow - _timeStart;
    }
    return {
        _role : state['emg'].userInfo.role,
        flag,
        time
    };
}

export default reactReduxConnect(_mapStateToProps)(Timer);
