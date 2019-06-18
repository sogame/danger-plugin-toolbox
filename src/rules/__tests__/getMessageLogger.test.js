import getMessageLogger, {
  getPositiveMessageLogger,
} from '../getMessageLogger';

describe('getMessageLogger', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();

    jest.resetAllMocks();
  });

  it('should return "fail" when requested', () => {
    const log = getMessageLogger('fail');

    log('foo');

    expect(global.fail).toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
  });

  it('should return "message" when requested', () => {
    const log = getMessageLogger('message');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
  });

  it('should return "warn" when requested', () => {
    const log = getMessageLogger('warn');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
  });

  it('should return "markdown" when "markdown" is requested and "allowMarkdown" is set', () => {
    const log = getMessageLogger('markdown', true);

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
    expect(global.markdown).toHaveBeenCalled();
  });

  it('should return "warn" when "markdown" is requested but "allowMarkdown" is not set', () => {
    const log = getMessageLogger('markdown');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
  });

  it('should return "warn" when the type is invalid', () => {
    const log = getMessageLogger('invalidType');

    log('foo');

    expect(global.fail).not.toHaveBeenCalled();
    expect(global.message).not.toHaveBeenCalled();
    expect(global.warn).toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
  });
});

describe('getPositiveMessageLogger', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();
    global.markdown = jest.fn();

    jest.resetAllMocks();
  });

  it('should return "message" when requested', () => {
    const log = getPositiveMessageLogger('message');

    log('foo');

    expect(global.message).toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
    expect(global.fail).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should return "markdown" when requested', () => {
    const log = getPositiveMessageLogger('markdown');

    log('foo');

    expect(global.message).not.toHaveBeenCalled();
    expect(global.markdown).toHaveBeenCalled();
    expect(global.fail).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should return "message" when the type is invalid', () => {
    const log = getPositiveMessageLogger('fail');

    log('foo');

    expect(global.message).toHaveBeenCalled();
    expect(global.markdown).not.toHaveBeenCalled();
    expect(global.fail).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });
});
