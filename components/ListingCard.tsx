import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  price: number; // v haléřích
  location: string;
  image?: string;
  isBoosted?: boolean;
  neklikniVerdict?: "safe" | "warning" | "danger";
}

export default function ListingCard({
  id,
  title,
  price,
  location,
  image,
  isBoosted,
  neklikniVerdict,
}: ListingCardProps) {
  const priceCZK = (price / 100).toLocaleString("cs-CZ");

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case "safe":
        return "bg-accent text-accent-dark";
      case "warning":
        return "bg-warning text-white";
      case "danger":
        return "bg-danger text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <Link href={`/listing/${id}`} className="block group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 relative">
        {/* Obrázek s gradientem pro čitelnost */}
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Bez fotky</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/10"></div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {isBoosted ? (
              <span className="bg-accent text-accent-dark text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                TOP
              </span>
            ) : <div />}
            {neklikniVerdict && (
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${getVerdictColor(neklikniVerdict)}`}>
                {neklikniVerdict === "safe" ? "Ověřeno" : neklikniVerdict}
              </span>
            )}
          </div>

          {/* Cena (Letgo styl - velká přes fotku dole) */}
          <div className="absolute bottom-3 left-3 text-white">
            <p className="text-xl font-bold tracking-tight shadow-black/50 drop-shadow-md">
              {priceCZK} Kč
            </p>
          </div>
        </div>

        {/* Info dole */}
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">{title}</h3>
          <div className="flex items-center text-gray-500 text-xs mt-1 gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}