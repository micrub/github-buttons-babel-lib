/* global define */
/* eslint no-undef: "error" */

import Renderer from './Renderer';
import GitHubButton from './React/Component/GitHubButton';

class Base {
  initiated = false;
  constructor() {
    if (typeof window === 'undefined') {
      throw new Error('Build to run only in browser environment.');
    } else {
      this.init();
    }
  }
  init() {
    if (typeof define === 'function' && define.amd) {
      /**
       * Export render and GitHubButton React componenet in case of AMD
       */
      define([], { render: Renderer.render, GitHubButton });
    } else {
      if (
        !{}.hasOwnProperty.call(document, 'currentScript') &&
          document.currentScript &&
          delete document.currentScript &&
          document.currentScript
      ) {
        Renderer.BASEURL = document.currentScript.src.replace(
          /[^/]*([?#].*)?$/,
          '',
        );
      }
      if (document.title === Renderer.UUID) {
        Renderer.renderFrameContent(document.location.hash);
      } else {
        Renderer.defer(Renderer.renderAll);
      }
      this.initiated = true;
    }
  }
}

export default Base;

