const CEIL = Math.ceil;
const ROUND = Math.round;
const MAX = Math.max;

let WIN = window;
let DOC = window.document;

class Renderer {

  static BUTTON_CLASS = "github-button";
  static ICON_CLASS = "octicon";
  static ICON_CLASS_DEFAULT = Renderer.ICON_CLASS + "-mark-github";
  static GITHUB_API_BASEURL = "https://api.github.com";
  static DOMAIN = "buttons.github.io";
  static BASEURL = Renderer.getProto() + "://" + Renderer.DOMAIN + "/";
  static COUNT_MATCH = /^\/([^\/?#]+)(?:\/([^\/?#]+)(?:\/(?:(subscription)|(fork)|(issues)|([^\/?#]+)))?)?(?:[\/?#]|$)/;
  static PATH_MATCH = /^https?:\/\/((gist\.)?github\.com\/[^\/?#]+\/[^\/?#]+\/archive\/|github\.com\/[^\/?#]+\/[^\/?#]+\/releases\/download\/|codeload\.github\.com\/)/;

  static decodeURIComponent = window.decodeURIComponent;
  static encodeURIComponent = window.encodeURIComponent;
  constructor() {}

  static render(targetNode, config) {
    var contentDocument, hash, iframe, name, onload, ref1, value;
    if (targetNode == null) {
      return Renderer.renderAll();
    }
    if (config == null) {
      config = Renderer.parseConfig(targetNode);
    }
    hash = "#" + Renderer.stringifyQueryString(config);
    iframe = Renderer.createElement("iframe");
    ref1 = {
      allowtransparency: true,
      scrolling: "no",
      frameBorder: 0
    };
    for (name in ref1) {
      value = ref1[name];
      iframe.setAttribute(name, value);
    }
    Renderer.setFrameSize(iframe, [1, 0]);
    iframe.style.border = "none";
    iframe.src = "javascript:0";
    DOC.body.appendChild(iframe);
    console.log(DOC.body);
    onload = function() {
      var size;
      size = Renderer.getFrameContentSize(iframe);
      iframe.parentNode.removeChild(iframe);
      Renderer.onceEvent(iframe, "load", function() {
        Renderer.setFrameSize(iframe, size);
      });
      iframe.src = Renderer.BASEURL + "buttons.html" + hash;
      targetNode.parentNode.replaceChild(iframe, targetNode);
    };
    Renderer.onceEvent(iframe, "load", function() {
      var callback;
      if (callback = iframe.contentWindow._) {
        Renderer.onceScriptLoad(callback.$, onload);
      } else {
        onload();
      }
    });
    contentDocument = iframe.contentWindow.document;
    console.log(iframe.contentWindow.document);
    contentDocument.open().write("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>" + Renderer.UUID + "</title><link rel=\"stylesheet\" href=\"" + Renderer.BASEURL + "buttons.css\"><script>document.location.hash = \"" + hash + "\";</script></head><body><script src=\"" + Renderer.BASEURL + "index.out.js\"></script></body></html>");
    contentDocument.close();
  }

  static ceilPixel(px) {
    var devicePixelRatio;
    devicePixelRatio = WIN.devicePixelRatio || 1;
    return (devicePixelRatio > 1 ? CEIL(ROUND(px * devicePixelRatio) / devicePixelRatio * 2) / 2 : CEIL(px)) || 0;
  }

  static getFrameContentSize(iframe) {
    var body, bClientRect, contentDocument, height, html, width;
    contentDocument = iframe.contentWindow.document;
    html = contentDocument.documentElement;
    body = contentDocument.body;
    width = html.scrollWidth;
    height = html.scrollHeight;
    if (body.getBoundingClientRect) {
      body.style.display = "inline-block";
      bClientRect = body.getBoundingClientRect();
      width = MAX(width, Renderer.ceilPixel(bClientRect.width || bClientRect.right - bClientRect.left));
      height = MAX(height, Renderer.ceilPixel(bClientRect.height || bClientRect.bottom - bClientRect.top));
      body.style.display = "";
    }
    return [width, height];
  }

  static setFrameSize(iframe, size) {
    iframe.style.width = size[0] + "px";
    iframe.style.height = size[1] + "px";
  };

  static parseConfig(anchor) {
    var attribute, config, deprecate, j, len, ref1;
    config = {
      "href": anchor.href,
      "aria-label": anchor.getAttribute("aria-label")
    };
    ref1 = ["icon", "text", "size", "show-count"];
    for (j = 0, len = ref1.length; j < len; j++) {
      attribute = ref1[j];
      attribute = "data-" + attribute;
      config[attribute] = anchor.getAttribute(attribute);
    }
    if (config["data-text"] == null) {
      config["data-text"] = anchor.textContent || anchor.innerText;
    }
    deprecate = function(oldAttribute, newAttribute, newValue) {
      if (anchor.getAttribute(oldAttribute)) {
        config[newAttribute] = newValue;
        window.console && window.console.warn("GitHub Buttons deprecated `" + oldAttribute + "`: use `" + newAttribute + "=\"" + newValue + "\"` instead. Please refer to https://github.com/ntkme/github-buttons#readme for more info.");
      }
    };
    deprecate("data-count-api", "data-show-count", "true");
    deprecate("data-style", "data-size", "large");
    return config;
  };
  static onceScriptLoad(script, func) {
    let callback, token;
    token = 0;
    callback = () => {
      if (!token && (token = 1)) {
        func();
      }
    };
    Renderer.onEvent(script, "load", callback);
    Renderer.onEvent(script, "error", callback);
    Renderer.onEvent(script, "readystatechange", function() {
      if (!/i/.test(script.readyState)) {
        callback();
      }
    });
  };
  static createElement(tag) {
    return DOC.createElement(tag);
  };

  static createTextNode(text) {
    return DOC.createTextNode(text);
  };
  static onEvent(target, eventName, func) {
    if (target.addEventListener) {
      target.addEventListener("" + eventName, func);
    } else {
      target.attachEvent("on" + eventName, func);
    }
  }
  static onceEvent(target, eventName, func) {
    let callback;
    callback = function(event) {
      if (target.removeEventListener) {
        target.removeEventListener("" + eventName, callback);
      } else {
        target.detachEvent("on" + eventName, callback);
      }
      return func(event || WIN.event);
    };
    Renderer.onEvent(target, eventName, callback);
  }

  static getProto() {
    return /^http:/.test(DOC.location) ? "http" : "https";
  }
  static stringifyQueryString(obj) {
    let name, params, value;
    params = [];
    for (name in obj) {
      value = obj[name];
      if (value != null) {
        params.push(
          Renderer.encodeURIComponent(name) + "=" +
            Renderer.encodeURIComponent(value)
        );
      }
    }
    return params.join("&");
  }
  static parseQueryString(str) {
    var j, len, pair, params, ref, ref1;
    params = {};
    ref1 = str.split("&");
    for (j = 0, len = ref1.length; j < len; j++) {
      pair = ref1[j];
      if (!(pair !== "")) {
        continue;
      }
      ref = pair.split("=");
      if (ref[0] !== "") {
        params[Renderer.decodeURIComponent(
          ref[0]
        )] = Renderer.decodeURIComponent(ref.slice(1).join("="));
      }
    }
    return params;
  }
  static jsonp(url, func) {
    let head, script;
    script = Renderer.createElement("script");
    script.async = true;
    script.src = url + (/\?/.test(url) ? "&" : "?") + "callback=_";
    WIN._ = function(json) {
      WIN._ = null;
      func(json);
    };
    WIN._.$ = script;
    Renderer,onEvent(script, "error", () => {
      WIN._ = null;
    });
    if (script.readyState) {
      Renderer.onEvent(script, "readystatechange", function() {
        if (script.readyState === "loaded" && script.children && script.readyState === "loading") {
          WIN._ = null;
        }
      });
    }
    head = document.getElementsByTagName("head")[0];
    if ("[object Opera]" === {}.toString.call(window.opera)) {
      Renderer.onEvent(DOC, "DOMContentLoaded", function() {
        head.appendChild(script);
      });
    } else {
      head.appendChild(script);
    }
  }
  static githubPathTest(a){
    return Renderer.PATH_MATCH.test(a.href);
  }
  static renderButton(config) {
    let a, ariaLabel, i, span;
    a = Renderer.createElement("a");
    a.href = config.href;
    if (!/\.github\.com$/.test("." + a.hostname)) {
      a.href = "#";
      a.target = "_self";
    } else if (Renderer.githubPathTest(a)) {
      a.target = "_top";
    }
    a.className = "btn";
    if (ariaLabel = config["aria-label"]) {
      a.setAttribute("aria-label", ariaLabel);
    }
    i = a.appendChild(Renderer.createElement("i"));
    i.className = Renderer.ICON_CLASS + " " + (config["data-icon"] || Renderer.ICON_CLASS_DEFAULT);
    i.setAttribute("aria-hidden", "true");
    a.appendChild(Renderer.createTextNode(" "));
    span = a.appendChild(Renderer.createElement("span"));
    span.appendChild(Renderer.createTextNode(config["data-text"] || ""));
    return DOC.body.appendChild(a);
  };
  static renderCount(button) {
    var api, href, match, property;
    if (button.hostname !== "github.com") {
      return;
    }
    match = button.pathname.replace(/^(?!\/)/, "/").match(Renderer.COUNT_MATCH);
    if (!(match && !match[6])) {
      return;
    }
    if (match[2]) {
      href = "/" + match[1] + "/" + match[2];
      api = "/repos" + href;
      if (match[3]) {
        property = "subscribers_count";
        href += "/watchers";
      } else if (match[4]) {
        property = "forks_count";
        href += "/network";
      } else if (match[5]) {
        property = "open_issues_count";
        href += "/issues";
      } else {
        property = "stargazers_count";
        href += "/stargazers";
      }
    } else {
      api = "/users/" + match[1];
      property = "followers";
      href = "/" + match[1] + "/" + property;
    }
    Renderer.jsonp(Renderer.GITHUB_API_BASEURL + api, function(json) {
      var a, data, span;
      if (json.meta.status === 200) {
        data = json.data[property];
        a = Renderer.createElement("a");
        a.href = "https://github.com" + href;
        a.className = "social-count";
        a.setAttribute("aria-label", data + " " + (property.replace(/_count$/, "").replace("_", " ")) + " on GitHub");
        a.appendChild(Renderer.createElement("b"));
        a.appendChild(Renderer.createElement("i"));
        span = a.appendChild(Renderer.createElement("span"));
        span.appendChild(Renderer.createTextNode(("" + data).replace(/\B(?=(\d{3})+(?!\d))/g, ",")));
        button.parentNode.insertBefore(a, button.nextSibling);
      }
    });
  };
  static renderFrameContent(hash) {
    let config = Renderer.parseQueryString(hash.replace(/^#/, ""));
    var button;
    if (!config) {
      return;
    }
    if (/^large$/i.test(config["data-size"])) {
      DOC.body.className = "large";
    }
    button = Renderer.renderButton(config);
    if (/^(true|1)$/i.test(config["data-show-count"])) {
      Renderer.renderCount(button);
    }
  }
  static renderAll() {
    var anchor, anchors, j, k, len, len1, ref1;
    anchors = [];
    if (DOC.querySelectorAll) {
      anchors = DOC.querySelectorAll("a." + Renderer.BUTTON_CLASS);
    } else {
      ref1 = DOC.getElementsByTagName("a");
      for (j = 0, len = ref1.length; j < len; j++) {
        anchor = ref1[j];
        if (~(" " + anchor.className + " ").replace(/[ \t\n\f\r]+/g, " ").indexOf(" " + Renderer.BUTTON_CLASS + " ")) {
          anchors.push(anchor);
        }
      }
    }
    for (k = 0, len1 = anchors.length; k < len1; k++) {
      anchor = anchors[k];
      Renderer.render(anchor);
    }
  };
  static defer(func) {
    var callback, token;
    if (
      /m/.test(DOC.readyState) ||
        !/g/.test(DOC.readyState) &&
          !DOC.documentElement.doScroll
    ) {
      WIN.setTimeout(func);
    } else {
      if (DOC.addEventListener) {
        token = 0;
        callback = function() {
          if (!token && (token = 1)) {
            func();
          }
        };
        Renderer.onceEvent(DOC, "DOMContentLoaded", callback);
        Renderer.onceEvent(WIN, "load", callback);
      } else {
        callback = function() {
          if (/m/.test(DOC.readyState)) {
            DOC.detachEvent("onreadystatechange", callback);
            func();
          }
        };
        DOC.attachEvent("onreadystatechange", callback);
      }
    }
  }

}

export default Renderer;

