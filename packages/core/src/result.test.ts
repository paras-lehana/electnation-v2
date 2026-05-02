import { describe, it, expect } from 'vitest';
import { ok, err, isOk, isErr, mapResult, unwrap, unwrapOr } from './result';

describe('Result Utilities', () => {
  it('should create an Ok result', () => {
    const res = ok('success');
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toBe('success');
    }
  });

  it('should create an Err result', () => {
    const res = err('failure');
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error).toBe('failure');
    }
  });

  it('isOk should correctly identify Ok results', () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isOk(err(1))).toBe(false);
  });

  it('isErr should correctly identify Err results', () => {
    expect(isErr(err(1))).toBe(true);
    expect(isErr(ok(1))).toBe(false);
  });

  it('mapResult should transform Ok values', () => {
    const res = ok(5);
    const mapped = mapResult(res, (x) => x * 2);
    expect(mapped.ok).toBe(true);
    if (mapped.ok) expect(mapped.value).toBe(10);
  });

  it('mapResult should pass through Err values unchanged', () => {
    const res = err('error');
    const mapped = mapResult(res, (x: number) => x * 2);
    expect(mapped.ok).toBe(false);
    if (!mapped.ok) expect(mapped.error).toBe('error');
  });

  it('unwrap should return value for Ok', () => {
    expect(unwrap(ok(42))).toBe(42);
  });

  it('unwrap should throw for Err', () => {
    expect(() => unwrap(err('bad'))).toThrow('unwrap() on Err: "bad"');
  });

  it('unwrapOr should return value for Ok', () => {
    expect(unwrapOr(ok(42), 0)).toBe(42);
  });

  it('unwrapOr should return fallback for Err', () => {
    expect(unwrapOr(err('bad'), 0)).toBe(0);
  });
});
