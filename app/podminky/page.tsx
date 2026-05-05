import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Podmínky použití – Férek",
  description: "Všeobecné obchodní podmínky služby Férek.",
};

export default function TermsPage() {
  return (
    <PageLayout title="Podmínky použití" subtitle="Platné od 1. ledna 2025">
      <h2>1. Provozovatel služby</h2>
      <p>
        Provozovatelem služby Férek je společnost <strong>PK Virgine, s.r.o.</strong>, 
        se sídlem Korunní 2569/108, Vinohrady, 101 00 Praha, IČO: 21448507, DIČ: CZ21448507, 
        zapsaná v obchodním rejstříku vedeném Městským soudem v Praze pod sp. zn. C 401405/MSPH.
      </p>

      <h2>2. Popis služby</h2>
      <p>
        Férek je online tržiště (marketplace) umožňující uživatelům inzerovat a prodávat zboží. 
        Součástí služby je automatické ověřování inzerátů technologií Neklikni, která využívá umělou inteligenci 
        k detekci potenciálních podvodů. Výsledky ověřování mají výhradně informativní charakter 
        a nepředstavují právní, bezpečnostní ani odborné poradenství.
      </p>

      <h2>3. Registrace a uživatelský účet</h2>
      <p>
        Pro plné využití služby je nutná registrace. Uživatel je povinen uvádět pravdivé údaje 
        a chránit přístupové údaje ke svému účtu. Provozovatel nenese odpovědnost za škody vzniklé 
        zneužitím přístupových údajů třetí osobou.
      </p>

      <h2>4. Pravidla inzerování</h2>
      <p>
        Uživatel se zavazuje inzerovat pouze zboží, které vlastní a má právo prodávat. 
        Je zakázáno inzerovat:
      </p>
      <ul>
        <li>Kradené zboží</li>
        <li>Padělky a napodobeniny</li>
        <li>Zbraně, drogy a další nelegální položky</li>
        <li>Zboží porušující práva třetích osob</li>
      </ul>
      <p>
        Provozovatel si vyhrazuje právo bez upozornění odstranit inzeráty porušující tato pravidla 
        a zablokovat účet uživatele.
      </p>

      <h2>5. Poplatky</h2>
      <p>
        Základní inzerování na Férek je zdarma. Provozovatel si vyhrazuje právo zavést 
        placené prémiové funkce (zvýraznění inzerátu, prioritní ověření apod.). 
        O zavedení nových poplatků bude uživatel informován předem.
      </p>

      <h2>6. Omezení odpovědnosti</h2>
      <p>
        Férek je zprostředkovatel — není stranou transakce mezi kupujícím a prodávajícím. 
        Provozovatel nenese odpovědnost za kvalitu, stav ani dodání zboží. 
        Analýzy prováděné technologií Neklikni jsou generovány umělou inteligencí a mohou obsahovat nepřesnosti. 
        Provozovatel nenese odpovědnost za žádné škody vzniklé na základě výsledků analýzy.
      </p>

      <h2>7. Ochrana osobních údajů</h2>
      <p>
        Zpracování osobních údajů se řídí <a href="/ochrana-soukromi">Zásadami ochrany osobních údajů</a>. 
        Analyzované texty nejsou trvale ukládány ani sdíleny s třetími stranami.
      </p>

      <h2>8. Změny podmínek</h2>
      <p>
        Provozovatel si vyhrazuje právo tyto podmínky měnit. O změnách bude uživatel informován 
        e-mailem nebo oznámením v aplikaci. Pokračování v užívání služby po nabytí účinnosti změn 
        představuje souhlas s novými podmínkami.
      </p>

      <h2>9. Rozhodné právo</h2>
      <p>
        Tyto podmínky se řídí právním řádem České republiky. 
        Případné spory budou řešeny příslušným soudem v České republice.
      </p>

      <h2>10. Kontakt</h2>
      <p>
        PK Virgine, s.r.o.<br />
        Korunní 2569/108, Vinohrady, 101 00 Praha<br />
        IČO: 21448507<br />
        Datová schránka: bty8mey<br />
        E-mail: <a href="mailto:info@neklikni.cz">info@neklikni.cz</a>
      </p>
    </PageLayout>
  );
}
