//
// If dependencies change (changes in "package.json"), "package-lock.json" also must be updated.
//

import getMessageLogger from '../getMessageLogger';
import { inCommit } from '../helpers';

export default ({ path = '', logTypePackage, logTypePackageLock } = {}) => {
  const packageFilename = `${path}package.json`;
  const packagelockFilename = `${path}package-lock.json`;
  const changedPackage = inCommit(packageFilename);
  const changedPackagelock = inCommit(packagelockFilename);

  if (changedPackage && !changedPackagelock) {
    const logPackage = getMessageLogger(logTypePackage);
    logPackage(
      `Dependencies (\`${packageFilename}\`) may have changed, but lockfile (\`${packagelockFilename}\`) has not been updated.`,
    );
  }

  if (changedPackagelock && !changedPackage) {
    const logPackageLock = getMessageLogger(logTypePackageLock);
    logPackageLock(
      `Lockfile (\`${packagelockFilename}\`) has been updated, but no dependencies (\`${packageFilename}\`) have changed.`,
    );
  }
};
