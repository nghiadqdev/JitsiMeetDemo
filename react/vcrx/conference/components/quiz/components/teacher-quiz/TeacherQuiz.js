import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {Doughnut} from 'react-chartjs-2';
import {socket} from '/vcrx/config';

class TeacherQuiz extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            time : '00'
        }
    }

    componentDidMount(){
        socket.on('start-quiz',()=>{
            this.setState({time:30})
            this.timerId = setInterval(() => this._timer(), 1000 );
        })
    }

    componentWillUnmount () {
        clearInterval(this.timerId);
    }
    
    _timer(){
        if(this.state.time > 0) {
            let timeText = this.state.time > 10 ? this.state.time - 1 : '0' + (this.state.time - 1)
            this.setState({ time : timeText})
        }else{
            clearInterval(this.timerId);
        }   
    }
    
    startQuiz(){
        if(this.state.time == 0){
            socket.emit('start-quiz',{room : this.props._room})
        }
    }

    componentWillReceiveProps(NextProps){
        if(NextProps._showQuiz != this.props._showQuiz && NextProps._showQuiz == true){
            this.setState({
                time : '00'
            })
        }
    }
    
    render() {
        let { a, b, c, d } = this.props;
        return (
            <div className = 'col-md-5 box-quiz'>
                <div className= 'row quiz-title'>
                    <span className = 'title-quiz-teacher'>Answers of student</span>
                    <span className = 'timer-quiz-teacher'>00:{this.state.time}</span>
                    <span className = "stop-quiz" data-toggle="modal" data-target={"#modal-student-answer-list"}>
                        list
                    </span>
                    <span className = 'stop-quiz' onClick = {()=>this.startQuiz()}>Start</span>
                </div>
                <Doughnut data={{
                    labels: ['A','B','C','D'],
                    datasets: [{
                        data: [a,b,c,d],
                        backgroundColor: ['green','#36A2EB','#FFCE56','red'],
                    }]
                }} />
            </div>
        )
    }
}
function _mapStateToProps(state) {
    let { quizAnswerList } = state['emg'];
    let a = quizAnswerList.filter(x=>x.answer == 1).length;
    let b = quizAnswerList.filter(x=>x.answer == 2).length; 
    let c = quizAnswerList.filter(x=>x.answer == 3).length; 
    let d = quizAnswerList.filter(x=>x.answer == 4).length;
    
    return {
        _role : state['emg'].userInfo.role,
        a,b,c,d,
        _room : state['features/base/conference'].room,
        _showQuiz : state['emg'].roomInfo.showQuiz
    };
}

export default reactReduxConnect(_mapStateToProps)(TeacherQuiz);
