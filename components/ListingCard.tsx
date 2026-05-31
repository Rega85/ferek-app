import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
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

  return (
    <Link href={`/listing/${id}`} className="block group">
      <article className="overflow-hidden rounded-[20px] bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
        <div className="relative aspect-[1.55/1] overflow-hidden bg-gray-100 sm:aspect-[4/5]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-gray-400">
              <svg className="mb-2 h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Bez fotky</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/5" />

          <div className="absolute left-4 top-4 rounded-xl bg-black/85 px-4 py-2 text-xl font-black tracking-tight text-white shadow-lg">
            {price === 0 ? "Zdarma" : `${priceCZK} Kč`}
          </div>

          {isBoosted ? (
            <div className="absolute right-4 top-4 rounded-lg bg-[#ff5a1f] px-2.5 py-1 text-xs font-black text-white shadow">
              TOP
            </div>
          ) : null}

          {neklikniVerdict ? (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-gray-900 shadow-lg">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">✓</span>
              Neklikni
            </div>
          ) : null}
        </div>

        <div className="bg-white p-3 sm:p-4">
          <h3 className="line-clamp-1 text-sm font-bold text-gray-900">{title}</h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location || "Neuvedeno"}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
