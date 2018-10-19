import * as helpers from '../helpers';
import cssGlobalStylelintChange from './globalStylelintChange';

const getMessageStylelintrc = (path = '') =>
  `\`${path}.stylelintrc\` has been modified. Make sure this change is needed globally and not locally.`;

const getMessageStylelinignore = (path = '') =>
  `\`${path}.stylelintignore\` has been modified.`;

describe('cssGlobalStylelintChange', () => {
  beforeEach(() => {
    global.message = jest.fn();
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when no stylelint configuration has changed', () => {
    const files = ['file.js'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when stylelintrc has changed', () => {
    const files = ['file.js', '.stylelintrc'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc());
  });

  it('should warn when stylelintrc.json has changed', () => {
    const files = ['file.js', '.stylelintrc.json'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc());
  });

  it('should warn when stylelintrc.yml has changed', () => {
    const files = ['file.js', '.stylelintrc.yml'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc());
  });

  it('should warn when stylelintrc.js has changed', () => {
    const files = ['file.js', '.stylelintrc.js'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc());
  });

  it('should warn when stylelintignore has changed', () => {
    const files = ['file.js', '.stylelintignore'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelinignore());
  });

  it('should warn when stylelintrc and stylelintignore have changed', () => {
    const files = ['file.js', '.stylelintrc', '.stylelintignore'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc());
    expect(global.warn).toHaveBeenCalledWith(getMessageStylelinignore());
  });

  it('should not warn when stylelintrc and stylelintignore have changed in a folder', () => {
    const files = ['file.js', 'folder/.stylelintrc', 'folder/.stylelintignore'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when stylelintrc and stylelintignore have changed in a folder and "path" is provided', () => {
    const path = 'folder/';
    const files = ['file.js', `${path}.stylelintrc`, `${path}.stylelintignore`];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange({ path });

    expect(global.warn).toHaveBeenCalledWith(getMessageStylelintrc(path));
    expect(global.warn).toHaveBeenCalledWith(getMessageStylelinignore(path));
  });

  it('should log as "logTypeStylelintrc" when is provided', () => {
    const files = ['file.js', '.stylelintrc'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange({ logTypeStylelintrc: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log as "logTypeStylelintignore" when is provided', () => {
    const files = ['file.js', '.stylelintignore'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange({ logTypeStylelintignore: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });

  it('should log each message accordingly when "logTypeStylelintrc" and "logTypeStylelintignore" are provided', () => {
    const files = ['file.js', '.stylelintrc', '.stylelintignore'];
    helpers.setMockCommittedFiles(files);

    cssGlobalStylelintChange({
      logTypeStylelintrc: 'message',
      logTypeStylelintignore: 'fail',
    });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.message).toHaveBeenCalledWith(getMessageStylelintrc());
    expect(global.fail).toHaveBeenCalledWith(getMessageStylelinignore());
  });
});
