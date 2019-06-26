export const getPositiveMessageLogger = type =>
  type === 'markdown' ? markdown : message;

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
