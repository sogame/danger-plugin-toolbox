const formatLine = (line, addBackticks = false) => {
  const msg = addBackticks ? `\`${line}\`` : line;
  return `- ${msg}`;
};

const stringArrayToList = (items, addBackticks) =>
  items.map((line) => formatLine(line, addBackticks)).join('<br>');

export default stringArrayToList;
