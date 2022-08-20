/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/**/*.d.ts",
        "!src/**/*.spec.ts",
        "!src/**/*.test.ts",
    ],
    coverageReporters: ["text", "lcov"],
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/coverage/",
        "/jest.config.js",
        "/jest.setup.js",
        "/jest.teardown.js",
    ],
    coverageThreshold: {
        global: {
            lines: 90,
        },
    },
};
