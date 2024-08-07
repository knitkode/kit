 
export {};

// TODO: automaticlaly generate something like this for webpack plugin
declare global {
  // type I18n = import("./i18n/types").I18n;

  var i18n: {
    t: import("./i18n/types").I18n.TranslateDefault;
  }
}