import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {SUBMIT_QUIZ} from '/vcrx/base';
import {changeRoomInfo, changeUserInfo} from '/vcrx/actions';
import {socket} from '/vcrx/config';
import { saveQuizAnswer } from '/vcrx/base/apis'

class StudentQuiz extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            answer: 0,
            time : '00'
        }
    }

    componentDidMount(){
        setTimeout(() => {
            if(this.props._time != '00') {
                this.setState({ 
                    time: this.props._time -1
                }, ()=> {
                    this.timerId = setInterval(() => this._timer(), 1000 );
                })
            }
        }, 100);
        
        socket.on('start-quiz',()=>{
            this.setState({ 
                time:30
            }, ()=> {
                this.timerId = setInterval(() => this._timer(), 1000 );
            })
        })
    }

    componentWillUnmount () {
        APP.store.dispatch(changeUserInfo({
            time : this.state.time
        }))
        clearInterval(this.timerId);
    }

    componentWillReceiveProps(NextProps){
        if(NextProps._showQuiz != this.props._showQuiz && NextProps._showQuiz == true){
            this.setState({
                time : '00',
                answer: 0,
            })
            if(this.timerId){
                clearInterval(this.timerId)
            }
        }
    }

    _timer(){
        if(this.state.time > 0) {
            let timeText = this.state.time > 10 ? this.state.time - 1 : '0' + (this.state.time - 1)
            this.setState({ time : timeText})
        }else{
            console.log(1231312)
            clearInterval(this.timerId);
            APP.store.dispatch(changeRoomInfo({
                showQuiz : false
            }));
        }   
    }

    submitQuiz () {
        const { answer, time } = this.state;
        if(answer == 0 ){
            alert('You must choose one answer');
        }else{
            APP.store.dispatch(changeRoomInfo({
                showQuiz : false,
            }));
            this.setState({answer :0})
            $("#optionsRadiosA"). prop("checked", false);
            $("#optionsRadiosB"). prop("checked", false);
            $("#optionsRadiosC"). prop("checked", false);
            $("#optionsRadiosD"). prop("checked", false);
            
            const { _userId, _userName, _roomId, pageNumber} = this.props;
            let timer = 30 - time
            APP.conference.sendCommandVcrxRoom(
                SUBMIT_QUIZ, 
                JSON.stringify({
                    userId: _userId,
                    answer : answer,
                    name : _userName,
                    time : timer
                })
            );
            saveQuizAnswer(_roomId, _userId, pageNumber, answer, timer,_userName)
        }
    }

    render() {
        return (
            <div className='row'>
                <div className='col-md-12 box-quiz'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <div className='row'>
                                <div className={`col-md-3 option-quiz ${this.state.answer == 1 && 'option-choose'}`} onClick={() => this.setState({answer: 1})}>
                                    <img src="../../images/emg/choosea.png"/>
                                </div>
                                <div className={`col-md-3 option-quiz ${this.state.answer == 2 && 'option-choose'}`} onClick={() => this.setState({answer: 2})}>
                                    <img src="../../images/emg/chooseb.png"/>
                                </div>
                                <div className={`col-md-3 option-quiz ${this.state.answer == 3 && 'option-choose'}`} onClick={() => this.setState({answer: 3})}>
                                    <img src="../../images/emg/choosec.png"/>
                                </div>
                                <div className={`col-md-3 option-quiz ${this.state.answer == 4 && 'option-choose'}`} onClick={() => this.setState({answer: 4})}>
                                    <img src="../../images/emg/choosed.png"/>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-2 submit-box'>
                            <div className = 'row time-text'>
                                <span>00:{this.state.time}</span>
                            </div>
                        </div>
                        <div className='col-md-2 submit-box'>
                            <button className = "btn btn-default submit-quiz"  onClick = { ()=>this.submitQuiz()}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    let {role , id, userName, time } = state['emg'].userInfo;
    
    return {
        _role: role,
        _userId : id,
        _userName: userName,
        _showQuiz : state['emg'].roomInfo.showQuiz,
        _roomId : state['features/base/conference'].room,
        _time : time
    };
}

export default reactReduxConnect(_mapStateToProps)(StudentQuiz);
