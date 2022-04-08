import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { LargeVideo } from '/features/large-video';
import { default as Notice } from '/features/conference/components/web/Notice';
import { NotificationsContainer } from '/features/notifications/components';
import { CalleeInfoContainer } from '/features/invite';
import {ROLE_STUDENT} from '/vcrx/base';

class TeacherCamera extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    render() {
        const {
            VIDEO_QUALITY_LABEL_DISABLED,
            filmStripOnly: filmstripOnly
        } = interfaceConfig;
        const hideVideoQualityLabel
            = filmstripOnly
                || VIDEO_QUALITY_LABEL_DISABLED
                || this.props._iAmRecorder;

        return (
            <div className="video-cam" style={{ display: "inline-block" }}>
                <div id="react">
                    <div id='videoconference_page'>
                        <Notice/>
                        <div id='videospace'>
                            <LargeVideo
                                hideVideoQualityLabel={hideVideoQualityLabel} />
                        </div>
                        {
                            this.props._role != ROLE_STUDENT &&
                            <NotificationsContainer />
                        }
                        <CalleeInfoContainer />
                    </div>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _isRecording: state['features/base/config'].iAmRecorder,
        _role : state['emg'].userInfo.role
    };
}

export default reactReduxConnect(_mapStateToProps)(TeacherCamera);
