var TOCliveness = (function(){
  var lib = {
    loadScripts: (urls) => {
      let load = ([url, cond]) => {
        if(cond){
          return new Promise((resolve, reject) => {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.addEventListener('load', () => resolve(script), false);
            script.addEventListener('error', () => reject(script), false);
            document.body.appendChild(script);
          });
        }
      }
      return urls.map(load);
    },

    getJSON: (url) => {
      return fetch(url)
      .then(response => response.json());
    },

    showMessage: (container, message) => {
      container.innerHTML = `<div class="toc-liveness-camera" id="toc-liveness-camera">
                        <img id="toc-logo" class="toc-logo noselect" src="assets/logo_toc.svg">
                        <p class="inst-text noselect" style="padding-top: 30%;">${message}</p>
                      </div>`;
    }
  };

  function liveness(container, options, callback){
    // reset past calls
    if(typeof livenessMainInitFunction != 'undefined')
      livenessMainInitFunction = undefined;
    // basic settings
    if(typeof(container) == "string")
      container = document.getElementById(container);

    if(callback && !options.callback)
      options.callback = callback;

    let base_url = 'https://liveness-web.toc.ai/';
    if(options.dev){
      base_url = "";
    }
    options.base_url = base_url;

    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    options.uuid = uuid;

    // css
    document.head.innerHTML += `
      <style type="text/css">
        .lds-ellipsis{display:block;position:absolute;width:64px;height:64px;top:45%;left:45%}.lds-ellipsis div{position:absolute;top:27px;width:11px;height:11px;border-radius:50%;background:#fff;animation-timing-function:cubic-bezier(0,1,1,0)}.lds-ellipsis div:nth-child(1){left:6px;animation:lds-ellipsis1 .6s infinite}.lds-ellipsis div:nth-child(2){left:6px;animation:lds-ellipsis2 .6s infinite}.lds-ellipsis div:nth-child(3){left:26px;animation:lds-ellipsis2 .6s infinite}.lds-ellipsis div:nth-child(4){left:45px;animation:lds-ellipsis3 .6s infinite}@keyframes lds-ellipsis1{0%{transform:scale(0)}100%{transform:scale(1)}}@keyframes lds-ellipsis3{0%{transform:scale(1)}100%{transform:scale(0)}}@keyframes lds-ellipsis2{0%{transform:translate(0,0)}100%{transform:translate(19px,0)}}
      </style>`;
    
    var ua_parser_url;
    if(options.local_lib){
      ua_parser_url = 'js/ua-parser.min.js';
      roboto_url = "css/roboto.css";
      fontawesome_url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    }else{
      ua_parser_url = 'https://cdn.jsdelivr.net/npm/ua-parser-js@0.7.18/src/ua-parser.min.js';
      roboto_url = "https://fonts.googleapis.com/css?family=Roboto";
      fontawesome_url = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    }
    if (document.createStyleSheet){
      document.createStyleSheet(`${base_url}/css/styles.css?s=${uuid}`);
      document.createStyleSheet(`${base_url}/${roboto_url}`);
      document.createStyleSheet(`${base_url}/${fontawesome_url}`);
    } else {
      document.head.innerHTML += `<link rel='stylesheet' href='${base_url}css/styles.css?s=${uuid}' type='text/css' media='screen' />
                                  <link href='${roboto_url}' rel='stylesheet'>
                                  <link rel='stylesheet' href='${fontawesome_url}?s=${uuid}' >`;
    }
    container.innerHTML = `
        <div class="toc-liveness-camera" id="toc-liveness-camera">
          <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>`;

    var locale;

    let a = lib.loadScripts([[`${ua_parser_url}?s=${uuid}`, typeof UAParser == 'undefined']]);
    let b = [lib.getJSON(base_url+"locale/"+options.locale+".json?s="+uuid)];
    a.forEach(elem => {b.push(elem)});
    Promise.all(b).then(values => {
      let json = values[0];
      options.locale = json;
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
      Promise.all(lib.loadScripts([[`${base_url}js/liveness-main.js?s=${uuid}`, typeof livenessMainInitFunction == 'undefined']])).then(() => {
        livenessMainInitFunction(container, options, lib);
      });
    });
  }
  liveness.version = '1.3';
  return liveness;
})();
if(window.jQuery){
  (function($){
    $.fn.liveness = function(options, callback){
      TOCliveness(this.attr('id'), options, callback);
    }
  }(jQuery));
}