import * as helpers from '../helpers';
import droneEnsureSkipRelease from './ensureSkipRelease';

const errorMsg =
  'If the changes do not require a new version, remember to add `[skip release]` to the commit messages to avoid creating a new version.';

const mockCommits = messages => {
  helpers.commits = messages.map(message => ({ message }));
};

const skipReleaseMsg = '[skip release]';

describe('droneEnsureSkipRelease', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when all commits skips release', () => {
    const messages = [skipReleaseMsg, skipReleaseMsg];
    mockCommits(messages);

    droneEnsureSkipRelease();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when no commit skips release', () => {
    const messages = ['Commit message'];
    mockCommits(messages);

    droneEnsureSkipRelease();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should warn when not all commits skips release', () => {
    const messages = ['Commit message 1', skipReleaseMsg];
    mockCommits(messages);

    droneEnsureSkipRelease();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should log as "logType" when is provided', () => {
    const messages = ['Commit message'];
    mockCommits(messages);

    droneEnsureSkipRelease({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
