import * as helpers from '../helpers';
import droneSkipCi from './skipCi';

const errorMsg =
  'CI will not be executed, as `[skip ci]` is part of all commit messages.';

const mockCommits = messages => {
  helpers.commits = messages.map(message => ({ message }));
};

const skipCiMsg = '[skip ci]';

describe('droneSkipCi', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no commit skips ci', () => {
    const messages = ['Commit message'];
    mockCommits(messages);

    droneSkipCi();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when not all commits skips ci', () => {
    const messages = ['Commit message 1', skipCiMsg];
    mockCommits(messages);

    droneSkipCi();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when all commits skips ci', () => {
    const messages = [skipCiMsg, skipCiMsg];
    mockCommits(messages);

    droneSkipCi();

    expect(global.warn).toHaveBeenCalledWith(errorMsg);
  });

  it('should log as "logType" when is provided', () => {
    const messages = [skipCiMsg, skipCiMsg];
    mockCommits(messages);

    droneSkipCi({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
