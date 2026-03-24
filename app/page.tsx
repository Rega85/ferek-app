import ListingCard from "@/components/ListingCard";

// Mock data
const mockListings = [
  {
    id: "1",
    title: "iPhone 12 Pro 256GB",
    price: 1500000, // 15,000 Kč
    location: "Praha",
    image: "https://picsum.photos/400/300?random=1",
    isBoosted: true,
    neklikniVerdict: "safe" as const,
  },
  {
    id: "2",
    title: "Kolo Specialized",
    price: 2500000, // 25,000 Kč
    location: "Brno",
    image: "https://picsum.photos/400/300?random=2",
    neklikniVerdict: "warning" as const,
  },
  {
    id: "3",
    title: "Nábytek do kuchyně",
    price: 500000, // 5,000 Kč
    location: "Ostrava",
    image: "https://picsum.photos/400/300?random=3",
  },
  {
    id: "4",
    title: "MacBook Pro 14\"",
    price: 8000000, // 80,000 Kč
    location: "Plzeň",
    image: "https://picsum.photos/400/300?random=4",
    isBoosted: true,
    neklikniVerdict: "safe" as const,
  },
  {
    id: "5",
    title: "Knihy o programování",
    price: 50000, // 500 Kč
    location: "Liberec",
    image: "https://picsum.photos/400/300?random=5",
    neklikniVerdict: "danger" as const,
  },
  {
    id: "6",
    title: "Auto Škoda Fabia",
    price: 15000000, // 150,000 Kč
    location: "České Budějovice",
    image: "https://picsum.photos/400/300?random=6",
  },
];

export default function Home() {
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </main>
  );
}
