import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

export default {
  input: "src/index.ts",
  external: Object.keys(pkg.peerDependencies || {}),
  output: [
    { file: pkg.main, format: "cjs" },
    { file: pkg.module, format: "esm" }
  ],
  plugins: [typescript()]
};
