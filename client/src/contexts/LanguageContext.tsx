import { createContext, useContext, useState, ReactNode } from "react";

type Language = "pl" | "en";

interface Translations {
  [key: string]: { pl: string; en: string };
}

const translations: Translations = {
  // Navigation
  "nav.howItWorks": { pl: "Jak to działa", en: "How it works" },
  "nav.airports": { pl: "Lotniska", en: "Airports" },
  "nav.about": { pl: "O nas", en: "About us" },
  "nav.contact": { pl: "Kontakt", en: "Contact" },
  "nav.login": { pl: "Zaloguj się", en: "Log in" },

  // Hero
  "hero.tagline": { pl: "Twoja podróż zaczyna się od spokojnego parkowania", en: "Your journey starts with stress-free parking" },
  "hero.title": { pl: "Zarezerwuj miejsce parkingowe przy lotnisku", en: "Book airport parking in seconds" },
  "hero.subtitle": { pl: "Gwarancja miejsca, najniższe ceny, darmowy transfer na lotnisko. Katowice-Pyrzowice i Kraków-Balice.", en: "Guaranteed spot, lowest prices, free airport shuttle. Katowice-Pyrzowice and Kraków-Balice." },

  // Search Form
  "search.airport": { pl: "Lotnisko", en: "Airport" },
  "search.selectAirport": { pl: "Wybierz lotnisko", en: "Select airport" },
  "search.katowice": { pl: "Katowice-Pyrzowice (KTW)", en: "Katowice-Pyrzowice (KTW)" },
  "search.krakow": { pl: "Kraków-Balice (KRK)", en: "Kraków-Balice (KRK)" },
  "search.arrival": { pl: "Data przyjazdu", en: "Drop-off date" },
  "search.departure": { pl: "Data wyjazdu", en: "Pick-up date" },
  "search.submit": { pl: "Szukaj parkingu", en: "Find parking" },
  "search.freeCancel": { pl: "Bezpłatna anulacja do 24h przed przyjazdem", en: "Free cancellation up to 24h before arrival" },

  // USP Section
  "usp.title": { pl: "Dlaczego Cribro Parking?", en: "Why Cribro Parking?" },
  "usp.subtitle": { pl: "Łączymy Cię bezpośrednio z zweryfikowanymi parkingami, eliminując pośredników i obniżając ceny.", en: "We connect you directly with verified parking lots, eliminating middlemen and lowering prices." },
  "usp.guarantee.title": { pl: "Gwarancja miejsca", en: "Guaranteed spot" },
  "usp.guarantee.desc": { pl: "Dedykowana pula miejsc zarezerwowana wyłącznie dla naszych klientów. Żadnego overbookingu.", en: "Dedicated pool of spots reserved exclusively for our customers. No overbooking." },
  "usp.price.title": { pl: "Najniższe ceny", en: "Lowest prices" },
  "usp.price.desc": { pl: "Bezpośrednie umowy z parkingami pozwalają nam oferować ceny niższe niż konkurencja.", en: "Direct agreements with parking lots allow us to offer prices lower than the competition." },
  "usp.transfer.title": { pl: "Darmowy transfer", en: "Free shuttle" },
  "usp.transfer.desc": { pl: "Klimatyzowany bus dowiezie Cię na terminal w kilka minut. Bez dodatkowych opłat.", en: "Air-conditioned shuttle takes you to the terminal in minutes. No extra charges." },
  "usp.security.title": { pl: "Bezpieczeństwo 24/7", en: "24/7 Security" },
  "usp.security.desc": { pl: "Monitorowane, ogrodzone i oświetlone parkingi. Twoje auto jest bezpieczne.", en: "Monitored, fenced, and well-lit parking lots. Your car is safe." },

  // How it works
  "how.title": { pl: "Jak to działa?", en: "How does it work?" },
  "how.subtitle": { pl: "Rezerwacja w 3 prostych krokach", en: "Book in 3 simple steps" },
  "how.step1.title": { pl: "Wybierz i zarezerwuj", en: "Choose & book" },
  "how.step1.desc": { pl: "Podaj daty podróży i wybierz parking. Potwierdzenie otrzymasz natychmiast na email.", en: "Enter your travel dates and choose a parking lot. You'll get instant confirmation via email." },
  "how.step2.title": { pl: "Zaparkuj i jedź", en: "Park & fly" },
  "how.step2.desc": { pl: "Przyjedź na parking, podaj numer rezerwacji. Darmowy bus zabierze Cię na lotnisko.", en: "Drive to the parking lot, provide your booking number. Free shuttle takes you to the airport." },
  "how.step3.title": { pl: "Wróć i odbierz", en: "Return & collect" },
  "how.step3.desc": { pl: "Po wylądowaniu zadzwoń — bus przyjedzie po Ciebie. Twoje auto czeka na miejscu.", en: "After landing, call us — the shuttle will pick you up. Your car is waiting." },

  // Airports section
  "airports.title": { pl: "Obsługiwane lotniska", en: "Supported airports" },
  "airports.subtitle": { pl: "Rozpoczynamy od dwóch największych lotnisk w południowej Polsce", en: "Starting with the two largest airports in southern Poland" },
  "airports.katowice.name": { pl: "Katowice-Pyrzowice", en: "Katowice-Pyrzowice" },
  "airports.katowice.code": { pl: "KTW", en: "KTW" },
  "airports.katowice.desc": { pl: "7,3 mln pasażerów rocznie. Dynamicznie rozwijające się lotnisko regionalne.", en: "7.3M passengers annually. A dynamically growing regional airport." },
  "airports.krakow.name": { pl: "Kraków-Balice", en: "Kraków-Balice" },
  "airports.krakow.code": { pl: "KRK", en: "KRK" },
  "airports.krakow.desc": { pl: "13,2 mln pasażerów rocznie. Drugie co do wielkości lotnisko w Polsce.", en: "13.2M passengers annually. The second largest airport in Poland." },

  // CTA
  "cta.title": { pl: "Gotowy na spokojną podróż?", en: "Ready for a stress-free trip?" },
  "cta.subtitle": { pl: "Zarezerwuj parking w 30 sekund i zapomnij o stresie.", en: "Book parking in 30 seconds and forget the stress." },
  "cta.button": { pl: "Zarezerwuj teraz", en: "Book now" },

  // Footer
  "footer.brand": { pl: "Cribro Parking", en: "Cribro Parking" },
  "footer.desc": { pl: "Portal rezerwacji parkingów lotniskowych. Projekt marki Cribro.", en: "Airport parking reservation portal. A Cribro brand project." },
  "footer.links": { pl: "Przydatne linki", en: "Useful links" },
  "footer.legal": { pl: "Informacje prawne", en: "Legal" },
  "footer.privacy": { pl: "Polityka prywatności", en: "Privacy policy" },
  "footer.terms": { pl: "Regulamin", en: "Terms of service" },
  "footer.cookies": { pl: "Pliki cookies", en: "Cookie policy" },
  "footer.copyright": { pl: "© 2026 Cribro. Wszelkie prawa zastrzeżone.", en: "© 2026 Cribro. All rights reserved." },

  // Misc
  "parking.from": { pl: "od", en: "from" },
  "parking.perDay": { pl: "zł/dobę", en: "PLN/day" },
  "parking.available": { pl: "Dostępne", en: "Available" },
  "parking.distance": { pl: "od lotniska", en: "from airport" },
  "parking.transferTime": { pl: "min do terminala", en: "min to terminal" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("pl");

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
