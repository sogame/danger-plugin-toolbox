import { structuredFileAddedLineMatches } from './helpers';

export default async (filename, regex, msg, logFunc) => {
  const lines = await structuredFileAddedLineMatches(filename, regex);
  lines.forEach((lineNumber) => {
    logFunc(msg, filename, lineNumber);
  });
};
