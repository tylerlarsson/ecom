module.exports = {
  rootDir: '',
  verbose: true,
  watch: false,
  testEnvironment: 'node',

  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0
    }
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: ['server/**/*.js', '!server/web-server.dev.js', '!server/db-script/*.js', '!server/db/test.js'],
  coverageDirectory: 'coverage-it',
  testRegex: 'server-test/.*\\.test\\.js$'
};
