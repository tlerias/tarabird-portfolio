import { describe, it, expect } from 'vitest';
import { validateContact } from '../contact';

describe('validateContact', () => {
  it('passes valid input', () => {
    const r = validateContact({ name: 'Ada', email: 'ada@example.com', message: 'Hello there', company: '' });
    expect(r.ok).toBe(true);
  });

  it('rejects missing name', () => {
    const r = validateContact({ name: '', email: 'a@b.com', message: 'hi', company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = validateContact({ name: 'A', email: 'not-an-email', message: 'hi', company: '' });
    expect(r.ok).toBe(false);
  });

  it('rejects when honeypot is filled (spam)', () => {
    const r = validateContact({ name: 'A', email: 'a@b.com', message: 'hi', company: 'bot' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/spam/i);
  });

  it('rejects oversized message', () => {
    const r = validateContact({ name: 'A', email: 'a@b.com', message: 'x'.repeat(5000), company: '' });
    expect(r.ok).toBe(false);
  });
});
