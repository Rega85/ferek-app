import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  location_city: string | null;
  status: string;
  images: string[] | null;
  created_at: string;
};

type Seller = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  trust_score: number;
  is_verified: boolean;
  created_at: string;
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listingData, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listingData) notFound();

  const listing = listingData as Listing;
  const { data: sellerData } = await supabase
    .from("users")
    .select("id, full_name, avatar_url, trust_score, is_verified, created_at")
    .eq("id", listing.user_id)
    .single();

  const seller = sellerData as Seller | null;
  const priceCZK = (listing.price / 100).toLocaleString("cs-CZ");
  const mainImage = listing.images?.[0];
  const allImages = listing.images ?? [];
  const date = new Date(listing.created_at).toLocaleDateString("cs-CZ");
  const isOwner = user?.id === listing.user_id;
  const sellerName = seller?.full_name || "Uživatel Ferek";
  const sellerInitial = sellerName[0]?.toUpperCase() || "U";
  const mapQuery = listing.location_city ? `${listing.location_city}, Česko` : "Česko";

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
            <span className="text-[#00BFA6]">Ferek</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-black text-sm font-medium transition-colors">Zpět na bazar</Link>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {mainImage ? (
                  <img src={mainImage} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-6xl mb-2">+</span>
                    <span className="font-medium">Bez fotky</span>
                  </div>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {allImages.map((img, index) => (
                    <img key={img} src={img} alt={`${listing.title} ${index + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                  ))}
                </div>
              )}
            </div>

            <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h2 className="font-black text-xl mb-3">Popis</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {listing.description || "Prodejce nepřidal popis."}
              </p>
            </section>
          </div>

          <aside className="md:col-span-2 flex flex-col gap-4">
            <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
                {listing.price === 0 ? "Zdarma" : `${priceCZK} Kč`}
              </p>
              <h1 className="text-xl font-bold text-gray-800 mb-4">{listing.title}</h1>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                <span>{listing.location_city || "Neuvedeno"}</span>
                <span>Přidáno {date}</span>
                <span>{listing.category}</span>
                <span>{listing.status === "active" ? "Aktivní" : listing.status}</span>
              </div>
            </section>

            <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#CCFF00] flex items-center justify-center overflow-hidden font-black">
                  {seller?.avatar_url ? <img src={seller.avatar_url} alt="" className="w-full h-full object-cover" /> : sellerInitial}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{sellerName}</p>
                  {seller?.is_verified ? (
                    <p className="text-xs font-bold text-green-700">Ověřený prodejce</p>
                  ) : null}
                </div>
              </div>

              {isOwner ? (
                <Link href="/profile" className="block w-full text-center bg-gray-900 text-white font-bold py-3.5 rounded-[18px] hover:bg-gray-800 transition-colors">
                  Spravovat v profilu
                </Link>
              ) : user ? (
                <form action={`/listing/${listing.id}/contact`} method="post" className="space-y-3">
                  <textarea
                    name="message"
                    required
                    minLength={2}
                    maxLength={1000}
                    defaultValue={`Dobrý den, mám zájem o inzerát "${listing.title}". Je ještě dostupný?`}
                    className="w-full min-h-28 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCFF00]"
                  />
                  <button className="w-full bg-[#00BFA6] text-white font-black py-4 rounded-[18px] hover:bg-teal-600 transition-colors">
                    Napsat prodejci
                  </button>
                </form>
              ) : (
                <Link href={`/auth/login?next=/listing/${listing.id}`} className="block w-full text-center bg-[#00BFA6] text-white font-black py-4 rounded-[18px] hover:bg-teal-600 transition-colors">
                  Přihlásit se a napsat
                </Link>
              )}
            </section>

            <section className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
              <h2 className="font-black text-lg mb-3">Jak se nenapálit</h2>
              <ul className="space-y-2 text-sm text-gray-600 list-disc pl-5">
                <li>Neplaťte předem, pokud prodejce neznáte. Nejbezpečnější je osobní předání.</li>
                <li>Neklikejte na odkazy na „kurýra“ nebo „platební bránu“, které vám někdo pošle v chatu.</li>
                <li>Telefon, účet nebo odkaz si můžete prověřit na <a href="https://www.neklikni.cz" target="_blank" rel="noopener noreferrer" className="font-bold underline">Neklikni.cz</a>.</li>
              </ul>
            </section>

            <section className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5">
                <h2 className="font-black text-lg">Lokalita</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {listing.location_city || "Prodejce neuvedl město."}
                </p>
              </div>
              <iframe
                title="Mapa lokality inzerátu"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="w-full h-56 border-0"
                loading="lazy"
              />
              <div className="p-5 pt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold text-gray-700 hover:text-black"
                >
                  Otevřít lokalitu v Google Maps
                </a>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
