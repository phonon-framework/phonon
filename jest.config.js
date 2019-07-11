module.exports = {
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  moduleDirectories: ['node_modules', 'src'],
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  coverageDirectory: "./coverage/",
  collectCoverage: true
};
