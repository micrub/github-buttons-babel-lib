class Base {
  constructor() {
    if (typeof window === "undefined") {
      throw new Error("Build to run only in browser environment.")
    } else {
      console.info('Base');
    }
  }
}

export default Base;

