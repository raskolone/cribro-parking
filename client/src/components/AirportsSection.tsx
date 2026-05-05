import { useLanguage } from "@/contexts/LanguageContext";
import { Plane, Users, ArrowRight } from "lucide-react";
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
      parkings: "12+",
    },
    {
      name: t("airports.krakow.name"),
      code: t("airports.krakow.code"),
      desc: t("airports.krakow.desc"),
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/krakow-airport-KfCL3WzY4A4iBLbNHWTwgj.webp",
      passengers: "13.2M",
      parkings: "20+",
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        </div>
      </div>
    </section>
  );
}
