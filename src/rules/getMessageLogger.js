export const getPositiveMessageLogger = type => {
  switch (type) {
    case 'markdown':
      return markdown;
    default:
      return message;
  }
};

export default (type, allowMarkdown = false) => {
  if (allowMarkdown === true && type === 'markdown') {
    return markdown;
  }

  switch (type) {
    case 'fail':
      return fail;
    case 'message':
      return message;
    default:
      return warn;
  }
};
