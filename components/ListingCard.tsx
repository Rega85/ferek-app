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
        return "bg-text-muted text-white";
    }
  };

  return (
    <Link href={`/listing/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
        {isBoosted && (
          <div className="bg-accent text-accent-dark text-xs font-medium px-2 py-1 text-center">
            TOP
          </div>
        )}
        <div className="aspect-square bg-bg-soft relative">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              Žádná fotka
            </div>
          )}
          {neklikniVerdict && (
            <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${getVerdictColor(neklikniVerdict)}`}>
              {neklikniVerdict === "safe" ? "OVĚŘENO" : neklikniVerdict.toUpperCase()}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-text line-clamp-2 mb-1">{title}</h3>
          <p className="text-lg font-bold text-text mb-1">{priceCZK} Kč</p>
          <p className="text-sm text-text-muted">{location}</p>
        </div>
      </div>
    </Link>
  );
}