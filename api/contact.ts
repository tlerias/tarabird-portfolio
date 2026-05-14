import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateContact } from '../src/lib/contact';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('method not allowed');
  }

  // Parse formdata or JSON
  let payload: Record<string, string> = {};
  if (typeof req.body === 'object' && req.body) {
    payload = req.body as Record<string, string>;
  } else if (typeof req.body === 'string') {
    const params = new URLSearchParams(req.body);
    for (const [k, v] of params.entries()) payload[k] = v;
  }

  const result = validateContact(payload);
  if (!result.ok) return res.status(400).send(result.error);

  // Log for MVP. To wire actual email sending, install resend (`npm install resend`)
  // and replace the console.log with a Resend.emails.send() call using
  // process.env.RESEND_API_KEY and process.env.CONTACT_TO_EMAIL.
  console.log('CONTACT submission:', result.data);

  return res.status(200).send('ok');
}
