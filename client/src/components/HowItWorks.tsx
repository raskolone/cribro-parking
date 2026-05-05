import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t("how.step1.title"),
      desc: t("how.step1.desc"),
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/katowice-airport-Tq5ZDWbqmxq7jZ65bcj9DR.webp",
    },
    {
      number: "02",
      title: t("how.step2.title"),
      desc: t("how.step2.desc"),
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-transfer-TSzuMLwLUnR6cTvf8GmR7d.webp",
    },
    {
      number: "03",
      title: t("how.step3.title"),
      desc: t("how.step3.desc"),
      image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663629907879/StQjxm4uHx9bBHAEXoKSQR/parking-security-N3X3nWrgSeE6KHrmcgvnvw.webp",
    },
  ];

  return (
    <section id="how" className="py-24 bg-secondary/30">
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
            {t("how.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("how.subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } gap-8 lg:gap-16 items-center`}
            >
              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-lg shadow-black/10">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
                    <span className="font-display font-bold text-primary text-sm">
                      {step.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="max-w-md">
                  <span className="text-6xl font-display font-bold text-primary/10 block mb-2">
                    {step.number}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
