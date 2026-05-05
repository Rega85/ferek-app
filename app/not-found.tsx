import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-black text-gray-200 mb-4">404</p>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Stránka nenalezena</h1>
        <p className="text-gray-500 mb-8">
          Tato stránka neexistuje nebo byla přesunuta. Zkontrolujte adresu nebo se vraťte na hlavní stránku.
        </p>
        <Link href="/" className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors inline-block">
          Zpět na hlavní stránku
        </Link>
      </div>
    </div>
  );
}
