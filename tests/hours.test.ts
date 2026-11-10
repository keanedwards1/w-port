import { describe, expect, it } from 'vitest';
import { replyBy } from '../src/lib/hours';

// Times are in UTC. California is 8 hours behind in November.
describe('reply by', () => {
  it('says tomorrow on a weekday', () => { expect(replyBy(new Date('2026-11-04T20:00:00Z'))).toBe('end of day tomorrow'); });
  it('skips the weekend from Friday', () => { expect(replyBy(new Date('2026-11-06T20:00:00Z'))).toBe('end of day Monday'); });
  it('names Monday on Saturday and Sunday', () => {
    expect(replyBy(new Date('2026-11-07T20:00:00Z'))).toBe('end of day Monday');
    expect(replyBy(new Date('2026-11-08T20:00:00Z'))).toBe('end of day tomorrow');
  });
  it('uses the California date, not UTC', () => {
    // 5pm Friday in California is already Saturday in UTC.
    expect(replyBy(new Date('2026-11-07T01:00:00Z'))).toBe('end of day Monday');
  });
});
