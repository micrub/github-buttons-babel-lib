export Renderer from "./Renderer";

class Base {

  constructor() {
    if (typeof window === "undefined") {
      throw new Error("Build to run only in browser environment.");
    } else {
      console.info("Base");
      this.init();
    }
  }
  init() {
    let self = this;
    if (typeof define === "function" && define.amd) {
      define([], { render: Renderer.render, Renderer: Renderer });
    } else {
      if (!{}.hasOwnProperty.call(document, "currentScript") && document.currentScript && delete document.currentScript && document.currentScript) {
        Renderer.BASEURL = document.currentScript.src.replace(
          /[^\/]*([?#].*)?$/,
          ""
        );
      }
      if (document.title === Base.UUID) {
        Renderer.renderFrameContent(document.location.hash);
      } else {
        Render.defer(Renderer.renderAll);
      }
    }
  }
}

export default Base;

