import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import ListingCard from "@/components/ListingCard";
import BottomNav from "@/components/BottomNav";
import { createClient } from "@/utils/supabase/server";

type Listing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  location_city: string | null;
  images: string[] | null;
  is_boosted: boolean;
  neklikni_verdict: "safe" | "warning" | "danger" | null;
  created_at: string;
};

type HomeProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    city?: string;
  }>;
};

const categories = [
  "Elektronika",
  "Oblečení",
  "Domácnost",
  "Auto-moto",
  "Sport",
  "Zvířata",
  "Knihy",
  "Hračky",
  "Ostatní",
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const search = params?.q?.trim() ?? "";
  const activeCategory = params?.category?.trim() ?? "";
  const activeCity = params?.city?.trim() ?? "";

  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select("id,title,description,price,category,location_city,images,is_boosted,neklikni_verdict,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  if (activeCategory) query = query.eq("category", activeCategory);
  if (activeCity) query = query.ilike("location_city", `%${activeCity}%`);

  const [{ data, error }, { count }] = await Promise.all([
    query,
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
  ]);

  const listings = ((data ?? []) as Listing[]).filter((listing) => {
    if (!search) return true;
    const haystack = `${listing.title} ${listing.description ?? ""} ${listing.location_city ?? ""}`.toLocaleLowerCase("cs-CZ");
    return haystack.includes(search.toLocaleLowerCase("cs-CZ"));
  });
  const verifiedCount = listings.filter((listing) => listing.neklikni_verdict === "safe").length;
  const allHref = `/${search || activeCity ? `?${new URLSearchParams({ ...(search ? { q: search } : {}), ...(activeCity ? { city: activeCity } : {}) }).toString()}` : ""}`;

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <LandingNavbar />

      <section className="bg-white px-4 pb-4 pt-28 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="sr-only">Ferek bazar</h1>
              <p className="max-w-2xl text-base text-gray-500 sm:text-lg">
                Bezpečný bazar ve stylu Letgo. Velké fotky, nabídky v okolí a Neklikni ochrana u každého důležitého kroku.
              </p>
            </div>

            <div className="hidden rounded-[20px] bg-black p-5 text-white lg:block">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black">Bezpečnostní stav</h2>
                <span className="rounded-lg bg-[#ff5a1f] px-2 py-1 text-xs font-black text-white">Neklikni</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-black">{count ?? 0}</p>
                  <p className="text-xs text-gray-400">aktivních</p>
                </div>
                <div>
                  <p className="text-2xl font-black">{verifiedCount}</p>
                  <p className="text-xs text-gray-400">ověřených</p>
                </div>
                <div>
                  <p className="text-2xl font-black">0</p>
                  <p className="text-xs text-gray-400">skrytých rizik</p>
                </div>
              </div>
            </div>
          </div>

          <form className="mt-7 grid gap-3 sm:grid-cols-[1fr_220px_auto_auto]" action="/">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Co hledáte?"
              className="w-full rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#ff5a1f]"
            />
            {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
            <input
              type="search"
              name="city"
              defaultValue={activeCity}
              placeholder="Město nebo okolí"
              className="w-full rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#ff5a1f]"
            />
            <button className="rounded-[18px] bg-black px-6 py-3 font-bold text-white transition-colors hover:bg-gray-800">
              Hledat
            </button>
            <Link href="/listing/new" className="rounded-[18px] bg-[#ff5a1f] px-6 py-4 text-center font-black text-white transition-colors hover:bg-orange-600">
              Přidat
            </Link>
          </form>

          <div className="mt-3">
            <Link href={`/mapa${activeCity ? `?city=${encodeURIComponent(activeCity)}` : ""}`} className="inline-flex text-sm font-bold text-gray-700 hover:text-black">
              Zobrazit nabídky na Google mapě
            </Link>
          </div>

          <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-2">
            <Link href={allHref} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${!activeCategory ? "border-[#ff5a1f] bg-[#ff5a1f] text-white" : "border-gray-200 bg-white text-gray-700"}`}>
              Vše
            </Link>
            {categories.map((category) => {
              const href = `/?${new URLSearchParams({
                category,
                ...(search ? { q: search } : {}),
                ...(activeCity ? { city: activeCity } : {}),
              }).toString()}`;
              return (
                <Link key={category} href={href} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${activeCategory === category ? "border-[#ff5a1f] bg-[#ff5a1f] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-black"}`}>
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-4 sm:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">Aktuální nabídky</h2>
              <p className="mt-1 text-sm text-gray-500">
                {error ? "Nepodařilo se načíst inzeráty." : `${listings.length} výsledků`}
              </p>
            </div>
            <Link href="/bezpecnost" className="hidden text-sm font-bold text-gray-600 hover:text-black sm:inline">
              Jak ověřujeme bezpečnost
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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
            <div className="rounded-[20px] border border-dashed border-gray-300 bg-white p-10 text-center">
              <h3 className="mb-2 text-xl font-black text-gray-900">Zatím tu nic není</h3>
              <p className="mb-6 text-gray-500">Přidejte první inzerát a položte základ bezpečného bazaru.</p>
              <Link href="/listing/new" className="inline-block rounded-[18px] bg-black px-6 py-3 font-bold text-white">
                Přidat první inzerát
              </Link>
            </div>
          )}
        </div>
      </section>

      <Link
        href="/listing/new"
        className="fixed bottom-20 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff5a1f] text-4xl text-white shadow-xl md:hidden"
        aria-label="Přidat inzerát"
      >
        +
      </Link>
      <BottomNav />
    </main>
  );
}
