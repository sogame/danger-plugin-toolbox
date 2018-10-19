import * as helpers from '../helpers';
import imageMinified from './minified';

describe('imageMinified', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    helpers.setMockCommittedFiles([]);

    jest.resetAllMocks();
  });

  it('should not warn when no image files have been changed', () => {
    const files = ['foo/file1.js', 'file2.md'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any "jpg" file has been changed', () => {
    const files = ['foo/file.jpg'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('JPG'));
  });

  it('should warn when any "jpeg" file has been changed', () => {
    const files = ['foo/file.jpg'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('JPG'));
  });

  it('should warn when any "png" file has been changed', () => {
    const files = ['foo/file.png'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('PNG'));
  });

  it('should warn when any "svg" file has been changed', () => {
    const files = ['foo/file.svg'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('SVG'));
  });

  it('should warn multiple times when more than one image type has been changed', () => {
    const files = ['foo/file.jpg', 'foo/file.svg'];
    helpers.setMockCommittedFiles(files);

    imageMinified();

    expect(global.warn).toHaveBeenCalledTimes(2);
    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('JPG'));
    expect(global.warn).toHaveBeenCalledWith(expect.stringContaining('SVG'));
  });

  it('should log as "logType" when is provided', () => {
    const files = ['foo/file.png'];
    helpers.setMockCommittedFiles(files);

    imageMinified({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
