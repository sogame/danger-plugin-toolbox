import getMessageLogger from './getMessageLogger';

describe('commonChangelog', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should return "fail" when requested', () => {
    const log = getMessageLogger('fail');

    log('foo');

    expect(global.fail).toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should return "message" when requested', () => {
    const log = getMessageLogger('message');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should return "warn" when requested', () => {
    const log = getMessageLogger('warn');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).toHaveBeenCalled();
  });

  it('should return "warn" when the type is invalid', () => {
    const log = getMessageLogger('invalidType');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).toHaveBeenCalled();
  });
});
