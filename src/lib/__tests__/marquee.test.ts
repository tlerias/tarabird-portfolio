import { describe, it, expect } from 'vitest';
import { interleaveSeparator, doubleForLoop } from '../marquee';

describe('marquee helpers', () => {
  it('interleaves a separator between items', () => {
    const result = interleaveSeparator(['a', 'b', 'c'], '★');
    expect(result).toEqual(['a', '★', 'b', '★', 'c', '★']);
  });
  it('handles single item', () => {
    expect(interleaveSeparator(['only'], '★')).toEqual(['only', '★']);
  });
  it('handles empty list', () => {
    expect(interleaveSeparator([], '★')).toEqual([]);
  });
  it('doubles items for seamless loop', () => {
    expect(doubleForLoop(['a', 'b'])).toEqual(['a', 'b', 'a', 'b']);
  });
});
