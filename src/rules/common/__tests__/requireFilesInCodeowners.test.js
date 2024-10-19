import * as helpers from '../../helpers';
import commonRequireFilesInCodeowners from '../requireFilesInCodeowners';

const path = 'some/path/';
const fileWithOwner = 'with_owner.js';
const fileWithoutOwner1 = 'without_owner2.js';
const fileWithoutOwner1InPath = `${path}without_owner2_path.js`;

const buildMessage = (file, codeownersPath = 'CODEOWNERS') =>
  `The file \`${file}\` does not have an owner defined in \`${codeownersPath}\`.`;

describe('commonRequireFilesInCodeowners', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when all files have an owner', () => {
    const files = [fileWithOwner];
    helpers.setMockCommittedFiles(files);

    helpers.setMockCodeowners([[fileWithOwner, ['@user1']]]);

    commonRequireFilesInCodeowners();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when a file does not have an owner', () => {
    const files = [fileWithOwner, fileWithoutOwner1];
    helpers.setMockCommittedFiles(files);

    helpers.setMockCodeowners([[fileWithOwner, ['@user1']]]);

    const expectedMsg = buildMessage(fileWithoutOwner1);

    commonRequireFilesInCodeowners();

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should warn when a file does not have an owner and it is in the path', () => {
    const files = [fileWithOwner, fileWithoutOwner1InPath];
    helpers.setMockCommittedFiles(files);

    helpers.setMockCodeowners([[fileWithOwner, ['@user1']]]);

    const expectedMsg = buildMessage(fileWithoutOwner1InPath);

    commonRequireFilesInCodeowners({ pathsPattern: path });

    expect(global.warn).toHaveBeenCalledWith(expectedMsg);
  });

  it('should not warn when a file does not have an owner but it is not in the path', () => {
    const files = [fileWithOwner, fileWithoutOwner1];
    helpers.setMockCommittedFiles(files);

    helpers.setMockCodeowners([[fileWithOwner, ['@user1']]]);

    commonRequireFilesInCodeowners({ pathsPattern: path });

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should log as "logType" when is provided', () => {
    const files = [fileWithOwner, fileWithoutOwner1];
    helpers.setMockCommittedFiles(files);

    helpers.setMockCodeowners([[fileWithOwner, ['@user1']]]);

    commonRequireFilesInCodeowners({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
