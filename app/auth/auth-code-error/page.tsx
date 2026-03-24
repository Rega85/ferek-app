export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">
            Férek
          </h1>
          <p className="text-muted-foreground mb-8">
            Chyba ověření
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <h2 className="font-semibold mb-2">Ověření se nezdařilo</h2>
          <p className="text-sm">
            Odkaz pro ověření emailu je neplatný nebo vypršel. Zkuste se znovu registrovat nebo kontaktujte podporu.
          </p>
        </div>

        <div className="space-y-4">
          <a
            href="/auth/register"
            className="block w-full bg-accent text-accent-foreground py-3 px-4 rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            Zkusit znovu
          </a>
          <a
            href="/"
            className="block w-full text-muted-foreground hover:text-foreground"
          >
            Zpět na hlavní stránku
          </a>
        </div>
      </div>
    </div>
  )
}