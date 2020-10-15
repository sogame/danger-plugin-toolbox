//
// Recommend using class properties to define `state` and PropTypes when creating React class components.
//

import fs from 'fs';

import getMessageLogger from '../getMessageLogger';
import { committedFilesGrep } from '../helpers';

export default ({ logType } = {}) => {
  const fileDoesNotUseClassProperties = (filename) => {
    const contents = fs.readFileSync(filename).toString();

    const isClassComponent = contents.match(
      /\sclass \w+ extends (React\.)?Component/g,
    );
    const hasConstructor = contents.match(/\sconstructor\(/g);
    const hasPropTypes = contents.match(/\s\w+\.PropTypes\s=/g);

    return isClassComponent && (hasConstructor || hasPropTypes);
  };

  const log = getMessageLogger(logType);
  const jsxFiles = committedFilesGrep(/\.jsx$/i);
  jsxFiles.forEach((filename) => {
    const noClassProperties = fileDoesNotUseClassProperties(filename);
    if (noClassProperties) {
      log(
        `The file \`${filename}\` seems to not be using class properties, but the preference for this project is to use them when possible (see [this post](https://codeburst.io/use-class-properties-to-clean-up-your-classes-and-react-components-93185879f688) for more details).`,
      );
    }
  });
};
