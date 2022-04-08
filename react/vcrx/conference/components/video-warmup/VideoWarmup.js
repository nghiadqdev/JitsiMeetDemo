import _ from 'lodash';
import React, { Component } from 'react';
import { connect as reactReduxConnect } from 'react-redux';
import {changeRoomInfo} from '/vcrx/actions';
import {socket} from '/vcrx/config';
import {CONTROL_VIDEO_WARMUP} from '/vcrx/base';
import ReactPlayer from 'react-player';

let videoPlayer

class VideoWarmup extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            url: null,
            pip: false,
            playing: false,
            controls: false,
            light: false,
            volume: 0.8,
            muted: false,
            played: 0,
            loaded: 0,
            duration: 0,
            playbackRate: 1.0,
            playedSeconds:0,
            loop: false
        }
        this.seekTimeVideo = this.seekTimeVideo.bind(this);
    }

    componentWillMount(){
        socket.emit('get-time-video', this.props._room);
    }

    componentDidMount() {
        socket.on("play-video",(play)=>{
            APP.store.dispatch(changeRoomInfo({ playVideo : play }));
        });
        socket.on("seek-video",(seek)=>{
            videoPlayer.seekTo(parseFloat(seek));
        });
        socket.on("get-time-video", (log) => {
            this.seekTimeVideo(log)
        })
    }

    seekTimeVideo = (log) => {
        const timeVideoDb = log.seek ? log.seek : 0
        const timeVideoLocalStorage = window.localStorage.getItem( `video-time-${this.props._room}`);
        if (timeVideoLocalStorage && JSON.parse(timeVideoLocalStorage).played >= log.seek) {
            videoPlayer.seekTo(parseFloat(JSON.parse(timeVideoLocalStorage).played))
        } else {
            videoPlayer.seekTo(parseFloat(timeVideoDb))
        }
    }

    handleEnablePIP = () => {
        this.setState({ pip: true })
    }
    handlePlay = () => {
        this.setState({ playing: true })
    }

    handlePlayPause = (play) => {
        if(CONTROL_VIDEO_WARMUP.includes(this.props._role)) {
            socket.emit('play-video',{
                room: this.props._room,
                play: play,
                played: this.state.played
            });
            APP.store.dispatch(changeRoomInfo({ playVideo : play }));
        }
    }

    handleDisablePIP = () => {
        this.setState({ pip: false })
    }

    handlePause = () => {
        this.setState({ playing: false })
    }

    handleEnded = () => {
        this.setState({ playVideo : this.state.loop });
        socket.emit('end-video',{
            room: this.props._room,
            play: false,
            played: 0
        });
        window.localStorage.setItem( `video-time-${this.props._room}`, JSON.stringify({"playedSeconds":0,"played":0,"loadedSeconds":0,"loaded":0}));
    }

    handleProgress = state => {
        if (!this.state.seeking) {
            this.setState(state)
            window.localStorage.setItem( `video-time-${this.props._room}`, JSON.stringify(state));
        }
    }

    handleDuration = (duration) => {
        this.setState({ duration })
    }

    handleSeek = (seek) => {}

    ref = player => {
        videoPlayer = player
    }

    handleSeekMouseDown = () => {
        CONTROL_VIDEO_WARMUP.includes(this.props._role) && 
        this.setState({ seeking: true })
    }

    handleSeekChange = e => {
        CONTROL_VIDEO_WARMUP.includes(this.props._role) &&
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleSeekMouseUp = e => {
        if (CONTROL_VIDEO_WARMUP.includes(this.props._role)){
            const seekValue = e.target.value
            this.setState({ seeking: false })
            videoPlayer.seekTo(parseFloat(seekValue))
            socket.emit("seek-video", {
                room: this.props._room,
                seek: seekValue,
            })
        }
    }

    format (seconds) {
        const date = new Date(seconds * 1000)
        const hh = date.getUTCHours()
        const mm = date.getUTCMinutes()
        const ss = this.pad(date.getUTCSeconds())
        if (hh) {
            return `${hh}:${this.pad(mm)}:${ss}`
        }
        return `${mm}:${ss}`
    }
      
    pad (string) {
        return ('0' + string).slice(-2)
    }

    duration (seconds) {
        return (
            <time dateTime={`P${Math.round(seconds)}S`}>
                {this.format(seconds)}
            </time>
        )
    }

    render() {
        const {controls, light, volume, played, loaded, muted, loop, playbackRate, pip, duration } = this.state

        return (
            <div id="video-area">
                {!CONTROL_VIDEO_WARMUP.includes(this.props._role) && <div className ='permission-video'/>}
                <ReactPlayer
                    ref={this.ref}
                    className='video-warmup'
                    width='100%'
                    height='100%'
                    url={this.props._linkVideo}
                    pip={pip}
                    playing={this.props._playVideo}
                    controls={controls}
                    light={light}
                    loop={loop}
                    playbackRate={playbackRate}
                    volume={volume}
                    muted={muted}
                    onReady={() => {}}
                    onStart={() => {}}
                    onPlay={this.handlePlay}
                    onEnablePIP={this.handleEnablePIP}
                    onDisablePIP={this.handleDisablePIP}
                    onPause={this.handlePause}
                    onBuffer={() => {}}
                    onSeek={this.handleSeek}
                    onEnded={this.handleEnded}
                    onError={e => console.log('onError', e)}
                    onProgress={this.handleProgress}
                    onDuration={this.handleDuration}
                />
                <div className = 'control-video'>
                    <div className = 'control-button'>
                        {this.props._playVideo 
                            ? <i className="fa fa-pause fa-2x play-button" onClick ={()=>this.handlePlayPause(false)}/> 
                            : <i className="fa fa-play fa-2x play-button" onClick ={()=>this.handlePlayPause(true)}/>
                        }
                    </div>
                    <input
                        className = 'seek-video'
                        type='range' min={0} max={0.999999} step='any'
                        value={played}
                        onMouseDown={this.handleSeekMouseDown}
                        onChange={this.handleSeekChange}
                        onMouseUp={this.handleSeekMouseUp}
                    />
                    <div className='time-play'>
                        <div className='time-in-box'>
                            {this.duration(duration * played)}/{this.duration(duration)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function _mapStateToProps(state) {
    return {
        _isRecording: state['features/base/config'].iAmRecorder,
        _playVideo : state['emg'].roomInfo.playVideo,
        _room : state['features/base/conference'].room,
        _linkVideo : state['emg'].roomInfo.video,
        _role : state['emg'].userInfo.role,
        _seek : state['emg'].roomInfo.seek
    };
}

export default reactReduxConnect(_mapStateToProps)(VideoWarmup);
