import matchLineNumber from '../matchLineNumber';

const content = `aaaaaa
bbbbbbb
  cccccc cc
  ddddddd
  cccccc
fffffff`;

describe('matchLineNumber', () => {
  it('should return -1 when the pattern is not found', () => {
    const pattern = /zzzzzz/;
    const expected = -1;

    const result = matchLineNumber(content, pattern);

    expect(result).toBe(expected);
  });

  it('should return the matching line when the pattern is found', () => {
    const pattern = /bbbbb/;
    const expected = 2;

    const result = matchLineNumber(content, pattern);

    expect(result).toBe(expected);
  });

  it('should return the first matching line when the pattern is found more than once', () => {
    const pattern = /cccccc/;
    const expected = 3;

    const result = matchLineNumber(content, pattern);

    expect(result).toBe(expected);
  });

  it('should return -1 when some lines are skipped (when the pattern is found)', () => {
    const pattern = /bbbbb/;
    const expected = -1;

    const result = matchLineNumber(content, pattern, 3);

    expect(result).toBe(expected);
  });

  it('should return the matching line when some lines are skipped (when the pattern is found)', () => {
    const pattern = /cccccc/;
    const expected = 5;

    const result = matchLineNumber(content, pattern, 3);

    expect(result).toBe(expected);
  });
});
