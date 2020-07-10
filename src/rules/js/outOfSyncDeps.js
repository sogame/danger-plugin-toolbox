//
// Make sure dependencies and devDependencies in package.json and package-lock.json are in sync.
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';

const sortDependencies = (a, b) => a[0].localeCompare(b[0]);

const cleanVersion = version => version.replace(/^(\^|~|>=|>|<=|<)/, '');

export default async ({ path = '', logType } = {}) => {
  const packageFilename = `${path}package.json`;
  const packagelockFilename = `${path}package-lock.json`;

  const { dependencies, devDependencies } = JSON.parse(
    fs.readFileSync(packageFilename),
  );
  const { dependencies: dependenciesLockfile } = JSON.parse(
    fs.readFileSync(packagelockFilename),
  );
  const rows = [];
  // Babel fails to build if spreading the objects
  // eslint-disable-next-line prefer-object-spread
  const allDeps = Object.assign({}, dependencies, devDependencies);
  Object.entries(allDeps)
    .sort(sortDependencies)
    .forEach(([name, semver]) => {
      const version = cleanVersion(semver);
      const { version: versionLock = '' } = dependenciesLockfile[name] || {};
      if (version !== versionLock) {
        rows.push(
          `<tr><td>${name}</td><td>${version}</td><td>${versionLock}</td></tr>`,
        );
      }
    });

  if (rows.length > 0) {
    const table = `<table><thead><tr><th>Dependency</th><th>${packageFilename}</th><th>${packagelockFilename}</th></tr></thead><tbody>${rows.join(
      '',
    )}</tbody></table>`;

    const log = getMessageLogger(logType);
    log(`These dependencies are out of sync:\n${table}`);
  }
};
