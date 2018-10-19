import * as helpers from '../helpers';
import imageMinifiedJpg from './minifiedJpg';

const message =
  'Please, make sure that all JPG files are minified. Any online tool can be used, like for example [TinyPNG](https://tinypng.com/).';

describe('imageMinifiedJpg', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    helpers.setMockCommittedFiles([]);

    jest.resetAllMocks();
  });

  it('should not warn when no "jpg" files have been changed', () => {
    const files = ['foo/file.js', 'foo/file.jpgg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedJpg();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any "jpg" file has been changed', () => {
    const files = ['foo/file.jpg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedJpg();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should warn when any "jpeg" file has been changed', () => {
    const files = ['foo/file.jpeg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedJpg();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should ignore file extension casing', () => {
    const files = ['foo/file.JpG'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedJpg();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should log as "logType" when is provided', () => {
    const files = ['foo/file.jpg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedJpg({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
