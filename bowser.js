/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */

!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
  else if (typeof define == 'function') define(definition)
  else this[name] = definition()
}('bowser', function () {
  /**
    * See useragents.js for examples of navigator.userAgent
    */

  var t = true,
      v /* temporary placeholder for versions. */

  function getVersion(ua, regex, matchedIdx) {
    var match = ua.match(regex);
    return (match && match.length > matchedIdx && match[matchedIdx]) || 0;
  }

  function detect(ua) {

    var ie = /(msie|trident)/i.test(ua)
      , chrome = /chrome|crios|crmo/i.test(ua)
      , phantom = /phantom/i.test(ua)
      , iphone = /iphone/i.test(ua)
      , ipad = /ipad/i.test(ua)
      , ipod = /ipod/i.test(ua)
      , silk = /silk/i.test(ua)
      , safari = /safari/i.test(ua) && !chrome && !phantom && !silk
      , android = /android/i.test(ua)
      , opera = /opera/i.test(ua) || /opr/i.test(ua)
      , firefox = /(firefox|iceweasel)/i.test(ua)
      , gecko = /gecko\//i.test(ua)
      , seamonkey = /seamonkey\//i.test(ua)
      , webos = /(?:web|hpw)os/i.test(ua)
      , touchpad = /touchpad\//i.test(ua)
      , windowsphone = /windows phone/i.test(ua)
      , blackberry = /(blackberry|\bbb\d+)/i.test(ua)
      , rimtablet = /rim\stablet/i.test(ua)
      , bada = /bada/i.test(ua)
      , tizen = /tizen/i.test(ua)
      , webkitVersion = /version\/(\d+(\.\d+)?)/i
      , firefoxVersion = /(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i
      , mobile = /mobi/i.test(ua)
      , tablet = /tablet/i.test(ua)
      , o = {}

    if (ipod) iphone = false

    if (windowsphone) o = {
        name: 'Windows Phone'
      , windowsphone: t
      , msie: t
      , version: getVersion(ua, /iemobile\/(\d+(\.\d+)?)/i, 1)
      }
    else if (opera) {
      v = getVersion(ua, webkitVersion, 1) ||
          getVersion(ua, /opr\/(\d+(\.\d+)?)/i, 1) ||
          getVersion(ua, /opera[ \/](\d+(\.\d+)?)/i, 1);
      o = {
        name: 'Opera'
      , opera: t
      , version: v
      }
      if (android) {
        o.android = t
      }
      if (chrome) {
        o.webkit = t
      }
    }
    else if (ie) o = {
        name: 'Internet Explorer'
      , msie: t
      , version: getVersion(ua, /(msie |rv:)(\d+(\.\d+)?)/i, 2)
      }
    else if (chrome) {
      o = {
        name: 'Chrome'
      , webkit: t
      , chrome: t
      , version: getVersion(ua, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i, 1)
      }
      if (android) o.android = t
      if (ipad || ipod || iphone) {
        o[iphone ? 'iphone' : ipad ? 'ipad' : 'ipod'] = t
        o.ios = t
      }
    }
    else if (phantom) o = {
        name: 'PhantomJS'
      , webkit: t
      , phantom: t
      , version: getVersion(ua, /phantomjs\/(\d+(\.\d+)?)/i, 1)
      }
    else if (silk) o =  {
        name: 'Amazon Silk'
      , silk: t
      , webkit: t
      , android: t
      , version : getVersion(ua, /silk\/(\d+(\.\d+)?)/i, 1)
      }
    else if (iphone || ipad || ipod) {
      o = {
        name : iphone ? 'iPhone' : ipad ? 'iPad' : 'iPod'
      , webkit: t
      , ios: t
      }
      o[iphone ? 'iphone' : ipad ? 'ipad' : 'ipod'] = t
      // WTF: version is not part of user agent in web apps
      if (webkitVersion.test(ua)) {
        o.version = getVersion(ua, webkitVersion, 1)
      }
    }
    else if (blackberry || rimtablet) {
      o = {
        name: 'BlackBerry'
      , blackberry: t
      }
      if ((v = getVersion(ua, webkitVersion, 1))) {
        o.version = v
        o.webkit = t
      } else {
        o.version = getVersion(ua, /blackberry[\d]+\/(\d+(\.\d+)?)/i, 1)
      }
    } 
    else if (webos) {
      o = {
        name: 'WebOS'
      , webkit: t
      , webos: t
      , version: (getVersion(ua, webkitVersion, 1) || getVersion(ua, /w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i, 1))
      };
      touchpad && (o.touchpad = t)
    }
    else if (bada) {
      o = {
        name: 'Bada'
      , webkit: t
      , bada: t
      , version: getVersion(ua, /dolfin\/(\d+(\.\d+)?)/i, 1)
      };
    }
    else if (tizen) {
      o = {
        name: 'Tizen'
      , webkit: t
      , tizen: t
      , version: getVersion(ua, /(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i, 1) || getVersion(ua, webkitVersion, 1)
      };
    }
    else if (gecko) {
      o = {
        name: 'Gecko'
      , gecko: t
      , mozilla: t
      , version: getVersion(ua, firefoxVersion, 1)
      }
      if (seamonkey) {
        o.name = 'SeaMonkey'
        o.seamonkey = t
        o.version = getVersion(ua, /seamonkey\/(\d+(\.\d+)?)/i, 1)
      } else if (firefox) {
        o.name = 'Firefox'
        o.firefox = t
      }
      if (android) {
        o.android = t
      } else if (!android && firefox && /\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
        o.firefoxos = t
      }
    }
    else if (android) o = {
        name: 'Android'
      , webkit: t
      , android: t
      , version: getVersion(ua, webkitVersion, 1)
      }
    else if (safari) o = {
        name: 'Safari'
      , webkit: t
      , safari: t
      , version: getVersion(ua, webkitVersion, 1)
      }


    // OS version extraction
    var osVersion;
    if (tizen) {
      osVersion = getVersion(ua, /tizen[\/\s](\d+(\.\d+)*)/i, 1);
    } else if (windowsphone) {
      osVersion = getVersion(ua, /windows phone (?:os)?\s?(\d+(\.\d+)*)/i, 1);
    } else if (webos) {
      osVersion = getVersion(ua, /(?:web|hpw)os\/(\d+(\.\d+)*)/i, 1);
    } else if (rimtablet) {
      osVersion = getVersion(ua, /rim\stablet\sos\s(\d+(\.\d+)*)/i, 1);
    } else if (bada) {
      osVersion = getVersion(ua, /bada\/(\d+(\.\d+)*)/i, 1);
    } else if (iphone || ipad || ipod) {
      osVersion = getVersion(ua, /os (\d+([_\s]\d+)*) like mac os x/i, 1);
      osVersion = (osVersion || "").replace(/[_\s]/g, '.');
    } else if (android) {
      osVersion = getVersion(ua, /android[ \/-](\d+(\.\d+)*)/i, 1);
    }
    if (osVersion) {
      o.osversion = osVersion;
    }

    // device type extraction
    var osMajorVersion = (osVersion || '').split('.')[0];
    if (tablet || ipad || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || rimtablet || silk || touchpad) {
      o.tablet = t
    } else if (iphone || ipod || (android && mobile) || windowsphone || blackberry || webos || bada || tizen || mobile) {
      o.mobile = t
    }

    // Graded Browser Support
    // http://developer.yahoo.com/yui/articles/gbs
    if ((o.msie && o.version >= 9) ||
        (o.chrome && o.version >= 20) ||
        (o.firefox && o.version >= 10.0) ||
        (o.safari && o.version >= 5) ||
        (o.opera && o.version >= 10.0) ||
        (o.ios && o.osversion && o.osversion.split(".")[0] >= 6)
        ) {
      o.a = t;
    }

    else if ((o.msie && o.version < 9) ||
        (o.chrome && o.version < 20) ||
        (o.firefox && o.version < 10.0) ||
        (o.safari && o.version < 5) ||
        (o.opera && o.version < 10.0) ||
        (o.ios && o.osversion && o.osversion.split(".")[0] < 6)
        ) {
      o.c = t
    } else o.x = t

    return o
  }

  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')


  /*
   * Set our detect method to the main bowser object so we can
   * reuse it to test other user agents.
   * This is needed to implement future tests.
   */
  bowser._detect = detect;

  return bowser
});
