import { useLanguage } from "@/contexts/LanguageContext";
import { Plane } from "lucide-react";
import { toast } from "sonner";

export default function Footer() {
  const { t } = useLanguage();

  const handleClick = () => {
    toast("Funkcja wkrótce dostępna / Feature coming soon");
  };

  return (
    <footer id="contact" className="bg-foreground text-white/80 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Cribro<span className="text-primary-foreground/80"> Parking</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {t("footer.desc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">
              {t("footer.links")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#how" className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("nav.howItWorks")}
                </a>
              </li>
              <li>
                <a href="#airports" className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("nav.airports")}
                </a>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("nav.about")}
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("nav.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-bold text-white text-sm mb-4">
              {t("footer.legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={handleClick} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("footer.privacy")}
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("footer.terms")}
                </button>
              </li>
              <li>
                <button onClick={handleClick} className="text-sm text-white/60 hover:text-white transition-colors">
                  {t("footer.cookies")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-xs text-white/40">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
