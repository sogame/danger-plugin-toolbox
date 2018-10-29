/* eslint-disable no-console */

const inquirer = require('inquirer'); // eslint-disable-line import/no-extraneous-dependencies
const semver = require('semver'); // eslint-disable-line import/no-extraneous-dependencies
const releaseit = require('release-it'); // eslint-disable-line import/no-extraneous-dependencies

const pkg = require('../package.json');

const questions = [
  {
    type: 'list',
    name: 'version',
    message: 'What version do you want to release?',
    choices: ['patch', 'minor', 'major', 'pre-release'].map(choice => ({
      name: choice,
      value: choice,
    })),
  },
];

async function release() {
  try {
    const { version } = await inquirer.prompt(questions);
    const isPreRelease = version === 'pre-release';
    const preReleaseTag = isPreRelease ? 'beta' : null;
    const versionNumber = isPreRelease
      ? preReleaseTag
      : semver.inc(pkg.version, version);

    let buildCommand = 'npm run build';
    if (!isPreRelease) {
      buildCommand = `${buildCommand} && npm run update:changelog ${versionNumber}`;
    }

    const releaseOptions = {
      increment: isPreRelease ? 'prerelease' : versionNumber,
      preReleaseId: preReleaseTag,
      'non-interactive': true,
      pkgFiles: ['package.json', 'package-lock.json'],
      requireCleanWorkingDir: true,
      buildCommand,
      src: {
        commit: true,
        tag: true,
        push: true,
      },
      npm: {
        publish: true,
        tag: isPreRelease ? preReleaseTag : 'latest',
      },
      github: {
        release: !isPreRelease,
        preRelease: isPreRelease,
      },
    };

    const output = await releaseit(releaseOptions);
    console.log('\n', output);
  } catch (exc) {
    console.error(exc);
    process.exit(1);
  }
}

release();
