import * as helpers from '../helpers';
import droneSkipRelease from './skipRelease';

const errorMsg =
  'A new version will not be created, as `[skip release]` is part of all commit messages.';

const mockCommits = messages => {
  helpers.commits = messages.map(message => ({ message }));
};

const skipReleaseMsg = '[skip release]';

describe('droneSkipRelease', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no commit skips release', () => {
    const messages = ['Commit message'];
    mockCommits(messages);

    droneSkipRelease();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when not all commits skips release', () => {
    const messages = ['Commit message 1', skipReleaseMsg];
    mockCommits(messages);

    droneSkipRelease();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when all commits skips release', () => {
    const messages = [skipReleaseMsg, skipReleaseMsg];
    mockCommits(messages);

    droneSkipRelease();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should log as "logType" when is provided', () => {
    const messages = [skipReleaseMsg, skipReleaseMsg];
    mockCommits(messages);

    droneSkipRelease({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
