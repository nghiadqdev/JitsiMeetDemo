import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import { clickStar } from '/vcrx/actions';
import { ROLE_TEACHER } from '/vcrx/base';

const starImg = "../../images/emg/star.png";

class StarRartingButton extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {}
    }

    clickStar(star){
        $(".star-div").addClass("not-largeCam");
        setTimeout(() => {
            $(".star-div").removeClass("not-largeCam");
        }, 20);
        if( this.props.role == ROLE_TEACHER ){
            if(star >=5 ){
                return;
            }
            APP.store.dispatch(clickStar(
                star + 1, 
                this.props.participantId, 
                this.props.role
                ));
        }else{
            return;
        }
    }

    render() {
        let user = this.props.userList.find(x=>x.id == this.props.participantId)
        let star = user ? user.star : -1
        return (
            <div className='indicator-container'>
                <div className='star-div' onClick={()=>this.clickStar(star)}>
                    <img className ='star-img' src={starImg} title='Star rating'/>
                    <span className = 'star-number'>
                        {star}
                    </span>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        role : state['emg'].userInfo.role,
        participants : state['features/base/participants'],
        userList: state['emg'].userList
    };
}

export default reactReduxConnect(_mapStateToProps)(StarRartingButton);
