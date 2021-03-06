//
// Thank the author of external contributions and link to the contributing guidelines.
//

import { externalPr, linkToTargetRepo, prAuthor } from '../helpers';

export default ({ contributingFile } = {}) => {
  if (externalPr) {
    const filename = contributingFile || 'CONTRIBUTING.md';
    const contributingUrl = linkToTargetRepo(filename);
    message(
      `Thanks for the contribution, ${prAuthor}! Please, make sure to follow our ${contributingUrl}.`,
    );
  }
};
