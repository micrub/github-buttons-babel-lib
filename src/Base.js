class Base {
  constructor() {
    if (typeof window === "undefined") {
      throw new Error("Build to run only in browser environment.")
    }
  }
}

export default Base;

