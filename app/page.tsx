import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import ListingCard from "@/components/ListingCard";
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

  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select("id,title,description,price,category,location_city,images,is_boosted,neklikni_verdict,created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(48);

  if (activeCategory) {
    query = query.eq("category", activeCategory);
  }

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

  return (
    <main className="min-h-screen bg-gray-50">
      <LandingNavbar />

      <section className="pt-24 sm:pt-28 pb-6 px-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-end">
            <div>
              <p className="inline-flex items-center bg-[#CCFF00] text-black text-xs font-black px-3 py-1 rounded-md mb-4">
                Bezpečný bazar s ochranou Neklikni
              </p>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl">
                Kupujte a prodávejte z druhé ruky bez zbytečného rizika.
              </h1>
              <p className="text-gray-500 text-lg mt-4 max-w-2xl">
                Ferek je marketplace ve stylu Letgo, kde bude každý inzerát a prodejce procházet bezpečnostním ověřením.
              </p>
            </div>

            <div className="bg-black text-white rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-black text-lg">Bezpečnostní stav</h2>
                <span className="bg-[#CCFF00] text-black text-xs font-black px-2 py-1 rounded">Neklikni</span>
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

          <form className="mt-8 grid sm:grid-cols-[1fr_auto_auto] gap-3" action="/">
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Hledat iPhone, kolo, gauč..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#CCFF00]"
            />
            {activeCategory ? <input type="hidden" name="category" value={activeCategory} /> : null}
            <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
              Hledat
            </button>
            <Link href="/listing/new" className="bg-[#CCFF00] text-black px-6 py-3 rounded-lg font-black text-center hover:bg-lime-300 transition-colors">
              Přidat inzerát
            </Link>
          </form>

          <div className="flex overflow-x-auto gap-2 mt-5 pb-2 scrollbar-hide">
            <Link
              href={search ? `/?q=${encodeURIComponent(search)}` : "/"}
              className={`px-4 py-2 rounded-full text-sm font-bold border shrink-0 ${!activeCategory ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200"}`}
            >
              Vše
            </Link>
            {categories.map((category) => {
              const href = `/?category=${encodeURIComponent(category)}${search ? `&q=${encodeURIComponent(search)}` : ""}`;
              return (
                <Link
                  key={category}
                  href={href}
                  className={`px-4 py-2 rounded-full text-sm font-bold border shrink-0 ${activeCategory === category ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-200 hover:border-black"}`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black">Aktuální nabídky</h2>
              <p className="text-gray-500 text-sm mt-1">
                {error ? "Nepodařilo se načíst inzeráty." : `${listings.length} výsledků`}
              </p>
            </div>
            <Link href="/bezpecnost" className="hidden sm:inline text-sm font-bold text-gray-600 hover:text-black">
              Jak ověřujeme bezpečnost
            </Link>
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
              <h3 className="text-xl font-black text-gray-900 mb-2">Zatím tu nic není</h3>
              <p className="text-gray-500 mb-6">
                Přidejte první inzerát a položte základ bezpečného bazaru.
              </p>
              <Link href="/listing/new" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-bold">
                Přidat první inzerát
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
          {[
            ["Ověření inzerátu", "Skóre rizika, podezřelé fráze, extrémní cena a fotky připravené pro Neklikni kontrolu."],
            ["Ověření prodejce", "Trust score, telefon, e-mail, historie účtu a budoucí napojení na identitu prodejce."],
            ["Bezpečný kontakt", "Konverzace držíme v aplikaci, aby šlo včas odhalit phishing a podezřelé odkazy."],
          ].map(([title, text]) => (
            <div key={title} className="bg-white rounded-lg border border-gray-100 p-5">
              <h3 className="font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
