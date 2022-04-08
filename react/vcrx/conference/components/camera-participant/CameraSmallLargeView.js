import React, { Component } from 'react';
import {connect as reactReduxConnect} from 'react-redux';
import VideoLayout from '../../../../../modules/UI/videolayout/VideoLayout';
import {changeRoomInfo} from '/vcrx/actions'

class CameraSmallLargeView extends Component {
    constructor(props){
        super(props);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps._largeSmallCam) {
            let participantID = nextProps._largeSmallCamId;
            const index = nextProps._participants.findIndex(({id})=> id == participantID)
            if(index != -1){
                if(!$( "#camera-small-large-view video" ).hasClass(`video-${participantID}`)){
                    setTimeout(function () {
                        let CameraUser = VideoLayout.updateCamUser(participantID);
                        if(CameraUser){
                            const name = APP.conference.getParticipantDisplayName(participantID)
                            if(name.split("-").length == 3){
                                $('#small-large-view-name').html(name.split("-")[1])
                            } else {
                                $('#small-large-view-name').html(name)
                            }
                            $('#camera-small-large-view').html(CameraUser);
                        }
                    },1000);
                }
            } else {
                $('#camera-small-large-view').empty()
                $('#small-large-view-name').html('')
            }
        }
    }

    componentDidMount(){
        let participantID = this.props._largeSmallCamId
        const index = this.props._participants.findIndex(({id})=> id == participantID)
        if(index != -1){
            if(!$( "#camera-small-large-view video" ).hasClass( `video-${participantID}`)){
                setTimeout(function () {
                    let CameraUser = VideoLayout.updateCamUser(participantID);
                    if(CameraUser){
                        const name = APP.conference.getParticipantDisplayName(participantID)
                        if(name.split("-").length == 3){
                            $('#small-large-view-name').html(name.split("-")[1])
                        } else {
                            $('#small-large-view-name').html(name)
                        }
                        
                        $('#camera-small-large-view').html(CameraUser);
                    }
                },1000);
            }      
        } else {
            $('#camera-small-large-view').empty()
            $('#small-large-view-name').html('')
        }
    }

    disableLargeSmallCam(){
        APP.store.dispatch(changeRoomInfo({
            largeSmallCam: false
        }))
    }

    render(){
        return(
            <div className = "camera_participant_wrap large-view-small-cam">
                <button type="button" className="close close-camera-small-large-view" data-dismiss="modal" 
                onClick = {() => this.disableLargeSmallCam()}>×</button>
                <div id = "camera-small-large-view"></div>
                <div id = "small-large-view-name"></div>
            </div>
        )
    }
}

function _mapStateToProps(state) {
    return {
        _participants : state['features/base/participants'],
        _largeSmallCamId: state['emg'].roomInfo.largeSmallCamId,
        _largeSmallCam: state['emg'].roomInfo.largeSmallCam,
    };
}

export default reactReduxConnect(_mapStateToProps)(CameraSmallLargeView);