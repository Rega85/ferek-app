import ListingCard from "@/components/ListingCard";
import { createClient } from "@/utils/supabase/server";

type ListingFromDb = {
  id: string;
  title: string;
  price: number;
  location_city: string | null;
  images: string[] | null;
  is_boosted: boolean;
  neklikni_verdict: "safe" | "warning" | "danger" | null;
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const city = typeof params.city === 'string' ? params.city : '';

  const supabase = await createClient();
  let query = supabase
    .from<ListingFromDb>("listings")
    .select("id,title,price,location_city,images,is_boosted,neklikni_verdict")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }
  if (city) {
    query = query.ilike("location_city", `%${city}%`);
  }

  const { data: listings, error } = await query;

  if (error) {
    throw new Error(`Nepodařilo se načíst aukce: ${error.message}`);
  }

  const listingItems = (listings ?? []).map((listing) => ({
    id: listing.id,
    title: listing.title,
    price: listing.price,
    location: listing.location_city ?? "Neurčeno",
    image: listing.images?.[0] ?? undefined,
    isBoosted: listing.is_boosted,
    neklikniVerdict: listing.neklikni_verdict ?? undefined,
  }));

  const categories = [
    { id: 'vse', name: 'Vše', icon: '🌍' },
    { id: 'elektronika', name: 'Elektronika', icon: '📱' },
    { id: 'obleceni', name: 'Oblečení', icon: '👕' },
    { id: 'nabytek', name: 'Nábytek', icon: '🛋️' },
    { id: 'auto-moto', name: 'Auto-moto', icon: '🚗' },
  ];

  return (
    <main className="min-h-screen bg-bg">
      {/* Letgo Style Hero Section */}
      <div className="bg-gradient-to-br from-accent to-yellow-300 py-12 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-accent-dark mb-6 tracking-tight">
            Co hledáte?
          </h1>
          
          <form className="bg-white rounded-full p-2 flex flex-col md:flex-row shadow-lg max-w-3xl mx-auto gap-2 items-center" method="GET" action="/">
            <div className="flex-1 w-full flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
              <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Hledat inzeráty..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none"
              />
            </div>
            <div className="flex-1 w-full flex items-center px-4 py-2 md:py-0">
              <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                type="text"
                name="city"
                defaultValue={city}
                placeholder="Celá ČR"
                className="w-full bg-transparent border-none focus:ring-0 text-lg outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-accent-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors mt-2 md:mt-0"
            >
              Hledat
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Categories (Horizontal scroll on mobile) */}
        <div className="flex overflow-x-auto gap-4 pb-4 mb-6 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center justify-center min-w-[80px] p-3 rounded-2xl bg-white shadow-sm border border-border hover:shadow-md hover:border-accent transition-all group shrink-0"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{category.icon}</span>
              <span className="text-xs font-medium text-text-muted group-hover:text-text">{category.name}</span>
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Doporučeno pro vás</h2>

        {/* Feed */}
        {listingItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-1">Nic jsme nenašli</h3>
            <p className="text-gray-500">Zkuste upravit vyhledávání nebo změnit lokalitu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {listingItems.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
