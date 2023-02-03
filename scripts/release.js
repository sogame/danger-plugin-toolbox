/* eslint-disable no-console -- Needed when running the release script */

import fs from 'node:fs';

import inquirer from 'inquirer';
import release from 'release-it'; // eslint-disable-line import/no-unresolved -- No idea why this is needed ¯\_(ツ)_/¯

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const incVersion = (curVersion, type) => {
  const versionArr = curVersion.split('.').map((n) => parseInt(n, 10));
  switch (type) {
    case 'patch':
      versionArr[2] += 1;
      break;
    case 'minor':
      versionArr[1] += 1;
      versionArr[2] = 0;
      break;
    case 'major':
      versionArr[0] += 1;
      versionArr[1] = 0;
      versionArr[2] = 0;
      break;
    default:
      throw new Error('Invalid version increase');
  }
  return versionArr.join('.');
};

const questions = [
  {
    type: 'list',
    name: 'version',
    message: 'What version do you want to release?',
    choices: ['patch', 'minor', 'major', 'pre-release'].map((choice) => ({
      name: choice,
      value: choice,
    })),
  },
];

async function doRelease() {
  const pkg = readJson('./package.json');

  try {
    const { version } = await inquirer.prompt(questions);
    const isPreRelease = version === 'pre-release';
    const preReleaseTag = isPreRelease ? 'beta' : null;
    const versionNumber = isPreRelease
      ? preReleaseTag
      : incVersion(pkg.version, version);

    let buildCommand = 'npm run build';
    if (!isPreRelease) {
      buildCommand = `${buildCommand} && npm run update:changelog ${versionNumber}`;
    }

    const releaseOptions = {
      increment: isPreRelease ? 'prerelease' : versionNumber,
      preReleaseId: preReleaseTag,
      ci: false,
      hooks: {
        'after:bump': buildCommand,
      },
      git: {
        requireCleanWorkingDir: true,
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

    const output = await release(releaseOptions);
    console.log('\n', output);
  } catch (exc) {
    console.error(exc);
    process.exit(1);
  }
}

doRelease();
