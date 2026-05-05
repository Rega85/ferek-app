import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";

type ListingDetail = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location_city: string | null;
  images: string[] | null;
  is_boosted: boolean;
  neklikni_verdict: "safe" | "warning" | "danger" | null;
  user_id: string;
  created_at: string;
};

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();
    
  const listing = data as ListingDetail | null;

  if (error || !listing) {
    notFound();
  }

  // Zkusíme načíst profil uživatele (prodejce) - předpokládáme tabulku profiles
  // Pokud neexistuje, použijeme fallback
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", listing.user_id)
    .single();
    
  const profile = profileData as UserProfile | null;

  const priceCZK = (listing.price / 100).toLocaleString("cs-CZ");
  const mainImage = listing.images?.[0];
  const date = new Date(listing.created_at).toLocaleDateString("cs-CZ");

  return (
    <main className="min-h-screen bg-bg py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back button */}
        <Link href="/" className="inline-flex items-center text-text-muted hover:text-text mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zpět na výsledky
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-border">
          <div className="flex flex-col md:flex-row">
            
            {/* Image Gallery (Left Side) */}
            <div className="w-full md:w-3/5 bg-gray-100 min-h-[400px] md:min-h-[600px] relative">
              {mainImage ? (
                <img src={mainImage} alt={listing.title} className="w-full h-full object-cover absolute inset-0" />
              ) : (
                <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-lg font-medium">Obrázek není k dispozici</span>
                </div>
              )}
              
              {/* Neklikni Verdict Badge na fotce */}
              {listing.neklikni_verdict && (
                <div className="absolute top-4 left-4">
                  {listing.neklikni_verdict === "safe" && (
                    <div className="bg-accent text-accent-dark px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Ověřený inzerát
                    </div>
                  )}
                  {listing.neklikni_verdict === "warning" && (
                    <div className="bg-warning text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Buďte opatrní
                    </div>
                  )}
                  {listing.neklikni_verdict === "danger" && (
                    <div className="bg-danger text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Podezřelý inzerát!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Info (Right Side) */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col h-full border-l border-border">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                <p className="text-4xl font-extrabold text-gray-900 mb-4">{priceCZK} Kč</p>
                <div className="flex items-center text-gray-500 mb-6">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-lg">{listing.location_city || "Neurčeno"}</span>
                  <span className="mx-3">•</span>
                  <span>Přidáno {date}</span>
                </div>
              </div>

              {/* Popis */}
              <div className="mb-8 flex-grow">
                <h3 className="font-semibold text-lg mb-3">Popis</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {listing.description || "Tento inzerát zatím nemá žádný popis."}
                </p>
              </div>

              {/* Seller & CTA (Always at bottom) */}
              <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Seller" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-gray-500">{(profile?.full_name || "U")[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile?.full_name || "Uživatel Férek"}</p>
                    <p className="text-sm text-gray-500">Prodejce</p>
                  </div>
                </div>

                <button className="w-full bg-accent-dark text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg flex justify-center items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Napsat prodejci
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}