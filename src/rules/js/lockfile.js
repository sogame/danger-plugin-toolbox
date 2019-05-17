//
// If dependencies change (changes in "package.json"), "package-lock.json" also must be updated.
//

import fs from 'fs';

import { matchLineNumber } from '../../utils';
import getMessageLogger from '../getMessageLogger';
import { inCommit, fileAddedLineNumbers } from '../helpers';

const lineRange = (content, pattern) => {
  const startLine = matchLineNumber(content, pattern);
  const endLine = matchLineNumber(content, /\}/, startLine);
  return [startLine, endLine];
};

export default async ({
  path = '',
  logTypePackage,
  logTypePackageLock,
  logType,
} = {}) => {
  const packageFilename = `${path}package.json`;
  const packagelockFilename = `${path}package-lock.json`;
  const changedPackage = inCommit(packageFilename);
  const changedPackagelock = inCommit(packagelockFilename);

  if (changedPackage && !changedPackagelock) {
    const packageContent = fs.readFileSync(packageFilename).toString();
    const [startDependencies, endDependencies] = lineRange(
      packageContent,
      /"dependencies": {/,
    );
    const [startDevDependencies, endDevDependencies] = lineRange(
      packageContent,
      /"devDependencies": {/,
    );

    const addedLineNumbers = await fileAddedLineNumbers(packageFilename);
    const changedDependencies = addedLineNumbers.reduce(
      (alreadyChanged, ln) =>
        (ln > startDependencies && ln < endDependencies) || alreadyChanged,
      false,
    );
    const changedDevDependencies = addedLineNumbers.reduce(
      (alreadyChanged, ln) =>
        (ln > startDevDependencies && ln < endDevDependencies) ||
        alreadyChanged,
      false,
    );

    if (changedDependencies || changedDevDependencies) {
      const logPackage = getMessageLogger(logTypePackage || logType);
      logPackage(
        `Dependencies (\`${packageFilename}\`) may have changed, but lockfile (\`${packagelockFilename}\`) has not been updated.`,
      );
    }
  }

  if (changedPackagelock && !changedPackage) {
    const logPackageLock = getMessageLogger(logTypePackageLock || logType);
    logPackageLock(
      `Lockfile (\`${packagelockFilename}\`) has been updated, but no dependencies (\`${packageFilename}\`) have changed.`,
    );
  }
};
