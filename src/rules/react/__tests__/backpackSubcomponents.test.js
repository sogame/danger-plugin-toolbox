import * as helpers from '../../helpers';
import reactBackpackSubcomponents from '../backpackSubcomponents';

const valid = 'valid.jsx';
const validProps = 'validProps.jsx';
const invalid = 'invalid.jsx';
const invalidProps = 'invalidProps.jsx';
const invalidCase = 'invalidCase.JsX';
const mockFiles = {
  [valid]: '<BpkButtonPrimary>bar</BpkButtonPrimary>',
  [validProps]: '<BpkButtonPrimary a="b">bar</BpkButtonPrimary>',
  [invalid]: '<BpkButton>bar</BpkButton>',
  [invalidProps]: '<BpkButton a="b">bar</BpkButton>',
  [invalidCase]: '<BpkButton>bar</BpkButton>',
};

helpers.setMockFilesContent(mockFiles);

describe('reactBackpackSubcomponents', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when "BpkButton" is not being used', async () => {
    const files = [valid, validProps];
    helpers.setMockCommittedFiles(files);

    await reactBackpackSubcomponents();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when "BpkButton" is being used', async () => {
    const files = [valid, invalid];
    helpers.setMockCommittedFiles(files);

    await reactBackpackSubcomponents();

    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining(invalid));
  });

  it('should warn when "BpkButton" is being used with props', async () => {
    const files = [valid, invalidProps];
    helpers.setMockCommittedFiles(files);

    await reactBackpackSubcomponents();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidProps),
    );
  });

  it('should ignore file extension casing', async () => {
    const files = [invalidCase];
    helpers.setMockCommittedFiles(files);

    await reactBackpackSubcomponents();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidCase),
    );
  });

  it('should log as "logType" when is provided', async () => {
    const files = [invalid];
    helpers.setMockCommittedFiles(files);

    await reactBackpackSubcomponents({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
