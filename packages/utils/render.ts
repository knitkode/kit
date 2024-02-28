type DefinitionExtended = {
  __exp?: { [key: string]: number | boolean | string }; // RenderData;
  arg: string;
  text: string;
};

type Definitions = { [key: string]: DefinitionExtended } & DefinitionExtended;

/**
 * Returned render function
 */
type RenderFunction = (data: object) => string;

/**
 * Default render function creator
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RenderTemplate = (template: string) => RenderFunction;

let varname = "data";
let evaluate = /<%([\s\S]+?(\}?)+)%>/g;
let interpolate = /<%=([\s\S]+?)%>/g;
let conditional = /<%\?(\?)?\s*([\s\S]*?)\s*%>/g;
let iterate =
  /<%~\s*(?:%>|([\s\S]+?)\s*:\s*([\w$]+)\s*(?::\s*([\w$]+))?\s*%>)/g;
// let encode = /<%!([\s\S]+?)%>/g;
let use = /<%#([\s\S]+?)%>/g;
let useParams =
  /(^|[^\w$])def(?:\.|\[['"])([\w$.]+)(?:['"]\])?\s*:\s*([\w$.]+|"[^"]+"|'[^']+'|\{[^}]+\})/g;
let define = /<%##\s*([\w.$]+)\s*(:|=)([\s\S]+?)#%>/g;
let defineParams = /^\s*([\w$]+):([\s\S]+)/;

let start = "'+(";
let end = ")+'";
// let startencode = "'+encodeHTML(";

let skip = /$^/;

let resolveDefs = (block: string | object, def: Definitions): string =>
  (typeof block === "string" ? block : block.toString())
    .replace(
      define || skip,
      (_, code: string, assign: string, value: string | DefinitionExtended) => {
        if (code.indexOf("def.") === 0) {
          code = code.substring(4);
        }
        if (!(code in def)) {
          if (assign === ":") {
            (value as string).replace(
              defineParams,
              // @ts-expect-error nevermind
              (_, param: string, v: string) => {
                def[code] = { arg: param, text: v };
              },
            );
            // @ts-expect-error nevermind
            if (!(code in def)) def[code] = value;
          } else {
            new Function("def", "def['" + code + "']=" + value)(def);
          }
        }
        return "";
      },
    )
    .replace(use || skip, (_, code: string) => {
      code = code.replace(
        useParams,
        (_, s: string, d: string, param: string) => {
          if (def[d] && def[d].arg && param) {
            let rw = (d + ":" + param).replace(/'|\\/g, "_");
            def.__exp = def.__exp || {};
            def.__exp[rw] = def[d].text.replace(
              new RegExp("(^|[^\\w$])" + def[d].arg + "([^\\w$])", "g"),
              "$1" + param + "$2",
            );
            return s + "def.__exp['" + rw + "']";
          }
          return s;
        },
      );
      let v = new Function("def", "return " + code)(def) as string;
      return v ? resolveDefs(v, def) : v;
    });

let unescape = (code: string) =>
  code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");

/**
 * Render template (adapted from doT.js)
 *
 * The data made available to the template is always on the `data` key, e.g.:
 * `renderer({ myVal: "xx" })`
 * ... will be accessible on
 * `<%= data.myVal %>`
 *
 * The default delimiters are customised to work without conflicts with Blade and Twig:
 * ```
 * <% %>	for evaluation
 * <%= %>	for interpolation
 * <%? %>	for conditionals
 * <%~ %>	for array iteration
 * <%# %>	for compile-time evaluation/includes and partials
 * <%## #%>	for compile-time defines
 *
 * Unsupported:
 * <%! %>	for interpolation with encoding
 * ```
 *
 * @category impl
 * @example
 *
 * ```ts
 * import { render } from "...";
 *
 * const data = { name: "XYZ" };
 * const tpl = `Hello <%= data.name %>`;
 * const renderer = render(tpl);
 *
 * console.log(renderer(data)); // outputs 'Hello XYZ'
 * ```
 *
 * @borrows [olado/doT by Laura Doktorova](https://github.com/olado/doT)
 * @see https://olado.github.io/doT/index.html
 */
export let render = (tmpl: string, def?: Definitions): RenderFunction => {
  let sid = 0;
  let indv;
  let str =
    use || define ? resolveDefs(tmpl, def || ({} as Definitions)) : tmpl;

  str = (
    "var X='" +
    str
      .replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ")
      .replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "")
      .replace(/'|\\/g, "\\$&")
      .replace(interpolate || skip, (_, code) => start + unescape(code) + end)
      // .replace(
      //   encode || skip,
      //   (_, code) => cse.startencode + unescape(code) + cse.end
      // )
      .replace(conditional || skip, (_, elseCase, code) =>
        elseCase
          ? code
            ? "';}else if(" + unescape(code) + "){X+='"
            : "';}else{X+='"
          : code
            ? "';if(" + unescape(code) + "){X+='"
            : "';}X+='",
      )
      .replace(iterate || skip, (_, arr, vName, iName) => {
        if (!arr) return "';} } X+='";
        sid++;
        indv = iName || "i" + sid;
        arr = unescape(arr);
        return (
          "';var arr" +
          sid +
          "=" +
          arr +
          ";if(arr" +
          sid +
          "){var " +
          vName +
          "," +
          indv +
          "=-1,l" +
          sid +
          "=arr" +
          sid +
          ".length-1;while(" +
          indv +
          "<l" +
          sid +
          "){" +
          vName +
          "=arr" +
          sid +
          "[" +
          indv +
          "+=1];X+='"
        );
      })
      .replace(evaluate || skip, (_, code) => "';" + unescape(code) + "X+='") +
    "';return X;"
  )
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r")
    .replace(/(\s|;|\}|^|\{)X\+='';/g, "$1")
    .replace(/\+''/g, "");
  //.replace(/(\s|;|\}|^|\{)X\+=''\+/g,'$1X+=');

  try {
    return new Function(varname, str) as RenderFunction;
  } catch (e) {
    if (process.env["NODE_ENV"] === "development") {
      console.log("Could not create a template function: " + str);
      throw e;
    }
  }
  return () => "";
};

export default render;
