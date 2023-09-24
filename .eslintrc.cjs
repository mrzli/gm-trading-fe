const { getEsLintConfig } = require('@gmjs/eslint-config');

const config = getEsLintConfig({ projectType: 'react', storybook: true });

module.exports = {
  ...config,
};
