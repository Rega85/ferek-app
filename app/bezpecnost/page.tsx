import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Bezpečnost – Férek",
  description: "Jak Férek používá databázi hlášení Neklikni.cz a jak se nenapálit při nákupu z bazaru.",
};

export default function SecurityPage() {
  return (
    <PageLayout title="Bezpečnost" subtitle="Jak vás chráníme a co můžete udělat sami">
      <h2>Kontrola přes Neklikni.cz</h2>
      <p>
        Férek je napojený na databázi <a href="https://www.neklikni.cz" target="_blank" rel="noopener noreferrer">Neklikni.cz</a>.
        Ta eviduje telefony, bankovní účty, e-maily a weby, které lidé nahlásili jako podvodné, a údaje ze seznamu
        rizikových e-shopů České obchodní inspekce. Kontaktní údaje v inzerátech a ve zprávách porovnáváme s touto databází.
      </p>

      <h2>Co znamenají štítky</h2>
      <div className="not-prose space-y-4 my-8">
        <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
          <div className="w-4 h-4 bg-gray-700 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-gray-900">Zkontrolováno · bez hlášení</p>
            <p className="text-gray-700 text-sm mt-1">
              Kontrola proběhla a údaje v inzerátu nikdo nenahlásil. Neznamená to záruku: nový podvodník hlášení mít nemusí.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="w-4 h-4 bg-amber-500 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-amber-900">Hlášení na Neklikni.cz</p>
            <p className="text-amber-800 text-sm mt-1">
              Některý údaj v inzerátu už někdo nahlásil. Může jít o omyl, ale buďte opatrní a neplaťte předem.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-2xl p-5">
          <div className="w-4 h-4 border-2 border-gray-300 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-gray-900">Bez štítku</p>
            <p className="text-gray-700 text-sm mt-1">Kontrola zatím neproběhla (například po úpravě inzerátu). Nic z toho nevyvozujte.</p>
          </div>
        </div>
      </div>
      <p>
        Inzeráty s vážnými hlášeními nezveřejňujeme automaticky. Před zveřejněním je zkontroluje člověk.
      </p>

      <h2>Jak se nenapálit</h2>
      <ul>
        <li><strong>Neplaťte předem</strong> lidem, které neznáte. Nejbezpečnější je osobní předání.</li>
        <li><strong>Neklikejte na odkazy</strong> na „kurýra“, „Bazoš platbu“ nebo „platební bránu“ z chatu. Je to nejčastější podvod.</li>
        <li><strong>Nepřecházejte na WhatsApp či Telegram</strong>. V chatu na Férku vás umíme varovat, jinde ne.</li>
        <li><strong>Prověřte si údaje</strong>: telefon, účet nebo odkaz zadejte na <a href="https://www.neklikni.cz" target="_blank" rel="noopener noreferrer">Neklikni.cz</a>.</li>
      </ul>

      <p>
        <strong>Důležité:</strong> Kontrola vychází z hlášení a veřejných seznamů. Nezaručuje, že prodejce je poctivý,
        ani že je nahlášený údaj skutečně podvodný. Poslední rozhodnutí je vždy na vás.
      </p>
    </PageLayout>
  );
}
