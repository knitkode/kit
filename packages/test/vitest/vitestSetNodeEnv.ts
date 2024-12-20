/**
 * @see https://medium.com/weekly-webtips/how-to-mock-process-env-when-writing-unit-tests-with-vitest-80940f367c2c
 *
 * @param nodeEnv
 */
export function vitestSetNodeEnv(
  nodeEnv: (typeof process.env)["NODE_ENV"] = "development",
  mode: "each" | "all" = "each",
  otherEnvVariables: object = {},
) {
  const originalEnv = process.env;
  const fnBefore = () => {
    vitest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: nodeEnv,
      ...otherEnvVariables,
    };
  };
  const fnAfter = () => {
    process.env = originalEnv;
  };

  if (mode === "each") {
    beforeEach(fnBefore);
    afterEach(fnAfter);
  } else if (mode === "all") {
    beforeAll(fnBefore);
    afterAll(fnAfter);
  }
}

export default vitestSetNodeEnv;
