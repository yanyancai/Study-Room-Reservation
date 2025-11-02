/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json"
      }
    ]
  },
  moduleNameMapper: {
  "^@/(.*)$": "<rootDir>/$1",
  "^next/image$": "<rootDir>/__mocks__/nextImageMock.js",
  "^next/navigation$": "<rootDir>/__mocks__/nextNavigationMock.js"
},
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: ["/node_modules/"]
};
