# Deploy handoff — what to do when you wake up

Everything builds, all 17 tests pass, screenshots are captured, contact API is validated. The only things left are the interactive steps that need your account access.

## 1. Install Vercel CLI (if you don't have it)

```bash
npm install -g vercel
```

## 2. From the project root, link to Vercel

```bash
cd /Users/tarabird/Workspace/portfolio
vercel login          # follow the email prompt
vercel link           # create a new project named "tarabird" when prompted
```

## 3. Configure environment variables

In the Vercel dashboard (https://vercel.com/dashboard → tarabird project → Settings → Environment Variables), add:

- `RESEND_API_KEY` — get one at resend.com (free tier: 100/day, 3000/month)
- `CONTACT_TO_EMAIL` — your email (e.g. `tara@tarabird.com`)

## 4. Wire actual email sending (optional for MVP)

Right now `api/contact.ts` only logs submissions to console. To actually receive emails:

```bash
npm install resend
```

Then in `api/contact.ts`, replace the `console.log` with:
```ts
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
await resend.emails.send({
  from: 'hello@tarabird.com',
  to: process.env.CONTACT_TO_EMAIL!,
  subject: `Portfolio contact from ${result.data.name}`,
  text: `${result.data.message}\n\n— ${result.data.name} <${result.data.email}>`,
});
```

You'll need to verify `tarabird.com` as a Resend sending domain too (Resend dashboard → Domains).

## 5. Deploy to production

```bash
vercel --prod
```

This will give you a `*.vercel.app` preview URL immediately.

## 6. Add custom domain

In the Vercel dashboard → tarabird project → Settings → Domains, add:
- `tarabird.com`
- `www.tarabird.com`

Vercel will give you DNS records to add at your domain registrar. Once propagated (usually 5-30 minutes), the site is live at tarabird.com.

## 7. Test the live site

Walk through the smoke test checklist in:
`docs/superpowers/plans/2026-05-14-tarabird-portfolio.md` (Task 36 section)

Specifically:
- Visit homepage, scroll through all 5 sections
- Click each case study link
- Submit the contact form (should land in your inbox once Resend is wired)
- Try the konami code: ↑↑↓↓←→←→ba (cat should walk across the screen)
- Visit a fake URL — should get the themed 404
- Inspect with `lighthouse https://tarabird.com` for production scores

That's it. Everything else is done.
