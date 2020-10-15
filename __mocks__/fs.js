const fs = jest.createMockFromModule('fs');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = {};
const setMockFiles = (newMockFiles) => {
  mockFiles = { ...newMockFiles };
};

const readFileSync = (filename) => mockFiles[filename] || '';

const existsSync = (filename) => !!mockFiles[filename];

fs.setMockFiles = setMockFiles;
fs.readFileSync = readFileSync;
fs.existsSync = existsSync;

module.exports = fs;
