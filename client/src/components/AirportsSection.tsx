import { useLanguage } from "@/contexts/LanguageContext";
import { Plane, Users, ArrowRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AirportsSection() {
  const { t, language } = useLanguage();

  const airports = [
    {
      name: t("airports.katowice.name"),
      code: t("airports.katowice.code"),
      desc: t("airports.katowice.desc"),
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/katowice-airport-Tq5ZDWbqmxq7jZ65bcj9DR.webp",
      passengers: "7.3M",
      parkings: "2+",
    },
  ];

  return (
    <section id="airports" className="py-24 bg-white">
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            {t("airports.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("airports.subtitle")}
          </p>
        </motion.div>

        {/* Airport Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto gap-8">
          {airports.map((airport, index) => (
            <motion.div
              key={airport.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={airport.image}
                  alt={airport.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                    {airport.code}
                  </span>
                  <h3 className="text-white font-display font-bold text-2xl">
                    {airport.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-muted-foreground text-sm mb-6">
                  {airport.desc}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{airport.passengers}</span>
                    <span className="text-xs text-muted-foreground">
                      {language === "pl" ? "pasażerów/rok" : "passengers/year"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{airport.parkings}</span>
                    <span className="text-xs text-muted-foreground">
                      {language === "pl" ? "parkingów" : "parking lots"}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => toast("Funkcja wkrótce dostępna / Feature coming soon")}
                  className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
                >
                  {t("search.submit")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 min-h-[320px]"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <Clock className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2 text-center">
              {language === "pl" ? "Więcej lotnisk" : "More airports"}
            </h3>
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">
              {language === "pl" ? "Niebawem" : "Coming soon"}
            </p>
            <p className="text-muted-foreground text-sm text-center max-w-xs">
              {language === "pl"
                ? "Aktywnie rozszerzamy sieć partnerów. Kolejne lotniska już wkrótce."
                : "We are actively expanding our partner network. More airports coming soon."}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
