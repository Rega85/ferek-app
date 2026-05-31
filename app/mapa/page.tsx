import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import ListingCard from "@/components/ListingCard";
import { createClient } from "@/utils/supabase/server";

type Listing = {
  id: string;
  title: string;
  price: number;
  location_city: string | null;
  images: string[] | null;
  is_boosted: boolean;
  neklikni_verdict: "safe" | "warning" | "danger" | null;
};

type MapPageProps = {
  searchParams?: Promise<{
    city?: string;
    q?: string;
  }>;
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const city = params?.city?.trim() ?? "";
  const search = params?.q?.trim() ?? "";
  const mapQuery = city ? `${city}, Česko bazar` : "Česko bazar";

  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select("id,title,price,location_city,images,is_boosted,neklikni_verdict")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  if (city) {
    query = query.ilike("location_city", `%${city}%`);
  }

  const { data } = await query;
  const listings = ((data ?? []) as Listing[]).filter((listing) => {
    if (!search) return true;
    return `${listing.title} ${listing.location_city ?? ""}`.toLocaleLowerCase("cs-CZ").includes(search.toLocaleLowerCase("cs-CZ"));
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <LandingNavbar />

      <section className="pt-24 sm:pt-28 px-4 pb-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
            <div>
              <p className="inline-flex bg-[#CCFF00] text-black text-xs font-black px-3 py-1 rounded-md mb-4">
                Mapové vyhledávání
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Inzeráty v okolí</h1>
              <p className="text-gray-500 mt-3 max-w-2xl">
                Vyhledejte nabídky podle města a otevřete je přímo na Google Maps.
              </p>
            </div>
            <Link href="/" className="text-sm font-bold text-gray-600 hover:text-black">
              Zpět na všechny inzeráty
            </Link>
          </div>

          <form className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 mb-5" action="/mapa">
            <input
              name="city"
              defaultValue={city}
              placeholder="Praha, Brno, Ostrava..."
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#CCFF00]"
            />
            <input
              name="q"
              defaultValue={search}
              placeholder="Co hledáte?"
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#CCFF00]"
            />
            <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
              Najít v okolí
            </button>
          </form>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5">
            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 min-h-[360px]">
              <iframe
                title="Google mapa okolí"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
                className="w-full h-[360px] lg:h-[520px] border-0"
                loading="lazy"
              />
            </div>
            <div className="bg-black text-white rounded-lg p-5">
              <h2 className="font-black text-xl mb-2">Jak to použít</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Zadejte město, kde chcete nakupovat. Ferek zobrazí inzeráty z dané lokality a mapa vám pomůže rychle odhadnout, jestli je nabídka ve vašem dosahu.
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-[#CCFF00] text-black px-5 py-3 rounded-lg font-black"
              >
                Otevřít v Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black">Nabídky {city ? `v okolí ${city}` : "v okolí"}</h2>
              <p className="text-sm text-gray-500">{listings.length} výsledků</p>
            </div>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location_city ?? ""}
                  image={listing.images?.[0]}
                  isBoosted={listing.is_boosted}
                  neklikniVerdict={listing.neklikni_verdict ?? undefined}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-lg p-10 text-center">
              <h3 className="text-xl font-black mb-2">V této lokalitě zatím nic není</h3>
              <p className="text-gray-500 mb-6">Zkuste jiné město nebo přidejte první inzerát v okolí.</p>
              <Link href="/listing/new" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold">
                Přidat inzerát
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
