import { defineKitConfig } from "../../tools/tsdown.ts";

export default defineKitConfig({
  // `env` and `without` are empty placeholders, `fixtures*` only serve tests
  exclude: ["env", "without", "fixtures", "fixtures.nested"],
});
