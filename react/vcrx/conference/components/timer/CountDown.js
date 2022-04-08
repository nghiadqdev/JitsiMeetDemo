import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {socket} from '/vcrx/config';
import {ROLE_TEACHER, ROLE_STUDENT} from '/vcrx/base';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

class CountDown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remainingTime: 0,
            time: 0,
            isPlaying: false,
            reRender : true,
            newState: true,
        }
        this.duration = 0
    }

    componentDidMount(){
        socket.on('start-count-down', (data) => {
            this.start(data.timeNumber)
        })
    }

    _timer(){
        if (this.state.remainingTime > 0) {
            this.setState({remainingTime : this.state.remainingTime - 1})
        } else {
            this.setState({isPlaying : false})
            clearInterval(this.timerId);
        }
    }

    renderTime() {
        const {remainingTime, newState} = this.state
        if (remainingTime === 0 && !newState ) {
            return <div className="time-up">Time up</div>;
        }
        return (
            <div className="timer">
                <span className="value">{remainingTime}</span>
            </div>
        );
    }

    start(timeNumber) {
        if (timeNumber > 0 && timeNumber < 999) {
            this.duration = timeNumber 
            this.setState({
                reRender : false,
                remainingTime: timeNumber,
                isPlaying : true,
                newState: false,
            }, () => {
                this.setState({reRender : true})
                this.timerId = setInterval(() => this._timer(), 1000)
            })
        }
    }

    _renderCountDown(){
        const {isPlaying} = this.state;
        return(
            <CountdownCircleTimer
                isPlaying= {isPlaying}
                duration={3}
                size = {100}
                strokeWidth = {7}
                colors={[["#004777", 0.33], ["#F7B801", 0.33], ["#A30000"]]}
                onComplete={() => isPlaying ? [true, 0] : [false]}
                >
                {this.renderTime()}
            </CountdownCircleTimer>
        );
    }

    onStart(){
        const timeNumber = $('#second').val();
        socket.emit('start-count-down', {
            room: this.props._room,
            timeNumber
        });
    }

    render() {
        const {newState} = this.state;
        return (
            <div className="count-down">
                <div className ="count-down-box">
                    {this.state.reRender && this._renderCountDown()}
                </div>
                {newState && this.props._role != ROLE_STUDENT && <div className = 'second-enter-box'>
                    <div className="form-group">
                        <label htmlFor="second">Count down second</label>
                        <input type="number" className="form-control" id="second" defaultValue={0}/>
                    </div>
                    <button type="submit" className="btn btn-default" onClick = {() => this.onStart()}>Start</button>
                </div>}
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _room: state['features/base/conference'].room,
        _role : state['emg'].userInfo.role,
    };
}

export default reactReduxConnect(_mapStateToProps)(CountDown);
