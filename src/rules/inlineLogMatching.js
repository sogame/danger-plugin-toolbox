import { structuredFileAddedLineMatches } from './helpers';

export default async (filename, regex, msg, logFunc) => {
  const lines = await structuredFileAddedLineMatches(filename, regex);
  console.log('bar 2'); // eslint-disable-line
  lines.forEach(lineNumber => {
    logFunc(msg, filename, lineNumber);
  });
};
