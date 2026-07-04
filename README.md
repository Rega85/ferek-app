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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

Hodnoty nastav ve Vercelu v `Project Settings -> Environment Variables`. Pro lokalni vyvoj je uloz do `.env.local`.
`NEXT_PUBLIC_GOOGLE_CLIENT_ID` aktivuje Google One Tap na prihlasovaci strance. Bez nej zustane k dispozici klasicke Google prihlaseni pres Supabase OAuth provider.

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

## Prihlaseni

Aktualni prihlaseni podporuje:

- Google pres Supabase OAuth
- Facebook pres Supabase OAuth
- magic link pro e-mail, vcetne Seznam.cz adres
- volitelne Google One Tap pri nastaveni `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

V Supabase zapni providery v `Authentication -> Providers` a vypln jejich Client ID a Client Secret. Do `Authentication -> URL Configuration` pridej redirect URL:

```text
https://tvoje-domena.cz/auth/callback
https://ferek-app-git-main-nekliniczs-projects.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

Seznam neni v Supabase mezi nativnimi social providery. Pro plne "Prihlasit pres Seznam" bude potreba bud custom OAuth/OIDC provider, nebo vlastni serverova OAuth integrace. Do te doby tlacitko "Seznam e-mail" pouziva bezpecny magic link.
