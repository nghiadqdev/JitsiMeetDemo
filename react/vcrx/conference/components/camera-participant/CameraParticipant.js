import React, { Component } from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import VideoLayout from '../../../../../modules/UI/videolayout/VideoLayout';

class CameraParticipant extends Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps._onState) {
            let participantID = nextProps._onStateId;
            const index = nextProps._participants.findIndex(({id})=> id == participantID)
            if(index != -1){
                if(!$( "#camera_participant video" ).hasClass(`video-${participantID}`)){
                    setTimeout(function () {
                        let CameraUser = VideoLayout.updateCamUser(participantID);
                        if(CameraUser){
                            const name = APP.conference.getParticipantDisplayName(participantID)
                            if(name.split("-").length == 3){
                                $('#on-stage-name').html(name.split("-")[1])
                            } else {
                                $('#on-stage-name').html(name)
                            }
                            $('.no-participant').html('')
                            $('#camera_participant').html(CameraUser);
                        }
                    },1000);
                }
            } else {
                $('.no-participant').html('Choose one student')
                $('#camera_participant').empty()
                $('#on-stage-name').html('')
            }
        }
    }

    componentDidMount(){
        let participantID = this.props._onStateId
        const index = this.props._participants.findIndex(({id})=> id == participantID)
        if(index != -1){
            if(!$( "#camera_participant video" ).hasClass( `video-${participantID}`)){
                setTimeout(function () {
                    let CameraUser = VideoLayout.updateCamUser(participantID);
                    if(CameraUser){
                        const name = APP.conference.getParticipantDisplayName(participantID)
                        if(name.split("-").length == 3){
                            $('#on-stage-name').html(name.split("-")[1])
                        } else {
                            $('#on-stage-name').html(name)
                        }
                        $('.no-participant').html('')
                        
                        $('#camera_participant').html(CameraUser);
                    }
                },3000);
            }      
        } else {
            $('.no-participant').html('Choose one student')
            $('#camera_participant').empty()
            $('#on-stage-name').html('')
        }
    }

    render(){
        return(
            <div className="camera_participant_wrap">
                <span className ="no-participant"></span>
                <div id="camera_participant" className="video-cam"></div>
                <div id = "on-stage-name"></div>
            </div>
        )
    }
}

function _mapStateToProps(state) {
    return {
        _participants : state['features/base/participants'],
        _onStateId: state['emg'].roomInfo.onStateId,
        _onState: state['emg'].roomInfo.onState,
    };
}

export default reactReduxConnect(_mapStateToProps)(CameraParticipant);