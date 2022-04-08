import React, { Component } from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import VideoLayout from '../../../../../modules/UI/videolayout/VideoLayout';

class SmallTeacherCamera extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        if (this.props.participantId){
            const id = this.props.participantId
            if(!$( "#teacher_camera_participant video" ).hasClass( `video-${id}`)){
                setTimeout(function () {
                    let CameraUser = VideoLayout.updateCamUser(id);
                    if(CameraUser){
                        const name = APP.conference.getParticipantDisplayName(id)
                        if(name.split("-").length == 3){
                            $('#teacher-on-stage-name').html(name.split("-")[1])
                        } else {
                            $('#teacher-on-stage-name').html(name)
                        }
                        $('.no-participant').html('')
                        
                        $('#teacher_camera_participant').html(CameraUser);
                    }
                },1000);
            }      
        }else {
            $('#teacher_camera_participant').empty()
            $('#teacher-on-stage-name').html('')
        }
    }

    UNSAFE_componentWillReceiveProps(NextProps){
        if(NextProps.participantId != this.props.participantId){
            if (NextProps.participantId){
                const id = NextProps.participantId
                if(!$( "#teacher_camera_participant video" ).hasClass( `video-${id}`)){
                    setTimeout(function () {
                        let CameraUser = VideoLayout.updateCamUser(id);
                        if(CameraUser){
                            const name = APP.conference.getParticipantDisplayName(id)
                            if(name.split("-").length == 3){
                                $('#teacher-on-stage-name').html(name.split("-")[1])
                            } else {
                                $('#teacher-on-stage-name').html(name)
                            }
                            $('.no-participant').html('')
                            
                            $('#teacher_camera_participant').html(CameraUser);
                        }
                    },1000);
                }      
            }else {
                $('#teacher_camera_participant').empty()
                $('#teacher-on-stage-name').html('')
            }
        }
    }


    render(){
        return(
            <div className="camera_participant_wrap" style ={{height : '100%', width: '100%'}}>
                <div id="teacher_camera_participant" className="video-cam"></div>
                <div id = "teacher-on-stage-name"></div>
            </div>
        )
    }
}

function _mapStateToProps(state) {
    let _participants = state['features/base/participants'];
    let participantId;
        
    let listTeacher = _participants.filter(function (teacher) {
        return (teacher.name && (teacher.name.split("-")[0] === "GV")
            && (teacher.connectionStatus == undefined || teacher.connectionStatus =="active"));
    })
    if(listTeacher.length > 0 ){
        participantId = listTeacher[0].id;
    }
    return {
        _participants,
        _tracks: state['features/base/tracks'],
        participantId
    };
}

export default reactReduxConnect(_mapStateToProps)(SmallTeacherCamera);