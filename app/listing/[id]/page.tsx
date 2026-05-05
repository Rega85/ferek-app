import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let listing: Record<string, unknown> | null = null;
  let profile: Record<string, unknown> | null = null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("listings").select("*").eq("id", id).single();
    if (error || !data) notFound();
    listing = data;

    const { data: profileData } = await supabase.from("profiles").select("full_name, avatar_url").eq("id", listing!.user_id as string).single();
    profile = profileData;
  } catch {
    notFound();
  }

  if (!listing) notFound();

  const price = listing.price as number;
  const priceCZK = (price / 100).toLocaleString("cs-CZ");
  const mainImage = (listing.images as string[] | null)?.[0];
  const allImages = (listing.images as string[] | null) ?? [];
  const date = new Date(listing.created_at as string).toLocaleDateString("cs-CZ");
  const verdict = listing.neklikni_verdict as string | null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tight">
            Férek<span className="text-[#CCFF00]">.</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-black text-sm font-medium transition-colors">← Zpět</Link>
        </div>
      </nav>

      <div className="pt-20 max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Images (3/5) */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <div className="aspect-[4/3] bg-gray-100 relative">
                {mainImage ? (
                  <img src={mainImage} alt={listing.title as string} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <span className="text-6xl mb-2">📷</span>
                    <span className="font-medium">Bez fotky</span>
                  </div>
                )}
                {verdict && (
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 ${
                      verdict === "safe" ? "bg-green-500 text-white" : verdict === "warning" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {verdict === "safe" ? "✓ Ověřený" : verdict === "warning" ? "⚠ Opatrně" : "✕ Podezřelý"}
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 shrink-0" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info (2/5) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
                {price === 0 ? "Zdarma" : `${priceCZK} Kč`}
              </p>
              <h1 className="text-lg font-semibold text-gray-700 mb-4">{listing.title as string}</h1>
              <div className="flex items-center text-gray-500 text-sm gap-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {(listing.location_city as string) || "Neurčeno"}
                </span>
                <span>Přidáno {date}</span>
              </div>
            </div>

            {/* Seller */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {(profile as Record<string, unknown>)?.avatar_url ? (
                    <img src={(profile as Record<string, unknown>).avatar_url as string} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-gray-500">{((profile as Record<string, unknown>)?.full_name as string || "U")[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{(profile as Record<string, unknown>)?.full_name as string || "Uživatel Férek"}</p>
                  <p className="text-xs text-gray-500">Prodejce</p>
                </div>
              </div>
              <button className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex justify-center items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Napsat prodejci
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-3">Popis</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm">
                {(listing.description as string) || "Bez popisu."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}