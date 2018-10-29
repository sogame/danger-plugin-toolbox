/* eslint-disable no-console */

const fs = require('fs');

const updateChangelog = version => {
  const changelogPath = './CHANGELOG.md';
  const changelogData = fs.readFileSync(changelogPath, 'utf8');

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}`;

  const regexp = /(\n)(## \[Unreleased\])/;
  const updatedChangelogData = changelogData.replace(
    regexp,
    `$1$2\n\n__Nothing yet__\n\n## [${version}] - ${formattedDate}`,
  );

  fs.writeFileSync(changelogPath, updatedChangelogData, 'utf8');
};

const [, , version] = process.argv;
if (!version) {
  console.error('usage: update-changelog.js <version>\n\n');
} else {
  updateChangelog(version);
}
