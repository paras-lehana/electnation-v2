import { describe, expect, it } from 'vitest';
import { redactSensitiveVoterData } from './privacyRedaction.js';

describe('redactSensitiveVoterData', () => {
  it('redacts common voter identifiers before text leaves the backend', () => {
    const result = redactSensitiveVoterData(
      'My Aadhaar is 1234 5678 9012, EPIC is ABC1234567, phone +91 98765 43210, email voter@example.com, PAN ABCDE1234F, UPI paras@upi.',
    );

    expect(result.text).toContain('[REDACTED_AADHAAR]');
    expect(result.text).toContain('[REDACTED_EPIC]');
    expect(result.text).toContain('[REDACTED_PHONE]');
    expect(result.text).toContain('[REDACTED_EMAIL]');
    expect(result.text).toContain('[REDACTED_PAN]');
    expect(result.text).toContain('[REDACTED_UPI]');
    expect(result.text).not.toContain('1234 5678 9012');
    expect(result.text).not.toContain('ABC1234567');
    expect(result.totalReplacements).toBe(6);
    expect(result.findings.map((finding) => finding.kind).sort()).toEqual([
      'aadhaar',
      'email',
      'epic',
      'pan',
      'phone',
      'upi',
    ]);
  });

  it('leaves ordinary election text readable for classification', () => {
    const result = redactSensitiveVoterData('Forward says EVM bluetooth can be hacked tomorrow.');

    expect(result.text).toBe('Forward says EVM bluetooth can be hacked tomorrow.');
    expect(result.findings).toEqual([]);
  });
});
