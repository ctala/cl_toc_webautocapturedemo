var TOCautocapture = (function(){
  var lib = {
    loadScripts: (urls) => {
      let load = (url) => {
        return new Promise((resolve, reject) => {
          let script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.addEventListener('load', () => resolve(script), false);
          script.addEventListener('error', () => reject(script), false);
          document.body.appendChild(script);
        });
      }
      return Promise.all(urls.map(load));
    },

    getJSON: (url) => {
      return fetch(url)
      .then(response => response.json());
    },

    getSVG: (url) => {
      return fetch(url)
        .then(response => {
          if(response.ok){
            return response.text();
          }else{
            if(response.url.indexOf('landscape') < 0)
              handleError("422", error_handler);
          }
        });
    },

    showMessage: (container, message) => {
      container.innerHTML = `<div class="toc-autocapture-camera" id="toc-autocapture-camera">
                        <img id="toc-logo" class="toc-logo noselect" src="assets/logo_toc.svg">
                        <p class="inst-text noselect" style="padding-top: 30%;">${message}</p>
                      </div>`;
    }
  };
  var error_handler;
  var handleError = (error_code, error_callback) => {
      if(error_callback)
        error_callback(error_code);
      else
        alert('FAILURE');
    };

  function autocapture(container, options){
    // reset past calls
    if(typeof autocaptureMainInitFunction != 'undefined')
      autocaptureMainInitFunction = undefined;
    // basic settings
    if(typeof(container) == "string")
      container = document.getElementById(container);
    error_handler = options.failure;

    // some error handling
    if(!options.document_side){ handleError("415", error_handler); return; }
    if(!options.document_type){ handleError("412", error_handler); return; }
    if(!options.session_id){ handleError("411", error_handler); return; }

    let base_url = 'https://sandbox-autocapture-web.toc.ai/';
    if(options.dev){
      base_url = "";
    }
    options.base_url = base_url;

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    options.uuid = uuid;

    options.document_type = options.document_type.toLowerCase();
    options.document_side = options.document_side.toLowerCase();

    // css
    document.head.innerHTML += `
      <style type="text/css">
        .lds-ellipsis{z-index:12;display:block;position:absolute;width:64px;height:64px;top:45%;left:45%}.lds-ellipsis div{position:absolute;top:27px;width:11px;height:11px;border-radius:50%;background:#fff;animation-timing-function:cubic-bezier(0,1,1,0)}.lds-ellipsis div:nth-child(1){left:6px;animation:lds-ellipsis1 .6s infinite}.lds-ellipsis div:nth-child(2){left:6px;animation:lds-ellipsis2 .6s infinite}.lds-ellipsis div:nth-child(3){left:26px;animation:lds-ellipsis2 .6s infinite}.lds-ellipsis div:nth-child(4){left:45px;animation:lds-ellipsis3 .6s infinite}@keyframes lds-ellipsis1{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes lds-ellipsis3{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes lds-ellipsis2{0%{transform:translate(0,0)}100%{transform:translate(19px,0)}}
      </style>`;
    
    if (document.createStyleSheet){
      document.createStyleSheet(`${base_url}styles.css?s=${uuid}`);
      document.createStyleSheet('https://fonts.googleapis.com/css?family=Roboto');
      document.createStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');
    } else {
      document.head.innerHTML += `<link rel='stylesheet' href='${base_url}styles.css?s=${uuid}' type='text/css' media='screen' /><link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css?s=${uuid}' >`;
    }
    container.innerHTML = `
        <div class="toc-autocapture-camera" id="toc-autocapture-camera">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>`;

    var locale;
    Promise.all([
      lib.loadScripts(["https://cdn.jsdelivr.net/npm/ua-parser-js@0.7.18/src/ua-parser.min.js?s="+uuid]),
      lib.getJSON(base_url+"locale/"+options.locale+".json?s="+uuid),
      lib.getJSON(base_url+"assets/overlay.json?s="+uuid)]).then( values => {
    //lib.loadScripts(["https://cdn.jsdelivr.net/npm/ua-parser-js@0.7.18/src/ua-parser.min.js?s="+uuid]).then(() => {
      //lib.getJSON(base_url+"locale/"+options.locale+".json?s="+uuid).then(json => {
        options.locale = values[1];
        options.overlay = values[2];
        // https check
        if (options['dev'] != 'dev' && !options['http'] && location.protocol != 'https:'){ 
          lib.showMessage(container, options.locale.no_https);
          return;
        }
        // webrtc check
        let isWebRTCSupported = false;
        ['RTCPeerConnection', 'webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].forEach(function(item) {
            if (isWebRTCSupported) return;
            if (item in window) isWebRTCSupported = true;
        });
        if(!isWebRTCSupported){
          lib.showMessage(container, options.locale.not_compatible);
          return;
        }
        // device check
        let ua = new UAParser();
        let browser_name = ua.getBrowser().name;
        let os_name = ua.getOS().name;
        let iphoneSupported = false;
        if(os_name !== 'iOS'){ iphoneSupported = true; }else{
          if(browser_name !== 'Mobile Safari'){
            iphoneSupported = false;
          }else{
            iphoneSupported = true;
          }
        };
        if(!iphoneSupported){
          lib.showMessage(container, options.locale.iphone_not_safari);
          return;
        }
        // ok
        lib.loadScripts([`${base_url}autocapture-main.js?s=${uuid}`]).then((a) => {
          autocaptureMainInitFunction(container, options, lib);
        });
      //});
    });
  }

  return autocapture;
})();
if(window.jQuery){
  (function($){
    $.fn.autocapture = function(options){
      TOCautocapture(this.attr('id'), options);
    }
  }(jQuery));
}