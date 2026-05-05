import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Bezpečnost – Férek",
  description: "Jak technologie Neklikni chrání vaše nákupy a prodeje na Férek.",
};

export default function SecurityPage() {
  return (
    <PageLayout title="Bezpečnost" subtitle="Jak vás chráníme při každém nákupu i prodeji">
      <h2>Technologie Neklikni</h2>
      <p>
        Férek je první české tržiště, které využívá <strong>umělou inteligenci k automatickému ověřování inzerátů</strong>. 
        Naše proprietární technologie Neklikni, vyvinutá ve spolupráci s <a href="https://neklikni.cz" target="_blank" rel="noopener noreferrer">NeKlikni.cz</a>, 
        analyzuje každý inzerát v reálném čase a přiřazuje mu bezpečnostní verdikt.
      </p>

      <h2>Tři úrovně hodnocení</h2>
      <div className="not-prose space-y-4 my-8">
        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="w-4 h-4 bg-green-500 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-green-900">Ověřený inzerát</p>
            <p className="text-green-800 text-sm mt-1">Inzerát prošel kontrolou a nebyly nalezeny žádné podezřelé prvky. Můžete nakupovat s důvěrou.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="w-4 h-4 bg-yellow-500 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-yellow-900">Upozornění</p>
            <p className="text-yellow-800 text-sm mt-1">Inzerát obsahuje některé podezřelé prvky. Doporučujeme zvýšenou opatrnost a ověření prodejce před platbou.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="w-4 h-4 bg-red-500 rounded-full mt-1 shrink-0"></div>
          <div>
            <p className="font-bold text-red-900">Podezřelý inzerát</p>
            <p className="text-red-800 text-sm mt-1">Inzerát vykazuje známky podvodu. Nedoporučujeme komunikaci s prodejcem ani platbu.</p>
          </div>
        </div>
      </div>

      <h2>Co kontrolujeme</h2>
      <ul>
        <li><strong>Fotografie</strong> — Detekce kradených a stockových fotek</li>
        <li><strong>Text inzerátu</strong> — Analýza podezřelých frází a urgentního jazyka</li>
        <li><strong>Cenová anomálie</strong> — Porovnání s tržní cenou podobných produktů</li>
        <li><strong>Historie prodejce</strong> — Kontrola aktivity a reputace</li>
        <li><strong>Kontaktní údaje</strong> — Ověření konzistence a důvěryhodnosti</li>
      </ul>

      <h2>Vaše bezpečnost je naše priorita</h2>
      <p>
        Analyzované texty a obrázky nejsou trvale ukládány a nejsou sdíleny s třetími stranami mimo zpracování analýzy. 
        Vaše soukromí je pro nás stejně důležité jako vaše bezpečnost.
      </p>
      <p>
        <strong>Důležité upozornění:</strong> Výsledky analýzy jsou generovány umělou inteligencí a mají informativní charakter. 
        Technologie se může mýlit — poslední rozhodnutí je vždy na vás.
      </p>
    </PageLayout>
  );
}
