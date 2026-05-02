export type SensitiveVoterDataKind = 'aadhaar' | 'email' | 'epic' | 'pan' | 'phone' | 'upi';

export interface SensitiveRedactionFinding {
  kind: SensitiveVoterDataKind;
  count: number;
}

export interface SensitiveRedactionResult {
  text: string;
  findings: SensitiveRedactionFinding[];
  totalReplacements: number;
}

interface RedactionRule {
  kind: SensitiveVoterDataKind;
  marker: string;
  pattern: RegExp;
}

const REDACTION_RULES: RedactionRule[] = [
  {
    kind: 'email',
    marker: '[REDACTED_EMAIL]',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
  {
    kind: 'phone',
    marker: '[REDACTED_PHONE]',
    pattern: /\b(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g,
  },
  {
    kind: 'aadhaar',
    marker: '[REDACTED_AADHAAR]',
    pattern: /(?<![+\d])(?:\d[ -]?){11}\d(?!\d)/g,
  },
  {
    kind: 'epic',
    marker: '[REDACTED_EPIC]',
    pattern: /\b[A-Z]{3}\d{7}\b/gi,
  },
  {
    kind: 'pan',
    marker: '[REDACTED_PAN]',
    pattern: /\b[A-Z]{5}\d{4}[A-Z]\b/gi,
  },
  {
    kind: 'upi',
    marker: '[REDACTED_UPI]',
    pattern: /\b[A-Z0-9._-]{2,}@[A-Z]{2,}\b/gi,
  },
];

export const redactSensitiveVoterData = (input: string): SensitiveRedactionResult => {
  const counts = new Map<SensitiveVoterDataKind, number>();
  let text = input;

  for (const rule of REDACTION_RULES) {
    text = text.replace(rule.pattern, () => {
      counts.set(rule.kind, (counts.get(rule.kind) ?? 0) + 1);
      return rule.marker;
    });
  }

  const findings = Array.from(counts.entries()).map(([kind, count]) => ({ kind, count }));
  const totalReplacements = findings.reduce((total, finding) => total + finding.count, 0);
  return { text, findings, totalReplacements };
};
