const {
  inCommitGrep,
  inCommit,
  committedFilesGrep,
  linkToTargetRepo,
  commonPrDescriptionContribution,
  commonContributingGuide,
  commonChangelog,
  commonValidJson,
  jsConsoleCommands,
  jsGlobalEslintChange,
  jsLocalEslintChange,
  jsLockfile,
  jsTestShortcuts,
} = require('danger-plugin-toolbox'); // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies

commonPrDescriptionContribution();

commonContributingGuide();

commonChangelog();

commonValidJson();

jsConsoleCommands();

jsGlobalEslintChange();

jsLocalEslintChange();

jsLockfile();

jsTestShortcuts({ logTypeFocused: 'fail' });

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
const changedRules = committedFilesGrep(/^src\/rules\/\w+\/?\w+\.js$/);
changedRules.forEach(curChange => {
  const curChangeTest = curChange.replace('.js', '.test.js');
  if (!inCommit(curChangeTest)) {
    warn(
      `The file \`${curChange}\` has been added or modified but the corresponding test (\`${curChangeTest}\`) hasn't.`,
    );
  }
});
