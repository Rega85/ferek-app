import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold text-text">
          Férek<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/listing/new"
            className="bg-accent text-accent-dark px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Přidat inzerát
          </Link>
          <Link href="/auth/login" className="text-text-muted hover:text-text">
            Přihlásit se
          </Link>
        </div>
      </div>
    </nav>
  );
}