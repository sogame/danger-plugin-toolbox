import * as helpers from '../helpers';
import imageMinifiedSvg from './minifiedSvg';

const message =
  'Please, make sure that all SVG files are minified. Any online tool can be used, like for example [SVGOMG](https://jakearchibald.github.io/svgomg/).';

describe('imageMinifiedSvg', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    helpers.setMockCommittedFiles([]);

    jest.resetAllMocks();
  });

  it('should not warn when no "svg" files have been changed', () => {
    const files = ['foo/file.js', 'foo/file.svgg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedSvg();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when any "svg" file has been changed', () => {
    const files = ['foo/file.svg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedSvg();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should ignore file extension casing', () => {
    const files = ['foo/file.SvG'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedSvg();

    expect(global.warn).toHaveBeenCalledWith(message);
  });

  it('should log as "logType" when is provided', () => {
    const files = ['foo/file.svg'];
    helpers.setMockCommittedFiles(files);

    imageMinifiedSvg({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
