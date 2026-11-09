// Tipy pro prodejce: jak napsat lepší inzerát.
//
// Tohle NENÍ bezpečnostní kontrola a NESMÍ se zobrazovat jako ověření.
// Kontrolu proti podvodům dělá jen Neklikni.cz API na serveru (lib/neklikni.ts, fáze F1).

type SellerTipsInput = {
  title: string;
  description: string;
  /** Cena v Kč (ne v haléřích). 0 = zdarma. */
  priceCZK: number;
  photoCount: number;
};

const riskyPhrases: { phrase: string; tip: string }[] = [
  { phrase: "whatsapp", tip: "Domlouvejte se přes chat na Férku. Odkazy na WhatsApp kupující odrazují." },
  { phrase: "telegram", tip: "Domlouvejte se přes chat na Férku. Odkazy na Telegram kupující odrazují." },
  { phrase: "platba predem", tip: "Žádost o platbu předem je typický znak podvodu. Nabídněte raději osobní předání." },
  { phrase: "platba předem", tip: "Žádost o platbu předem je typický znak podvodu. Nabídněte raději osobní předání." },
  { phrase: "jen dnes", tip: "Tlak na rychlé rozhodnutí působí podezřele. Vynechte ho." },
];

export function getSellerTips(input: SellerTipsInput): string[] {
  const tips: string[] = [];
  const text = `${input.title} ${input.description}`.toLocaleLowerCase("cs-CZ");

  for (const { phrase, tip } of riskyPhrases) {
    if (text.includes(phrase) && !tips.includes(tip)) tips.push(tip);
  }

  if (input.description.trim().length < 80) {
    tips.push("Delší popis prodává líp: stav, stáří, vady, důvod prodeje, možnost předání.");
  }

  if (input.photoCount < 6) {
    tips.push("Více fotek znamená víc důvěry. Přidejte i detail případné vady.");
  }

  return tips;
}
