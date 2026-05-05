import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, BadgeCheck, Bus, Lock } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function USPSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: BadgeCheck,
      title: t("usp.guarantee.title"),
      desc: t("usp.guarantee.desc"),
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Shield,
      title: t("usp.price.title"),
      desc: t("usp.price.desc"),
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Bus,
      title: t("usp.transfer.title"),
      desc: t("usp.transfer.desc"),
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Lock,
      title: t("usp.security.title"),
      desc: t("usp.security.desc"),
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
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
            {t("usp.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("usp.subtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
