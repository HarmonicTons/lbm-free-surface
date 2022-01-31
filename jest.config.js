module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["src"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.test.json"
    }
  },
  collectCoverageFrom: ["src/**/*.ts", "src/**/*.tsx"],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "identity-obj-proxy"
  }
};
