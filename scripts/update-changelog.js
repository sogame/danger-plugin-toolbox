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

const updatePluginVersionCI = version => {
  const ciScriptPath = './.travis.yml';
  const ciScriptData = fs.readFileSync(ciScriptPath, 'utf8');

  const regexp = /(danger-plugin-toolbox@)\d+\.\d+\.\d+/;
  const updatedCiScriptData = ciScriptData.replace(regexp, `$1${version}`);

  fs.writeFileSync(ciScriptPath, updatedCiScriptData, 'utf8');
};

const [, , version] = process.argv;
if (!version) {
  console.error('usage: update-changelog.js <version>\n\n');
} else {
  updateChangelog(version);
  updatePluginVersionCI(version);
}
