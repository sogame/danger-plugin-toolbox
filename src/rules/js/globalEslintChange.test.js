import * as helpers from '../helpers';
import jsGlobalEslintChange from './globalEslintChange';

const getMessageEslintrc = (path = '') =>
  `\`${path}.eslintrc\` has been modified. Make sure this change is needed globally and not locally.`;

const getMessageEslinignore = (path = '') =>
  `\`${path}.eslintignore\` has been modified.`;

describe('jsGlobalEslintChange', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no eslint configuration has changed', async () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when eslintrc has changed', async () => {
    const files = ['file.js', '.eslintrc'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc());
  });

  it('should warn when eslintrc.json has changed', async () => {
    const files = ['file.js', '.eslintrc.json'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc());
  });

  it('should warn when eslintrc.yml has changed', async () => {
    const files = ['file.js', '.eslintrc.yml'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc());
  });

  it('should warn when eslintrc.js has changed', async () => {
    const files = ['file.js', '.eslintrc.js'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc());
  });

  it('should warn when eslintignore has changed', async () => {
    const files = ['file.js', '.eslintignore'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslinignore());
  });

  it('should warn when eslintrc and eslintignore have changed', async () => {
    const files = ['file.js', '.eslintrc', '.eslintignore'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc());
    expect(global.warn).toHaveBeenCalledWith(getMessageEslinignore());
  });

  it('should not warn when eslintrc and eslintignore have changed in a folder', async () => {
    const files = ['file.js', 'folder/.eslintrc', 'folder/.eslintignore'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange();

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when eslintrc and eslintignore have changed in a folder and "path" is provided', async () => {
    const path = 'folder/';
    const files = ['file.js', `${path}.eslintrc`, `${path}.eslintignore`];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange({ path });

    expect(global.warn).toHaveBeenCalledWith(getMessageEslintrc(path));
    expect(global.warn).toHaveBeenCalledWith(getMessageEslinignore(path));
  });

  it('should log as "logTypeEslintrc" when is provided', async () => {
    const files = ['file.js', '.eslintrc'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange({ logTypeEslintrc: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeEslintignore" when is provided', async () => {
    const files = ['file.js', '.eslintignore'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange({ logTypeEslintignore: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log each message accordingly when "logTypeEslintrc" and "logTypeEslintignore" are provided', async () => {
    const files = ['file.js', '.eslintrc', '.eslintignore'];
    helpers.setMockCommittedFiles(files);

    jsGlobalEslintChange({
      logTypeEslintrc: 'message',
      logTypeEslintignore: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(getMessageEslintrc());
    expect(global.fail).toHaveBeenCalledWith(getMessageEslinignore());
  });
});
