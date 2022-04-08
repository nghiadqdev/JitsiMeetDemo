import React,{Component} from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import {SHOW_IN_LIST_GRADES} from '../../../base';
import { getLogGrades, saveLogGrades } from '../../../base/apis'

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reload:false,
            logGrades : []
        }
    }

    reloadList() {
        this.setState({reload : true})
        setTimeout(() => {
            this.setState({reload : false})
        }, 1);
    }

    componentDidMount(){
        $('#modal-user-list').on('show.bs.modal', () => {
            getLogGrades(this.props._room).then(res => {
                const grades = res.filter(({role}) => SHOW_IN_LIST_GRADES.includes(role))
                this.setState({logGrades: grades})
                this.reloadList()
            })
        })
    }

    handleChange = e => {
        const {name, value, id } = e.target
        switch (name) {
            case 'grades':
                const data = value == '' ? 0 : Number(value)
                this.saveState(name, id, data)
                break;
            case 'feedback':
                this.saveState(name, id, value)
                break;
            default:
                break;
        }
    };

    saveState = (name, id, data) => {
        const newState = { ...this.state };
        let userIndex = newState.logGrades.findIndex(({userId}) => userId == id.replace(`${name}_`,''))
        if (userIndex != -1){
            newState.logGrades[userIndex][name] = data
            this.setState(newState);
        }
    }

    saveLogGrades = async () => {
        this.reloadList()
        saveLogGrades(this.state.logGrades)
    }

    render() {
        return (
            <div id="modal-user-list" className="modal fade bs-example-modal-lg" role="dialog">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" onClick={this.close}>&times;</button>
                            <span className ="title-modal">Student's grades</span>
                        </div>
                        <div className="modal-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead>
                                        <tr style={{textAlign: "center"}}>
                                            <th className = "col-md-1 center" scope="col">#</th>
                                            <th className = "col-md-1 center" scope="col">UserID</th>
                                            <th className = "col-md-3 center" scope="col">Student’s name</th>
                                            <th className = "col-md-2 center" scope="col">Grade</th>
                                            <th className = "col-md-5 center" scope="col">Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!this.state.reload &&
                                            this.state.logGrades.map((user, index) => 
                                            (
                                                <tr key={index} id = {`row_${user.userId}`}> 
                                                    <th className ="center" scope="row">{index + 1}</th>
                                                    <td >{user.userId}</td>
                                                    <td >{user.name}</td>
                                                    <td className="center">
                                                        <input className ="halfWidth" 
                                                            type="number"
                                                            name ="grades"
                                                            id = {`grades_${user.userId}`}
                                                            defaultValue ={user.grades}
                                                            onChange ={this.handleChange}
                                                        />
                                                    </td>
                                                    <td>
                                                        <textarea className="fullWidth" 
                                                            name ="feedback" 
                                                            id = {`feedback_${user.userId}`}
                                                            onChange ={this.handleChange}
                                                            defaultValue = {user.feedback}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={this.saveLogGrades}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _room : state['features/base/conference'].room,
    }
}

export default reactReduxConnect(_mapStateToProps)(UserList);
