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
    .select("id,title,description,price,category,location_city,images,is_boosted,created_at")
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
                Bazar bez podvodníků. Velké fotky, nabídky v okolí a kontrola přes Neklikni.cz.
              </p>
            </div>

            <Link href="/bezpecnost" className="hidden rounded-[20px] bg-black p-5 text-white lg:block hover:bg-gray-900 transition-colors">
              <h2 className="mb-2 text-lg font-black">Jak se nenapálit</h2>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>Neplaťte předem neznámým lidem.</li>
                <li>Neklikejte na odkazy „kurýrních služeb“ z chatu.</li>
                <li>Nejbezpečnější je osobní předání.</li>
              </ul>
              <p className="mt-3 text-xs font-bold text-[#CCFF00]">{count ?? 0} aktivních inzerátů · víc o bezpečnosti →</p>
            </Link>
          </div>

          <form className="mt-7 grid gap-3 sm:grid-cols-[1fr_220px_auto_auto]" action="/">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Co hledáte?"
              className="w-full rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#00BFA6]"
            />
            {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
            <input
              type="search"
              name="city"
              defaultValue={activeCity}
              placeholder="Město nebo okolí"
              className="w-full rounded-[18px] border border-gray-200 bg-white px-5 py-4 text-base outline-none focus:ring-2 focus:ring-[#00BFA6]"
            />
            <button className="rounded-[18px] bg-black px-6 py-3 font-bold text-white transition-colors hover:bg-gray-800">
              Hledat
            </button>
            <Link href="/listing/new" className="rounded-[18px] bg-[#00BFA6] px-6 py-4 text-center font-black text-white transition-colors hover:bg-teal-600">
              Přidat
            </Link>
          </form>

          <div className="mt-3">
            <Link href={`/mapa${activeCity ? `?city=${encodeURIComponent(activeCity)}` : ""}`} className="inline-flex text-sm font-bold text-gray-700 hover:text-black">
              Zobrazit nabídky na Google mapě
            </Link>
          </div>

          <div className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-2">
            <Link href={allHref} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${!activeCategory ? "border-[#00BFA6] bg-[#00BFA6] text-white" : "border-gray-200 bg-white text-gray-700"}`}>
              Vše
            </Link>
            {categories.map((category) => {
              const href = `/?${new URLSearchParams({
                category,
                ...(search ? { q: search } : {}),
                ...(activeCity ? { city: activeCity } : {}),
              }).toString()}`;
              return (
                <Link key={category} href={href} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold ${activeCategory === category ? "border-[#00BFA6] bg-[#00BFA6] text-white" : "border-gray-200 bg-white text-gray-700 hover:border-black"}`}>
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
        className="fixed bottom-20 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFA6] text-4xl text-white shadow-xl md:hidden"
        aria-label="Přidat inzerát"
      >
        +
      </Link>
      <BottomNav />
    </main>
  );
}
