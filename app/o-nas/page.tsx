import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "O nás – Férek",
  description: "Seznamte se s týmem za Férek – prvním českým marketplace s ověřováním inzerátů.",
};

export default function AboutPage() {
  return (
    <PageLayout title="O nás" subtitle="Kdo stojí za Férek a proč to děláme">
      <h2>Náš příběh</h2>
      <p>
        Férek vznikl z frustrace. Každý, kdo kdy prodával nebo nakupoval na českém internetu, zná ten pocit: 
        <strong> Můžu tomu věřit?</strong> Podvodné inzeráty, kradené fotky, falešní prodejci. 
        Rozhodli jsme se s tím něco udělat.
      </p>
      <p>
        Jsme tým z <strong>PK Virgine, s.r.o.</strong>, stejná společnost, která stojí za projektem 
        <a href="https://neklikni.cz" target="_blank" rel="noopener noreferrer"> NeKlikni.cz</a> — databází 
        nahlášených podvodů, která pomáhá lidem rozpoznat phishing a online podvody.
      </p>
      <p>
        Férek je na Neklikni.cz napojený. Kontaktní údaje v inzerátech a zprávách porovnáváme s databází hlášení 
        a varujeme vás dřív, než pošlete peníze. 
        Proto se jmenujeme <strong>Férek</strong> — protože tady to chodí férově.
      </p>

      <h2>Naše mise</h2>
      <p>
        Vybudovat nejbezpečnější české online tržiště, kde může každý prodávat a nakupovat 
        bez obav z podvodů. Věříme, že technologie má sloužit lidem — ne podvodníkům.
      </p>

      <h2>Hodnoty</h2>
      <ul>
        <li><strong>Bezpečnost na prvním místě</strong> — Údaje v inzerátech kontrolujeme v databázi Neklikni.cz</li>
        <li><strong>Transparentnost</strong> — Říkáme, co jsme zkontrolovali a co ne</li>
        <li><strong>Jednoduchost</strong> — Prodej by měl být snadný jako vyfocení fotky</li>
        <li><strong>Férovost</strong> — Žádné skryté poplatky, žádné triky</li>
      </ul>

      <h2>Provozovatel</h2>
      <p>
        <strong>PK Virgine, s.r.o.</strong><br />
        Korunní 2569/108, Vinohrady, 101 00 Praha<br />
        IČO: 21448507, DIČ: CZ21448507<br />
        Datová schránka: bty8mey<br />
        Spisová značka: C 401405/MSPH Městský soud v Praze
      </p>
    </PageLayout>
  );
}
