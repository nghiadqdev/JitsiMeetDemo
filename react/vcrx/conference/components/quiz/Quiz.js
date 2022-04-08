import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {
    TeacherQuiz,
    StudentQuiz
} from './components';
import {
    ROLE_STUDENT
} from '/vcrx/base';

class Quiz extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {}
    }
    
    render() {
        const { pageNumber } = this.props;
        return (
            <div className = 'quiz-body'>
                {
                    this.props._role == ROLE_STUDENT 
                        ? <StudentQuiz pageNumber = {pageNumber}/>
                        : <TeacherQuiz pageNumber = {pageNumber}/>
                }
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _role : state['emg'].userInfo.role,
    };
}

export default reactReduxConnect(_mapStateToProps)(Quiz);
