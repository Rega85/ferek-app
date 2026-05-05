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
        <a href="https://neklikni.cz" target="_blank" rel="noopener noreferrer"> NeKlikni.cz</a> — AI nástrojem 
        na detekci podvodů, který chrání tisíce Čechů před phishingem a online podvody.
      </p>
      <p>
        Technologii Neklikni jsme integrovali přímo do Férek. Každý inzerát prochází automatickou kontrolou, 
        která odhalí podezřelé nabídky ještě předtím, než na ně kliknete. 
        Proto se jmenujeme <strong>Férek</strong> — protože tady to chodí férově.
      </p>

      <h2>Naše mise</h2>
      <p>
        Vybudovat nejbezpečnější české online tržiště, kde může každý prodávat a nakupovat 
        bez obav z podvodů. Věříme, že technologie má sloužit lidem — ne podvodníkům.
      </p>

      <h2>Hodnoty</h2>
      <ul>
        <li><strong>Bezpečnost na prvním místě</strong> — Každý inzerát prověřujeme technologií Neklikni</li>
        <li><strong>Transparentnost</strong> — Jasně komunikujeme rizika a verdikty</li>
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
