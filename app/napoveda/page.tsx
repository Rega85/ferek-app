import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Nápověda – Férek",
  description: "Časté otázky a odpovědi k používání Férek.",
};

const faqs = [
  {
    q: "Jak přidám inzerát?",
    a: 'Klikněte na tlačítko "Začít prodávat" na hlavní stránce. Vyfoťte zboží, přidejte popis a cenu. Kontaktní údaje v inzerátu zkontrolujeme v databázi Neklikni.cz a inzerát zveřejníme.',
  },
  {
    q: "Je Férek zdarma?",
    a: "Ano, základní inzerování na Férek je zcela zdarma. Vložení inzerátu, nákup i prodej jsou zdarma. Za poplatek budou volitelné služby jako topování, zvýraznění inzerátu nebo štítek ověřeného prodejce.",
  },
  {
    q: "Co je Neklikni.cz?",
    a: "Neklikni.cz je databáze nahlášených podvodných telefonů, účtů, e-mailů a webů, kterou provozuje stejná společnost jako Férek (PK Virgine, s.r.o.). Férek s ní porovnává údaje v inzerátech a zprávách.",
  },
  {
    q: "Co znamenají barevné štítky u inzerátů?",
    a: 'Šedý štítek „Zkontrolováno“ znamená, že údaje v inzerátu nikdo na Neklikni.cz nenahlásil. Není to záruka poctivosti. Oranžový štítek znamená, že některý údaj už někdo nahlásil, takže buďte opatrní a neplaťte předem. Podrobnosti najdete na stránce Bezpečnost.',
  },
  {
    q: "Jak probíhá komunikace s prodejcem?",
    a: "Po rozkliknutí inzerátu můžete prodejci napsat přímo přes vestavěný chat. Komunikace probíhá v rámci platformy pro vaši bezpečnost.",
  },
  {
    q: "Mohu si stěžovat na inzerát?",
    a: "Ano. Napište nám odkaz na inzerát a důvod. Každé nahlášení prověříme a v případě porušení pravidel inzerát odstraníme.",
  },
  {
    q: "Jak smažu svůj účet?",
    a: 'Napište nám z e-mailu, se kterým jste registrovaní. Vaše osobní údaje do 30 dnů odstraníme, s výjimkou údajů, které jsme povinni uchovávat ze zákona.',
  },
  {
    q: "Můj inzerát čeká na kontrolu nebo má oranžový štítek. Co mám dělat?",
    a: "Znamená to, že některý údaj z inzerátu (telefon, účet, odkaz) už někdo nahlásil na Neklikni.cz. Může jít o omyl nebo zneužité číslo. Napište nám a údaj prověříme ručně.",
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
