import PageLayout from "@/components/PageLayout";

export const metadata = {
  title: "Kontakt – Férek",
  description: "Kontaktujte tým Férek. Jsme tu pro vás.",
};

export default function ContactPage() {
  return (
    <PageLayout title="Kontakt" subtitle="Máte otázku nebo problém? Napište nám.">
      <h2>Kontaktní údaje</h2>
      <div className="not-prose bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 my-8">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 font-medium">Provozovatel</p>
            <p className="text-lg font-bold text-gray-900">PK Virgine, s.r.o.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 font-medium">Sídlo</p>
              <p className="text-gray-900">Korunní 2569/108<br />Vinohrady, 101 00 Praha</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Identifikace</p>
              <p className="text-gray-900">IČO: 21448507<br />DIČ: CZ21448507</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Datová schránka</p>
              <p className="text-gray-900 font-mono">bty8mey</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Spisová značka</p>
              <p className="text-gray-900">C 401405/MSPH<br />Městský soud v Praze</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">E-mail</p>
            <p className="text-gray-900">
              <a href="mailto:info@neklikni.cz" className="text-black font-semibold underline decoration-[#CCFF00] decoration-2 underline-offset-2 hover:decoration-black">
                info@neklikni.cz
              </a>
            </p>
          </div>
        </div>
      </div>

      <h2>Rychlá nápověda</h2>
      <p>
        Než nám napíšete, podívejte se prosím do sekce <a href="/napoveda">Nápověda</a>, 
        kde najdete odpovědi na nejčastější otázky. Většinu problémů vyřešíte rychleji sami.
      </p>
      <p>
        Na e-maily odpovídáme zpravidla do <strong>24 hodin</strong> v pracovní dny (Po–Pá, 9:00–17:00).
      </p>
    </PageLayout>
  );
}
