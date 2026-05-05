import Link from "next/link";

const mockListings = [
  { id: 1, title: "iPhone 15 Pro Max 256GB", price: "28 900", location: "Praha", img: "📱", badge: "safe" },
  { id: 2, title: "Kožená bunda Hugo Boss", price: "4 200", location: "Brno", img: "🧥", badge: "safe" },
  { id: 3, title: "MacBook Air M2 2023", price: "22 000", location: "Ostrava", img: "💻", badge: "safe" },
  { id: 4, title: "Retro křeslo 60. léta", price: "3 500", location: "Plzeň", img: "🪑", badge: null },
  { id: 5, title: "PlayStation 5 + 2 hry", price: "11 500", location: "Liberec", img: "🎮", badge: "safe" },
  { id: 6, title: "Trek Marlin 7 2024", price: "18 900", location: "Olomouc", img: "🚲", badge: null },
];

const categories = [
  { icon: "📱", name: "Elektronika" },
  { icon: "👕", name: "Oblečení" },
  { icon: "🚗", name: "Auto-moto" },
  { icon: "🛋️", name: "Nábytek" },
  { icon: "🏠", name: "Bydlení" },
  { icon: "🎮", name: "Sport & Hobby" },
  { icon: "📚", name: "Knihy" },
  { icon: "👶", name: "Pro děti" },
];

const steps = [
  { num: "1", icon: "📸", title: "Vyfoťte", desc: "Stačí pár fotek z mobilu a krátký popis." },
  { num: "2", icon: "🛡️", title: "Ověříme", desc: "Náš systém Neklikni automaticky zkontroluje bezpečnost." },
  { num: "3", icon: "💬", title: "Prodejte", desc: "Domluvte se s kupujícím přímo v chatu." },
];

const stats = [
  { value: "50 000+", label: "Aktivních inzerátů" },
  { value: "120 000+", label: "Spokojených uživatelů" },
  { value: "99,2 %", label: "Bezpečných transakcí" },
  { value: "< 24h", label: "Průměrný čas prodeje" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
            Férek<span className="text-[#CCFF00]">.</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="#jak-to-funguje" className="text-gray-500 hover:text-black text-sm font-medium hidden md:block transition-colors">
              Jak to funguje
            </Link>
            <Link href="#bezpecnost" className="text-gray-500 hover:text-black text-sm font-medium hidden md:block transition-colors">
              Bezpečnost
            </Link>
            <Link href="/listing/new" className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
              Začít prodávat
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 bg-gradient-to-b from-[#f0ffe0] via-white to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-[#CCFF00]/30 text-black text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in-up">
              🛡️ S ochranou Neklikni
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 animate-fade-in-up-delay-1">
              Prodej cokoliv.<br />
              <span className="bg-[#CCFF00] px-3 py-1 rounded-lg inline-block mt-2">Bezpečně.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto mb-10 animate-fade-in-up-delay-2">
              První české tržiště, které ověřuje inzeráty za vás. Žádné podvody, žádný stres.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 animate-fade-in-up-delay-3">
              <Link href="/listing/new" className="bg-black text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
                Prohlížet nabídky
              </Link>
              <Link href="#jak-to-funguje" className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-bold hover:border-black hover:text-black transition-all">
                Jak to funguje?
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mb-16 animate-fade-in-up-delay-3">
            <div className="bg-white border-2 border-gray-100 rounded-full p-2 flex items-center shadow-lg hover:shadow-xl hover:border-[#CCFF00] transition-all">
              <div className="flex-1 flex items-center px-4">
                <svg className="w-5 h-5 text-gray-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Co hledáte? Např. iPhone, kolo, gauč..." className="w-full bg-transparent text-base sm:text-lg outline-none placeholder:text-gray-400" />
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shrink-0">
                Hledat
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto gap-3 sm:gap-4 pb-4 scrollbar-hide justify-start sm:justify-center -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button key={cat.name} className="flex flex-col items-center min-w-[72px] sm:min-w-[90px] p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-[#CCFF00] hover:shadow-lg transition-all group shrink-0">
                <span className="text-2xl sm:text-3xl mb-1.5 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 group-hover:text-black">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOCK LISTINGS ═══ */}
      <section className="py-16 sm:py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">Právě v nabídce</h2>
              <p className="text-gray-500 mt-1">Ověřené inzeráty od skutečných lidí</p>
            </div>
            <Link href="#" className="text-sm font-bold text-black hover:text-gray-600 hidden sm:block transition-colors">
              Zobrazit vše →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {mockListings.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#CCFF00]/50">
                  <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50 relative flex items-center justify-center overflow-hidden">
                    <span className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform duration-500">{item.img}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    {item.badge && (
                      <div className="absolute top-2.5 left-2.5 bg-[#CCFF00] text-black text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        Ověřeno
                      </div>
                    )}
                    <div className="absolute bottom-2.5 left-2.5 text-white">
                      <p className="text-lg sm:text-xl font-extrabold drop-shadow-lg">{item.price} Kč</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ JAK TO FUNGUJE ═══ */}
      <section id="jak-to-funguje" className="py-20 sm:py-28 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-4">Prodej ve 3 krocích</h2>
          <p className="text-gray-500 text-lg mb-16 max-w-xl mx-auto">Jednodušší to už být nemůže. Vyfotíte, přidáte a máte hotovo.</p>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-10">
            {steps.map((step) => (
              <div key={step.num} className="group">
                <div className="w-20 h-20 bg-gray-50 group-hover:bg-[#CCFF00]/20 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-colors">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BEZPEČNOST (NEKLIKNI) ═══ */}
      <section id="bezpecnost" className="py-20 sm:py-28 px-4 bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-[#CCFF00]/20 text-[#CCFF00] text-sm font-bold px-4 py-1.5 rounded-full mb-6">
                🛡️ Technologie Neklikni
              </div>
              <h2 className="text-3xl sm:text-5xl font-black mb-6 leading-tight">
                Nakupujte<br />bez obav.
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Každý inzerát na Férku prochází naší proprietární kontrolou <strong className="text-white">Neklikni</strong>. Automaticky detekujeme podezřelé nabídky, kradené zboží a podvodné prodejce ještě předtím, než na ně kliknete.
              </p>
              <div className="space-y-4">
                {[
                  { color: "bg-green-500", text: "Ověřený inzerát – vše v pořádku" },
                  { color: "bg-yellow-500", text: "Upozornění – buďte opatrní" },
                  { color: "bg-red-500", text: "Podezřelý – nedoporučujeme" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full shrink-0`}></div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-64 h-[420px] sm:w-72 sm:h-[480px] bg-gray-900 rounded-[2.5rem] border-4 border-gray-800 p-3 shadow-2xl animate-float">
                <div className="w-full h-full bg-gray-950 rounded-[2rem] overflow-hidden flex flex-col">
                  <div className="bg-[#CCFF00] px-4 py-3 flex items-center justify-between">
                    <span className="font-black text-black text-sm">Férek.</span>
                    <span className="text-black/60 text-xs font-semibold">Neklikni ✓</span>
                  </div>
                  <div className="p-3 space-y-2 flex-1">
                    {[
                      { t: "iPhone 15 Pro", p: "28 900 Kč", s: "safe" },
                      { t: "AirPods Pro 2", p: "3 200 Kč", s: "safe" },
                      { t: "PS5 SUPER LEVNĚ!!!", p: "2 000 Kč", s: "danger" },
                    ].map((card) => (
                      <div key={card.t} className={`rounded-xl p-3 border ${card.s === "danger" ? "bg-red-950/50 border-red-800/50" : "bg-gray-900 border-gray-800"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white text-xs font-semibold">{card.t}</p>
                            <p className="text-gray-500 text-[10px]">{card.p}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${card.s === "safe" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                            {card.s === "safe" ? "✓ Ověřeno" : "⚠ Podezřelé"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATISTIKY ═══ */}
      <section className="py-16 sm:py-20 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-black mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 sm:py-28 px-4 bg-[#CCFF00]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-black mb-4 text-black">Připraveni prodávat?</h2>
          <p className="text-black/60 text-lg mb-10 max-w-lg mx-auto">
            Přidejte svůj první inzerát za méně než minutu. Je to zdarma a trvá to jen chvilku.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/listing/new" className="bg-black text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5">
              Přidat inzerát zdarma
            </Link>
            <Link href="#jak-to-funguje" className="border-2 border-black/20 text-black px-10 py-4 rounded-full text-lg font-bold hover:border-black transition-all">
              Zjistit více
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-black text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h3 className="text-2xl font-black mb-4">Férek<span className="text-[#CCFF00]">.</span></h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Férové tržiště, kde vás nenapálí. S technologií Neklikni nakupujete bezpečně.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Tržiště</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="#" className="hover:text-white transition-colors">Prohlížet inzeráty</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Přidat inzerát</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Kategorie</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Společnost</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/o-nas" className="hover:text-white transition-colors">O nás</Link></li>
                <li><Link href="/bezpecnost" className="hover:text-white transition-colors">Bezpečnost</Link></li>
                <li><Link href="/kontakt" className="hover:text-white transition-colors">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-4">Podpora</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/napoveda" className="hover:text-white transition-colors">Nápověda</Link></li>
                <li><Link href="/podminky" className="hover:text-white transition-colors">Podmínky použití</Link></li>
                <li><Link href="/ochrana-soukromi" className="hover:text-white transition-colors">Ochrana soukromí</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 Férek. Všechna práva vyhrazena.</p>
            <p className="text-gray-700 text-xs">Chráněno technologií <span className="text-[#CCFF00] font-bold">Neklikni</span></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
