const matchLineNumber = (content, pattern, skipLines = 0) => {
  const finalContent =
    skipLines <= 0
      ? content
      : content
          .split('\n')
          .slice(skipLines)
          .join('\n');

  const [beforeStr, afterStr] = finalContent.split(pattern);
  if (typeof afterStr === 'undefined') {
    return -1;
  }

  const lines = beforeStr.split('\n');
  return skipLines + lines.length;
};

export default matchLineNumber;
