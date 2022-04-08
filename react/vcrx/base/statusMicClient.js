import { setAudioMuted } from '../../../features/base/media';

const statusMicClient = {
    /**
     * Set togleStatusMic
     * @param( string ) id - userId 
     * @param( boolean ) ismuted - true/false 
     * 
     */
    togleStatusMic(id, ismuted) {
        if (APP.conference.isLocalId(id)) {
            APP.store.dispatch(setAudioMuted(ismuted));
        }
    },
    /**
    * Set audioLevelIndicator (nhấp nháy)
    * @param( string ) id - userId 
    * @param( float ) lvl - 0,4
    * 
    */
    audioLevelIndicator(id, lvl) {
        lvl = lvl * 40;
        $('.mutelink_' + id + ' a span i').css('text-shadow', '0px 0px ' + lvl + 'px #1a29ee');
    },
};

export default statusMicClient;
