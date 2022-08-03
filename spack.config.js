// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require("@swc/core/spack");

module.exports = config({
  entry: __dirname + "/src/test/browser.ts",
  output: { path: __dirname + "/lib/bundle" },
  options: {
    sourceMaps: true,
    jsc: {
      parser: {
        syntax: "typescript",
        decorators: true,
        privateMethod: true,
        dynamicImport: false,
      },
      target: "es2022",
    },
  },
});
