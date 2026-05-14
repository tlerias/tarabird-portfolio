import { z } from 'zod';

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(1).max(2000),
  company: z.string().max(0, { message: 'spam detected' }),
});

export type ContactPayload = z.infer<typeof ContactSchema>;

export type ValidationResult =
  | { ok: true; data: ContactPayload }
  | { ok: false; error: string };

export function validateContact(input: unknown): ValidationResult {
  const result = ContactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  const firstErr = result.error.issues[0];
  return { ok: false, error: firstErr.message };
}
