// @see https://github.com/nrwl/nx/issues/10825#issuecomment-1205775526
const nxPreset = require("@nx/jest/preset");
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.base.json");

module.exports = {
  ...nxPreset,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: process.cwd(),
  }),
};
