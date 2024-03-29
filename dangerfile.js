const {
  committedFilesGrep,
  commonChangelog,
  commonContributingGuide,
  commonFileContains,
  commonFileWarnings,
  commonPrDescriptionContribution,
  commonValidJson,
  inCommit,
  inCommitGrep,
  jsConsoleCommands,
  jsGlobalEslintChange,
  jsLocalEslintChange,
  jsLockfile,
  jsOutOfSyncDeps,
  jsTestShortcuts,
  linkToTargetRepo,
  prAuthor,
  prTitle,
} = require('prod-danger-plugin-toolbox'); // eslint-disable-line import/no-extraneous-dependencies -- This is only needed in CI

const prAuthorIsBot = [
  'snyk-bot',
  'dependabot-preview[bot]',
  'dependabot[bot]',
].includes(prAuthor);

commonPrDescriptionContribution();

commonContributingGuide();

// Do not require "CHANGELOG.md" to be updated when:
// - The PR is created by a bot (Snyk...)
// - The PR title is "Update dependencies" (just bumping devDependencies)
if (!(prAuthorIsBot || prTitle === 'Update dependencies')) {
  commonChangelog();
}

commonValidJson();

commonFileWarnings('lint.log');

commonFileWarnings('test.log');

jsConsoleCommands({ inline: true });

jsGlobalEslintChange();

jsLocalEslintChange({ inline: true });

jsLockfile();

jsOutOfSyncDeps({ logType: 'fail' });

jsTestShortcuts({ logTypeFocused: 'fail', inline: true });

const noUnreleasedSection = () =>
  'CHANGELOG.md is missing the "Unreleased" section.';
commonFileContains('CHANGELOG.md', /^## \[Unreleased\]$/m, {
  buildMessage: noUnreleasedSection,
});

// Make sure documentation has been added/updated when a validation/helper is added/updated
const validationsMd = 'docs/validations.md';
const utilitiesMd = 'docs/utilities.md';

const changedValidations = inCommitGrep(/^src\/rules\/\w+\/\w+\.js$/);
const changedValidationsDoc = inCommit(validationsMd);
if (changedValidations && !changedValidationsDoc) {
  const validationsLink = linkToTargetRepo(validationsMd, 'documentation');
  warn(
    `Seems like a validation has been added or modified, make sure the ${validationsLink} is up to date.`,
  );
}

const changedUtilities = inCommit('src/rules/helpers.js');
const changedUtilitiesDoc = inCommit(utilitiesMd);
if (changedUtilities && !changedUtilitiesDoc) {
  const utilitiesLink = linkToTargetRepo(utilitiesMd, 'documentation');
  warn(
    `Seems like a utility (helper) has been added or modified, make sure the ${utilitiesLink} is up to date.`,
  );
}

// Make sure tests are added/updated when adding/updating validations or utilities
const changedRules = committedFilesGrep(/^src\/rules\/(\w+\/)?\w+\.js$/);
changedRules.forEach((curChange) => {
  const curChangeTest = curChange.replace(
    /^(src\/rules\/(\w+\/)?)(\w+)(\.js)$/,
    '$1__tests__/$3.test$4',
  );
  if (!inCommit(curChangeTest)) {
    warn(
      `The file \`${curChange}\` has been added or modified but the corresponding test (\`${curChangeTest}\`) hasn't.`,
    );
  }
});
