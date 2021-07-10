// © nedkelly
// https://github.com/yarnpkg/berry/issues/1177#issuecomment-869269413
module.exports = {
  name: `plugin-requirements-check`,
  factory: require => {
    const semver = require('semver');
    const { readFileSync } = require('fs');
    const data = readFileSync('package.json');
    const { engines } = JSON.parse(data.toString());
    const { node } = engines;
    return {
      default: {
        hooks: {
          validateProject() {
            if (!semver.satisfies(process.version, node)) {
              throw new Error(
                `The current node version ${process.version} does not satisfy the required version ${node}.`,
              );
            }
          },
        },
      },
    };
  },
};
