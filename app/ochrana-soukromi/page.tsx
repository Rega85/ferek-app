import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Ochrana soukromí – Férek",
  description: "Zásady ochrany osobních údajů (GDPR) služby Férek.",
};

export default function PrivacyPage() {
  return (
    <PageLayout title="Ochrana soukromí" subtitle="Platné od 1. ledna 2025 · PK Virgine, s.r.o.">
      <h2>1. Správce osobních údajů</h2>
      <p>
        Správcem osobních údajů je společnost <strong>PK Virgine, s.r.o.</strong>, 
        Korunní 2569/108, Vinohrady, 101 00 Praha, IČO: 21448507, DIČ: CZ21448507, 
        datová schránka: bty8mey.
      </p>

      <h2>2. Jaké údaje zpracováváme</h2>
      <p>Zpracováváme pouze údaje nezbytné pro provoz služby:</p>
      <ul>
        <li>E-mailová adresa (pro přihlášení a komunikaci)</li>
        <li>Fakturační údaje (při využití placených služeb)</li>
        <li>Záznamy o použití služby (publikované inzeráty, komunikace)</li>
      </ul>
      <p>
        Analyzované texty a obrázky inzerátů nejsou trvale ukládány a nejsou sdíleny s třetími stranami 
        mimo zpracování analýzy. Nahrané fotografie mohou obsahovat osobní údaje třetích stran — 
        tyto údaje jsou zpracovány výhradně za účelem analýzy a nejsou po jejím dokončení uchovávány.
      </p>

      <h2>3. Účel zpracování</h2>
      <ul>
        <li>Poskytování a provoz služby Férek</li>
        <li>Automatické ověřování inzerátů technologií Neklikni</li>
        <li>Správa uživatelského účtu</li>
        <li>Zpracování plateb a vystavení daňových dokladů</li>
        <li>Zákaznická podpora</li>
      </ul>

      <h2>4. Právní základ zpracování</h2>
      <p>
        Osobní údaje zpracováváme na základě plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR) 
        a oprávněného zájmu provozovatele (čl. 6 odst. 1 písm. f) GDPR). 
        Fakturační údaje zpracováváme na základě zákonné povinnosti.
      </p>

      <h2>5. Příjemci osobních údajů</h2>
      <p>Vaše údaje sdílíme pouze s důvěryhodnými zpracovateli nutnými pro provoz služby:</p>
      <ul>
        <li><strong>Supabase</strong> — autentizace a databáze (USA, Standard Contractual Clauses)</li>
        <li><strong>Anthropic</strong> — AI analýza inzerátů (USA, Standard Contractual Clauses)</li>
        <li><strong>Vercel</strong> — hosting aplikace (USA, Standard Contractual Clauses)</li>
      </ul>

      <h2>6. Doba uchování dat</h2>
      <p>
        Osobní údaje uchováváme po dobu trvání uživatelského účtu a dále po dobu stanovenou 
        právními předpisy (zejména daňové doklady po dobu 10 let). Po zrušení účtu jsou údaje 
        do 30 dnů smazány, s výjimkou zákonných povinností.
      </p>

      <h2>7. Vaše práva</h2>
      <p>V souladu s GDPR máte právo na:</p>
      <ul>
        <li>Přístup k vašim osobním údajům</li>
        <li>Opravu nepřesných údajů</li>
        <li>Výmaz údajů („právo být zapomenut")</li>
        <li>Přenositelnost dat</li>
        <li>Námitku proti zpracování</li>
        <li>Podání stížnosti u Úřadu pro ochranu osobních údajů (<a href="https://uoou.cz" target="_blank" rel="noopener noreferrer">uoou.cz</a>)</li>
      </ul>
      <p>
        Svá práva můžete uplatnit prostřednictvím stránky <a href="/kontakt">Kontakt</a> 
        nebo na e-mailu <a href="mailto:info@neklikni.cz">info@neklikni.cz</a>.
      </p>

      <h2>8. Kontakt</h2>
      <p>
        PK Virgine, s.r.o.<br />
        Korunní 2569/108, Vinohrady, 101 00 Praha<br />
        IČO: 21448507<br />
        Datová schránka: bty8mey
      </p>
    </PageLayout>
  );
}
