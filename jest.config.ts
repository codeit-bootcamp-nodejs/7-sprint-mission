import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  roots: ["<rootDir>/tests"],

  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
  "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  moduleFileExtensions: ["ts", "js", "json"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
  ],

  coverageDirectory: "coverage",

  testTimeout: 20000,
};

export default config;