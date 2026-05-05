import Link from "next/link";

export default function PageLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
            Férek<span className="text-[#CCFF00]">.</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-black text-sm font-medium transition-colors">
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-28 pb-12 bg-gray-50 border-b border-gray-100 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500 text-lg">{subtitle}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        <div className="prose prose-gray prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-li:text-gray-600
          prose-strong:text-gray-900
          prose-a:text-black prose-a:underline prose-a:decoration-[#CCFF00] prose-a:decoration-2 prose-a:underline-offset-2 hover:prose-a:decoration-black
        ">
          {children}
        </div>
      </div>

      {/* Footer */}
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
                <li><Link href="/" className="hover:text-white transition-colors">Prohlížet inzeráty</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Přidat inzerát</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Kategorie</Link></li>
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
