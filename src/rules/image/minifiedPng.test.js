import * as helpers from '../helpers';
import imageMinifiedPng from './minifiedPng';

const message =
  'Please, make sure that all PNG files are minified. Any online tool can be used, like for example [TinyPNG](https://tinypng.com/).';

describe('imageMinifiedPng', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    helpers.setMockCommittedFiles([]);

    jest.resetAllMocks();
  });

  it('should not warn when no "png" files have been changed', () => {
    const files = ['foo/file.js', 'foo/file.pngg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedPng();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any "png" file has been changed', () => {
    const files = ['foo/file.png'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedPng();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should ignore file extension casing', () => {
    const files = ['foo/file.PnG'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedPng();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should log as "logType" when is provided', () => {
    const files = ['foo/file.png'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedPng({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
