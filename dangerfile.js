const {
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

jsTestShortcuts();
