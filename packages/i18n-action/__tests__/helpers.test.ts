import { join } from "node:path";
import { generate } from "../helpers";

test("test runs", async () => {
  await generate({
    root: join(process.cwd(), "__tests__/mocks"),
    defaultLocale: "en",
    outputData: "index",
    outputTypes: "types.d.ts",
  });
});
