// const { warn, danger } = require('danger'); // eslint-disable-line import/no-extraneous-dependencies
const {
  committedFilesGrep,
  commonChangelog,
  commonContributingGuide,
  commonFileContains,
  commonPrDescriptionContribution,
  commonValidJson,
  // commonFileWarnings,
  inCommit,
  inCommitGrep,
  jsConsoleCommands,
  jsGlobalEslintChange,
  jsLocalEslintChange,
  jsLockfile,
  jsTestShortcuts,
  linkToTargetRepo,
  prAuthor,
} = require('danger-plugin-toolbox'); // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies

const {
  git: { structuredDiffForFile },
} = danger;

commonPrDescriptionContribution();

commonContributingGuide();

// Only require "CHANGELOG.md" to be updated when the PR is not created by Greenkeeper
if (prAuthor !== 'greenkeeper[bot]') {
  commonChangelog();
}

commonValidJson();

/*
commonFileWarnings('test.log');
*/

jsConsoleCommands();

jsGlobalEslintChange();

jsLocalEslintChange();

jsLockfile();

jsTestShortcuts({ logTypeFocused: 'fail' });

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
changedRules.forEach(curChange => {
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

const structuredFileAddedLines = async filename => {
  const addedLines = {};
  const { chunks } = await structuredDiffForFile(filename);
  chunks.forEach(({ changes }) => {
    changes.forEach(({ type, ln, content }) => {
      if (type === 'add') {
        addedLines[ln] = content.substr(1);
      }
    });
  });
  return addedLines;
};

const structuredFileAddedLineMatches = async (filename, pattern) => {
  const addedLines = await structuredFileAddedLines(filename);
  const matches = [];
  Object.entries(addedLines).forEach(([line, content]) => {
    if (content.match(pattern) !== null) {
      matches.push(line);
    }
  });
  return matches;
};

const getDiff = async () => {
  const file = 'dangerfile.js';
  const matches = await structuredFileAddedLineMatches(file, /warn/);
  matches.forEach(line => {
    warn('Nice!', file, line);
  });

  const { chunks } = await structuredDiffForFile(file);
  warn(JSON.stringify(chunks));
};

getDiff();
