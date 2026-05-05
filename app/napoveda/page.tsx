import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Nápověda – Férek",
  description: "Časté otázky a odpovědi k používání Férek.",
};

const faqs = [
  {
    q: "Jak přidám inzerát?",
    a: 'Klikněte na tlačítko "Začít prodávat" na hlavní stránce. Vyfoťte zboží, přidejte popis a cenu. Inzerát bude automaticky ověřen technologií Neklikni a publikován.',
  },
  {
    q: "Je Férek zdarma?",
    a: "Ano, základní inzerování na Férek je zcela zdarma. V budoucnu plánujeme prémiové funkce (zvýraznění inzerátu, prioritní ověření), které budou za poplatek.",
  },
  {
    q: "Co je technologie Neklikni?",
    a: "Neklikni je proprietární AI systém vyvinutý společností PK Virgine, s.r.o. Automaticky analyzuje inzeráty a detekuje podezřelé nabídky, kradené fotky a podvodné prodejce.",
  },
  {
    q: "Co znamenají barevné štítky u inzerátů?",
    a: 'Zelený štítek "Ověřeno" znamená, že inzerát prošel kontrolou. Žlutý upozorňuje na podezřelé prvky. Červený označuje pravděpodobný podvod — nedoporučujeme s takovým prodejcem komunikovat.',
  },
  {
    q: "Jak probíhá komunikace s prodejcem?",
    a: "Po rozkliknutí inzerátu můžete prodejci napsat přímo přes vestavěný chat. Komunikace probíhá v rámci platformy pro vaši bezpečnost.",
  },
  {
    q: "Mohu si stěžovat na inzerát?",
    a: "Ano. U každého inzerátu najdete možnost nahlásit nevhodný obsah. Náš tým každé nahlášení prověří a v případě porušení pravidel inzerát odstraní.",
  },
  {
    q: "Jak smažu svůj účet?",
    a: 'V nastavení profilu najdete možnost "Smazat účet". Vaše osobní údaje budou do 30 dnů odstraněny, s výjimkou údajů, které jsme povinni uchovávat ze zákona.',
  },
  {
    q: "Neklikni mi označil můj inzerát jako podezřelý. Co mám dělat?",
    a: "Zkontrolujte, zda inzerát neobsahuje prvky, které by mohly vypadat podezřele (příliš nízká cena, neobvyklý popis). Upravte inzerát a systém ho automaticky přehodnotí. Pokud si myslíte, že se jedná o chybu, kontaktujte nás.",
  },
];

export default function HelpPage() {
  return (
    <PageLayout title="Nápověda" subtitle="Odpovědi na nejčastější otázky">
      <div className="not-prose space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between cursor-pointer p-5 sm:p-6 font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
              <span>{faq.q}</span>
              <svg className="w-5 h-5 text-gray-400 shrink-0 ml-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
              {faq.a}
            </div>
          </details>
        ))}
      </div>

      <h2>Nenašli jste odpověď?</h2>
      <p>
        Napište nám na <a href="mailto:info@neklikni.cz">info@neklikni.cz</a> nebo navštivte 
        stránku <a href="/kontakt">Kontakt</a>. Odpovídáme do 24 hodin v pracovní dny.
      </p>
    </PageLayout>
  );
}
