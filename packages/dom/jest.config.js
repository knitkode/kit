module.exports = {
  displayName: "dom",
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
  testEnvironment: "jsdom",
  // setupFiles: ["<rootDir>/env.test.ts"],
};
