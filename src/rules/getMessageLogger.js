export default type => {
  switch (type) {
    case 'fail':
      return fail;
    case 'message':
      return message;
    case 'messageeeee':
      return message;
    default:
      return warn;
  }
};
