import executor from "./executor";
import { RollupExecutorSchema } from "./schema";

const options: RollupExecutorSchema = {};

describe("Rollup Executor", () => {
  it("can run", async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
