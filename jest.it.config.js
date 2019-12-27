module.exports = {
  rootDir: '',
  verbose: true,
  watch: false,
  testEnvironment: 'node',

  coverageThreshold: {
    global: {
      statements: 90,
      branches: 80,
      functions: 50,
      lines: 90
    }
  },
  testTimeout: 30000,
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/web-server.dev.js',
    '!server/scripts/*.js',
    '!server/db/test.js',
    '!server/middlewares/*.js',
    '!server/config.js'
  ],
  coverageDirectory: 'coverage-it',
  // testRegex: 'server-test/.*\\.test\\.js$',
  testRegex: 'server-test/api/enrollment.test\\.js$'
};
