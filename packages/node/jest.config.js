module.exports = {
  displayName: "node",
  preset: "../../jest.preset.js",
  transform: {
    "^.+\\.[tj]s?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  // setupFiles: ["<rootDir>/env.test.ts"],
};
