//
// When uploading an image, make sure it's minified.
//

import imageMinifiedJpg from './minifiedJpg';
import imageMinifiedPng from './minifiedPng';
import imageMinifiedSvg from './minifiedSvg';

export default config => {
  imageMinifiedJpg(config);
  imageMinifiedPng(config);
  imageMinifiedSvg(config);
};
