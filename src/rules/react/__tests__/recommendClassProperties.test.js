import fs from 'fs';

import * as helpers from '../../helpers';
import reactRecommendClassProperties from '../recommendClassProperties';

const noComponent = 'noComponent.jsx';
const classOnly = 'classOnly.jsx';
const constructorOnly = 'constructorOnly.jsx';
const propTypesOnly = 'propTypesOnly.jsx';
const componentConstructor = 'componentConstructor.jsx';
const componentPropTypes = 'componentPropTypes.jsx';
const invalidJsxCase = 'invalidJsxCase.JsX';

const mockFiles = {
  [noComponent]: 'const foo = 42;',
  [classOnly]: 'foo class MyClass extends MyParentClass bar',
  [constructorOnly]: 'foo constructor() bar',
  [propTypesOnly]: 'foo MyComponent.PropTypes = bar',
  [componentConstructor]:
    'foo class MyComponent extends Component bar constructor()',
  [componentPropTypes]:
    'foo class MyComponent extends React.Component bar MyComponent.PropTypes = {}',
  [invalidJsxCase]: 'foo class MyComponent extends Component bar constructor()',
};

fs.setMockFiles(mockFiles);

describe('reactRecommendClassProperties', () => {
  beforeEach(() => {
    global.warn = jest.fn();
    global.fail = jest.fn();

    jest.resetAllMocks();
  });

  it('should not warn when file does not contain a class component', () => {
    const files = [noComponent];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when file contains a class', () => {
    const files = [classOnly];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when file contains a constructor', () => {
    const files = [constructorOnly];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should not warn when file contains PropTypes', () => {
    const files = [propTypesOnly];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).not.toHaveBeenCalled();
  });

  it('should warn when file contains a class component with a constructor', () => {
    const files = [componentConstructor];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(componentConstructor),
    );
  });

  it('should warn when file contains a class component with PropTypes', () => {
    const files = [componentPropTypes];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(componentPropTypes),
    );
  });

  it('should ignore file extension casing', () => {
    const files = [invalidJsxCase];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties();

    expect(global.warn).toHaveBeenCalledWith(
      expect.stringContaining(invalidJsxCase),
    );
  });

  it('should log as "logType" when is provided', () => {
    const files = [invalidJsxCase];
    helpers.setMockCommittedFiles(files);

    reactRecommendClassProperties({ logType: 'fail' });

    expect(global.warn).not.toHaveBeenCalled();
    expect(global.fail).toHaveBeenCalled();
  });
});
