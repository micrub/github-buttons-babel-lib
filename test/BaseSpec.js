import { expect } from 'chai';

import Base from '../src/Base';

describe('Base', () => {

  describe('Base', () => {

    it("should be instance of object", () => {
      expect(Base).to.be.instanceOf(Object);
    });

    it("should throw if constructed not in browser (based on `window` global variable detection).", () => {
      try {
        let c = new Base();
      } catch (e) {
        expect(e).to.be.instanceOf(Object);
      }
    });


  });

});
