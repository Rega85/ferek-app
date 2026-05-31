# Ferek

Ferek je ceske marketplace demo postavene na Next.js, Reactu, Tailwind CSS a Supabase. Aplikace obsahuje landing page, prihlaseni a registraci, profil uzivatele, pridavani inzeratu, detail inzeratu a pripravu chatu.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Supabase Auth, Database a Storage
- Vercel deployment

## Lokální vývoj

```bash
npm ci
npm run dev
```

Aplikace bezi na `http://localhost:3000`.

## Promenne prostredi

Vercel i lokalni vyvoj potrebuji tyto promenne:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Hodnoty nastav ve Vercelu v `Project Settings -> Environment Variables`. Pro lokalni vyvoj je uloz do `.env.local`.

## Deploy na Vercel

Projekt je pripraveny na Git deploy pres Vercel:

1. Importuj repozitar `Rega85/ferek-app`.
2. Framework nech jako `Next.js`.
3. Build command nech `npm run build`.
4. Output directory nech prazdny, Next.js ji nastavi sam.
5. Dopln Supabase environment variables.
6. Deploy spust pushnutim do produkcni vetve.

## Supabase

Databazove migrace jsou ve slozce `supabase/migrations`. Storage bucket pro obrazky inzeratu se jmenuje `listings`.
