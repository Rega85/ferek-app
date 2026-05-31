type ListingRiskInput = {
  title: string;
  description: string;
  price: number;
  photoCount: number;
};

type ListingRiskResult = {
  score: number;
  verdict: "safe" | "warning" | "danger";
  flags: string[];
};

const suspiciousPhrases = [
  "platba predem",
  "jen dnes",
  "whatsapp",
  "telegram",
  "poslu kurýra",
  "poslu kuriera",
  "dpd kuryr",
  "balikovna kuryr",
  "rychle jednani",
  "bez dokladu",
];

export function assessListingRisk(input: ListingRiskInput): ListingRiskResult {
  const flags: string[] = [];
  let score = 92;
  const text = `${input.title} ${input.description}`.toLocaleLowerCase("cs-CZ");

  for (const phrase of suspiciousPhrases) {
    if (text.includes(phrase)) {
      flags.push(`Podezrela fraze: ${phrase}`);
      score -= 14;
    }
  }

  if (input.photoCount === 0) {
    flags.push("Inzerat nema fotky");
    score -= 20;
  }

  if (input.description.trim().length < 30) {
    flags.push("Prilis kratky popis");
    score -= 10;
  }

  if (input.price > 0 && input.price < 5000) {
    flags.push("Velmi nizka cena");
    score -= 6;
  }

  const normalizedScore = Math.max(0, Math.min(100, score));
  const verdict = normalizedScore >= 75 ? "safe" : normalizedScore >= 45 ? "warning" : "danger";

  return {
    score: normalizedScore,
    verdict,
    flags,
  };
}
