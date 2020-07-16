import stringArrayToList from '../stringArrayToList';

describe('stringArrayToList', () => {
  const empty = [];
  const multiple = ['Bbb', 'Ccc', 'Ddd'];

  it('should build empty list (without backticks)', () => {
    const expected = '';

    const result = stringArrayToList(empty);

    expect(result).toBe(expected);
  });

  it('should build empty list (with backticks)', () => {
    const expected = '';

    const result = stringArrayToList(empty, true);

    expect(result).toBe(expected);
  });

  it('should build list (without backticks)', () => {
    const expected = '- Bbb<br>- Ccc<br>- Ddd';

    const result = stringArrayToList(multiple);

    expect(result).toBe(expected);
  });

  it('should build list (with backticks)', () => {
    const expected = '- `Bbb`<br>- `Ccc`<br>- `Ddd`';

    const result = stringArrayToList(multiple, true);

    expect(result).toBe(expected);
  });
});
