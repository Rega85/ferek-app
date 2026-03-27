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

export default async function Home() {
  const supabase = await createClient();
  const { data: listings, error } = await supabase
    .from<ListingFromDb>("listings")
    .select("id,title,price,location_city,images,is_boosted,neklikni_verdict")
    .eq("status", "active")
    .order("created_at", { ascending: false });

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

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {["elektronika", "obleceni", "nabytek", "auto-moto"].map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-bg-soft text-text-muted rounded-full text-sm hover:bg-accent hover:text-accent-dark transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Město"
              className="px-3 py-2 border border-border rounded-md bg-white text-text"
            />
            <input
              type="number"
              placeholder="Cena od"
              className="px-3 py-2 border border-border rounded-md bg-white text-text"
            />
            <input
              type="number"
              placeholder="Cena do"
              className="px-3 py-2 border border-border rounded-md bg-white text-text"
            />
          </div>
        </div>

        {/* Feed */}
        {listingItems.length === 0 ? (
          <div className="text-center text-text-muted">Žádné aktivní nabídky.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {listingItems.map((listing) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
