import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';

class ModalListAnswer extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    convertAnswer(answer){
        switch (answer) {
            case 1:
                return 'A'
            case 2:
                return 'B'
            case 3:
                return 'C'
            case 4:
                return 'D'
            default:
                return 'N/A'
        }
    }

    compare( a, b ) {
        if ( parseInt(a.time) < parseInt(b.time) ){
            return -1;
        }
        if ( parseInt(a.time) > parseInt(b.time) ){
            return 1;
        }
        return 0;
    }

    render() {
        return (
            <div id="modal-student-answer-list" className="modal fade" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={this.close}>&times;</button>
                            <span className ="title-modal">Detailed responses</span>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">User id</th>
                                        <th scope="col">Students’ names</th>
                                        <th scope="col">Response</th>
                                        <th scope="col">Time(s)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.listA.sort( this.compare ).map( (answer, index) => 
                                            (
                                                <tr key={index}> 
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{answer.userId}</td>
                                                    <td>{answer.name}</td>
                                                    <td>{this.convertAnswer(answer.answer)}</td>
                                                    <td>{answer.time}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            this.props.listB.sort( this.compare ).map( (answer, index) => 
                                            (
                                                <tr key={index}> 
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{answer.userId}</td>
                                                    <td>{answer.name}</td>
                                                    <td>{this.convertAnswer(answer.answer)}</td>
                                                    <td>{answer.time}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            this.props.listC.sort( this.compare ).map( (answer, index) => 
                                            (
                                                <tr key={index}> 
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{answer.userId}</td>
                                                    <td>{answer.name}</td>
                                                    <td>{this.convertAnswer(answer.answer)}</td>
                                                    <td>{answer.time}</td>
                                                </tr>
                                            ))
                                        }
                                        {
                                            this.props.listD.sort( this.compare ).map( (answer, index) => 
                                            (
                                                <tr key={index}> 
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{answer.userId}</td>
                                                    <td>{answer.name}</td>
                                                    <td>{this.convertAnswer(answer.answer)}</td>
                                                    <td>{answer.time}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    const _quizAnswerList = state['emg'].quizAnswerList
    let listA = _quizAnswerList.filter(({answer}) => answer == 1)
    let listB = _quizAnswerList.filter(({answer}) => answer == 2)
    let listC = _quizAnswerList.filter(({answer}) => answer == 3)
    let listD = _quizAnswerList.filter(({answer}) => answer == 4)
    return {
        listA,listB,listC,listD
    };
}

export default reactReduxConnect(_mapStateToProps)(ModalListAnswer);
