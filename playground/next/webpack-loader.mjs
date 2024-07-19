// import { urlToRequest } from "loader-utils";
// import { validate } from "schema-utils";

const schema = {
  type: "object",
  properties: {
    test: {
      type: "string",
    },
  },
};

export default function (source) {
  const options = this.getOptions();

  // validate(schema, options, {
  //   name: "Example Loader",
  //   baseDataPath: "options",
  // });

  console.log("The resourcePath", this.resourcePath, source);

  // Apply some transformations to the source...

  return source;
  // return `export default ${JSON.stringify(source)}`;
}
