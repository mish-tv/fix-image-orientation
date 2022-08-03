// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  preset: "jest-puppeteer",
  resetMocks: true,
  restoreMocks: true,
  testMatch: ["**/src/**/?(*.)+(spec|test).[tj]s?(x)"],
  transform: { "^.+\\.(t|j)sx?$": "@swc/jest" },
};
