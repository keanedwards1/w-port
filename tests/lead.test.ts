import { describe, expect, it, vi } from 'vitest';
import { contactLink, leadPayload, sendLead } from '../src/lib/lead';

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));
const lead = { name: 'Ana', email: 'ana@example.com', need: 'Hours are wrong', source: 'picker' };

describe('leads', () => {
  it('builds the FormSubmit payload', () => {
    const p = leadPayload({ ...lead, honey: 'bot' });
    expect(p).toMatchObject({ name: 'Ana', _replyto: 'ana@example.com', _honey: 'bot', source: 'picker' });
    expect(p._subject).toBe('New lead from Ana (picker)');
  });
  it('falls back to the email when no name is given', () => {
    expect(leadPayload({ email: 'a@b.co', source: 'site-check' }).name).toBe('a@b.co');
  });
  it('sends to the form endpoint', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response('{"success":"true"}'));
    await sendLead(lead, fetcher);
    expect(fetcher.mock.calls[0][0]).toContain('formsubmit.co');
  });
  it('throws when the service refuses, so the visitor sees a way to reach me', async () => {
    await expect(sendLead(lead, vi.fn().mockResolvedValue(new Response('{"success":"false"}')))).rejects.toThrow();
    await expect(sendLead(lead, vi.fn().mockResolvedValue(new Response('', { status: 500 })))).rejects.toThrow();
  });
  it('builds pre-filled contact links and skips empty values', () => {
    expect(contactLink({ need: 'A site', source: 'x', website: '' })).toBe('/contact?need=A+site&source=x');
  });
});
