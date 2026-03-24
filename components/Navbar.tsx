import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold text-foreground">
          Férek<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/listing/new"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-full font-medium hover:bg-accent/90 transition-opacity"
          >
            Přidat inzerát
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
              Přihlásit se
            </Link>
            <Link href="/auth/register" className="text-accent hover:text-accent/80 font-medium">
              Registrovat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}