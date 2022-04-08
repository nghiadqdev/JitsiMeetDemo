/* eslint-disable no-unused-vars, no-var */

var config = {
    domain : {
        homePage    : "https://athena-dev.emg.edu.vn",
        socket      : "https://mercury-services-stage.emg.edu.vn",
        backEnd     : "https://athena-dev.emg.edu.vn"
    },
    permission: {
        onMic               : ["AC","TEACHER","STUDENT"],
        onCam               : ["TEACHER","STUDENT"],
        enableVideoWarmup   : ["TEACHER","AC"],
        onDraw              : ["TEACHER","AC"],
        onNextSlide         : ["TEACHER"],
        receiveChatWhenBaned: ["AC"],
        seeConnectionAll    : ["AC","ADMIN"],
        logNetWork          : ["AC","ADMIN"],
        saveLogAction       : ["STUDENT", "TEACHER"],
        onState             : ["TEACHER","AC"]
    },
    timer :{
        kickAllAfterEndClass:true,
        timeEndClass :  86400 // Đơn vị là giây, 7 days
    },
    chat :{
//        regex : /Fuck|bitch|asshole|shit|hell[\s,$]|cứt|đéo|đít|địt/gi
        regex : "Fuck|bitch|asshole|shit|hell[\\s,$]|cứt|đéo|đít|địt"
    },
    adminFeatures :{
        enableSharingDesktop    : false,
        enableStreaming         : false,
        enableRecording         : false
    },
    time_send_laser_move: 100,  // Đơn vị là millisec
    collapseDrawTool: true,
    
    support: {
        hotline: "028 3933 0455,028 3930 8010",
        email: "emgsouth@emg.vn"
    }, 
    useJWT: false,  //whether to handle param jwt or not

    largeResolution: 720,

    largeConstraints: {
        video: {
            aspectRatio: 16 / 9,
            height: {
                ideal: 720,
                max: 720,
                min: 360
            }
        }
    },  
   // Connection
    //

    hosts: {
        domain: '8x8.vc',
       // muc: 'conference.vpaas-magic-cookie-5d8bb0d12c69432ca4701dbafac76095.8x8.vc', // FIXME: use XEP-0030
        muc: 'conference.8x8.vc', // FIXME: use XEP-0030
        focus: 'focus.8x8.vc',
    },

    disableSimulcast: false,
    resolution: 180, //720,
    constraints: {
        video: {
            height: {
                ideal: 240,
                max: 240,
                min: 180
            },
       //     width: {
       //         ideal: 1280,
       //         max: 1280,
       //         min: 320
       //     }
        }
    },
//    externalConnectUrl: '//8x8.vc/vpaas-magic-cookie-5d8bb0d12c69432ca4701dbafac76095/http-pre-bind',
    analytics: {
//            amplitudeAPPKey: "28def3fe82bf211f5ec8c02e89dfaa1d",
//        rtcstatsEnabled: true ,
//        rtcstatsEndpoint: "wss://rtcstats-server-8x8.jitsi.net/",
        rtcstatsPollInterval: 2000,
                    whiteListedEvents: [ 'conference.joined', 'page.reload.scheduled', 'rejoined', 'transport.stats', 'rtcstats.trace.onclose' ],
    },
    enableP2P: false, // flag to control P2P connections
    // New P2P options
    p2p: {
        enabled: false,
        disableH264: true,
        useStunTurn: true // use XEP-0215 to fetch STUN and TURN servers for the P2P connection
    },
    useStunTurn: true, // use XEP-0215 to fetch TURN servers for the JVB connection
    useTurnUdp: true,
    bosh: '//8x8.vc/vpaas-magic-cookie-5d8bb0d12c69432ca4701dbafac76095/http-bind', // FIXME: use xep-0156 for that
//    websocket: 'wss://8x8.vc/vpaas-magic-cookie-5d8bb0d12c69432ca4701dbafac76095/xmpp-websocket', // FIXME: use xep-0156 for that
//    websocketKeepAliveUrl: 'https://8x8.vc/vpaas-magic-cookie-5d8bb0d12c69432ca4701dbafac76095/_unlock',
    serviceUrl:  'wss://8x8.vc/xmpp-websocket',

    clientNode: 'http://jitsi.org/jitsimeet', // The name of client node advertised in XEP-0115 'c' stanza
    //deprecated desktop sharing settings, included only because older version of jitsi-meet require them
    desktopSharing: 'ext', // Desktop sharing method. Can be set to 'ext', 'webrtc' or false to disable.
    chromeExtensionId: 'kglhbbefdnlheedjiejgomgmfplipfeb', // Id of desktop streamer Chrome extension
    desktopSharingSources: ['screen', 'window'],
    googleApiApplicationClientID: "363010332267-vnd4d3tpbqs8dfjluqg3ak9e0iqutfli.apps.googleusercontent.com",
    microsoftApiApplicationClientID: "9fdf7da5-cd01-48c5-9bd4-72cf8c1821fc",
    //new desktop sharing settings
    desktopSharingChromeExtId: 'kglhbbefdnlheedjiejgomgmfplipfeb', // Id of desktop streamer Chrome extension
    desktopSharingChromeSources: ['screen', 'window', 'tab'],
    enableLipSync: false,
    enableSaveLogs: true,
    disableRtx: false, // Enables RTX everywhere
    enableScreenshotCapture: false,
    channelLastN: -1, // The default value of the channel attribute last-n.
    //channelLastN: 20, // The default value of the channel attribute last-n.
    //lastNLimits: {
    //    5: 20,
    //    30: 15,
    //    50: 10,
    //    70: 5,
    //    90: 2
    //},
    videoQuality: {
                minHeightForQualityLvl: {
            240: 'standard',
            180: 'standard',
//            540: 'high'
        }
        },
    startBitrate: "500",//"800",
    disableAudioLevels: false,
    stereo: false,
    forceJVB121Ratio:  -1,
   // enableTalkWhileMuted: true,

    enableNoAudioDetection: false,

    enableNoisyMicDetection: true,

    enableClosePage: true,

    disableLocalVideoFlip: false,

//    hiddenDomain: 'recorder.8x8.vc',
//        dropbox: {
//        appKey: 'jq32b97ckuwe8i3'
//    },


  //  transcribingEnabled: true,
  //  liveStreamingEnabled: true,
  //  fileRecordingsEnabled: true,
  //  fileRecordingsServiceEnabled: true,
  //  fileRecordingsServiceSharingEnabled: true,
    requireDisplayName: true,
    enableWelcomePage: true,
    isBrand: false,
// To enable sending statistics to callstats.io you should provide Applicaiton ID and Secret.
    callStatsID: "706724306",//Application ID for callstats.io API
    callStatsSecret: "f+TKWryzPOyX:dNR8PMw42WJwM3YM1XkJUjPOLY0M40wz+0D4mZud8mQ=",//Secret for callstats.io API
 /*   callStatsCustomScriptUrl: "https://api.callstats.io/static/callstats-ws.min.js",
    enableEmailInStats: true,
    billingCounterUrl: 'https://api-vo.jitsi.net/billing-counter/v1/connection',
    brandingDataUrl: 'https://api-vo.jitsi.net/branding/public/v1/conferences',
    dialInNumbersUrl: 'https://platform.8x8.com/meetingaccess/v1/dids',
    dialInConfCodeUrl:  'https://platform.8x8.com/meetingaccess/v1/conferences',

    dialOutCodesUrl:  'https://platform.8x8.com/meetingaccess/v1/country/codes',
    dialOutAuthUrl: 'https://api-vo.jitsi.net/phone-authorize',
    peopleSearchUrl: 'https://api-vo.jitsi.net/v1/directory/search',
    inviteServiceUrl: 'https://api-vo.jitsi.net/v1/meeting/invite',
    inviteServiceCallFlowsUrl: 'https://api.jitsi.net/conferenceinvitecallflows',
    peopleSearchQueryTypes: ['user','conferenceRooms'],*/
    //startAudioMuted: false,
    startWithAudioMuted: false,
    audioMutedWhenJoined : true,
    //startVideoMuted: false,
    enableUserRolesBasedOnToken: true,
    roomPasswordNumberOfDigits: 10,
//    _8x8VideoMeetingsUrl: 'https://app.8x8.vc',
//    _screenshotHistoryUrl: 'https://api-vo.jitsi.net/vo-content-sharing-history/v1/file-metadata',
    enableLayerSuspension: true,
    enableForcedReload: false,
/*    feedbackPercentage: 0,
        deploymentUrls: {
            userDocumentationURL: "https://docs.8x8.com/8x8WebHelp/video-meetings/Default.htm",
            downloadAppsUrl: "https://download.8x8.vc"
        },
    chromeExtensionBanner: {
        url: "https://chrome.google.com/webstore/detail/8x8-video-meetings/aodngmlagnikpifloamojhehjgeglfjh",
        chromeExtensionsInfo: [{"path": "assets/images/icon48.png", "id": "aodngmlagnikpifloamojhehjgeglfjh"}, {"path": "assets/images/icon48.png", "id": "meijccdegkamekaajhmaddlclalhjafm"}]
    },*/
    prejoinPageEnabled: true,
    enableInsecureRoomNameWarning: false,
    hepopAnalyticsUrl: "",
/*    hepopAnalyticsEvent: {
        product: "lib-jitsi-meet",
        subproduct: "prod-8x8",
        name: "jitsi.page.load.failed",
        action: "page.load.failed",
        actionSubject: "page.load",
        type: "page.load.failed",
        source: "page.load",
        attributes: {
            type: "operational",
            source: 'page.load'
        },
        server: "8x8.vc"
    },*/
    deploymentInfo: {
        environment: 'prod-8x8',
        envType: 'prod',
        releaseNumber: '1447',
        shard: 'prod-8x8-ap-south-1b-s13',
        region: 'ap-south-1',
        userRegion: 'ap-southeast-1',
        crossRegion: (!'ap-southeast-1' || 'ap-south-1' === 'ap-southeast-1') ? 0 : 1
    },
    e2eping: {
        pingInterval: -1
    },
    abTesting: {
    },
    testing: {
                capScreenshareBitrate: 1,
    }
};

/* eslint-enable no-unused-vars, no-var */
