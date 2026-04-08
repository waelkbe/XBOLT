import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Calculator, ArrowLeft, Package, MapPin, Weight, Ruler, ChevronLeft, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const CITIES_SA = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الظهران",
  "الطائف", "بريدة", "تبوك", "أبها", "خميس مشيط", "الجبيل", "ينبع", "حائل",
  "نجران", "الباحة", "جازان", "عرعر", "سكاكا", "القطيف", "الأحساء",
];

const COUNTRIES_INTL = [
  "الإمارات العربية المتحدة", "الكويت", "البحرين", "قطر", "عُمان", "الأردن",
  "مصر", "لبنان", "العراق", "المغرب", "تونس", "الجزائر", "ليبيا",
  "الولايات المتحدة", "المملكة المتحدة", "ألمانيا", "فرنسا", "إيطاليا",
  "الصين", "الهند", "تركيا", "باكستان", "بنغلاديش",
];

function calcPrice(type: "local" | "international", fromCity: string, toCity: string, weight: number, length: number, width: number, height: number): { base: number; perKg: number; volumetric: number; total: number; days: string } {
  const vol = (length * width * height) / 5000;
  const chargeableWeight = Math.max(weight, vol);

  if (type === "local") {
    const sameRegion = fromCity === toCity;
    const base = sameRegion ? 15 : 25;
    const perKg = chargeableWeight > 1 ? (chargeableWeight - 1) * 3 : 0;
    const total = base + perKg;
    const days = sameRegion ? "نفس اليوم - 24 ساعة" : "1-3 أيام عمل";
    return { base, perKg, volumetric: vol, total, days };
  } else {
    const base = 85;
    const perKg = chargeableWeight * 18;
    const total = base + perKg;
    const days = "3-7 أيام عمل";
    return { base, perKg, volumetric: vol, total, days };
  }
}

export default function PriceCalculator() {
  const { isRTL } = useLanguage();
  const [type, setType] = useState<"local" | "international">("local");
  const [fromCity, setFromCity] = useState("الرياض");
  const [toCity, setToCity] = useState("جدة");
  const [toCountry, setToCountry] = useState("الإمارات العربية المتحدة");
  const [weight, setWeight] = useState(1);
  const [length, setLength] = useState(30);
  const [width, setWidth] = useState(20);
  const [height, setHeight] = useState(15);
  const [result, setResult] = useState<ReturnType<typeof calcPrice> | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = isRTL ? "احسب السعر | XBOLT" : "Price Calculator | XBOLT";
  }, [isRTL]);

  const handleCalc = () => {
    const dest = type === "local" ? toCity : toCountry;
    const r = calcPrice(type, fromCity, dest, weight, length, width, height);
    setResult(r);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="xbolt-gradient border-b border-white/10 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png"
                alt="XBOLT"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">{isRTL ? "احسب السعر" : "Price Calculator"}</h1>
          <div className="flex items-center gap-2">
            <LanguageToggle className="text-white/70 hover:text-white" />
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>{isRTL ? "رجوع" : "Back"}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="xbolt-gradient py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-3">
              {isRTL ? "احسب سعر شحنتك الآن" : "Calculate Your Shipment Price Now"}
            </h1>
            <p className="text-white/70 text-base max-w-xl mx-auto">
              {isRTL
                ? "وفّر وقتك ومجهودك واحصل على سعر أفضل من DHL بسهولة — بدون تسجيل"
                : "Save time and effort and get a better price than DHL easily — no registration required"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-background">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden">

            {/* Type Toggle */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setType("local")}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${type === "local" ? "xbolt-gradient text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Package className="w-4 h-4 inline ml-2" />
                {isRTL ? "شحن محلي" : "Local Shipping"}
              </button>
              <button
                onClick={() => setType("international")}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${type === "international" ? "xbolt-gradient text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MapPin className="w-4 h-4 inline ml-2" />
                {isRTL ? "شحن دولي" : "International Shipping"}
              </button>
            </div>

            <div className="p-6 lg:p-8 space-y-6">
              {/* From / To */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    <MapPin className="w-4 h-4 inline ml-1 text-primary" />
                    {isRTL ? "من مدينة" : "From City"}
                  </label>
                  <select
                    value={fromCity}
                    onChange={e => setFromCity(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CITIES_SA.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    <MapPin className="w-4 h-4 inline ml-1 text-primary" />
                    {isRTL ? (type === "local" ? "إلى مدينة" : "إلى دولة") : (type === "local" ? "To City" : "To Country")}
                  </label>
                  {type === "local" ? (
                    <select
                      value={toCity}
                      onChange={e => setToCity(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {CITIES_SA.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <select
                      value={toCountry}
                      onChange={e => setToCountry(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      {COUNTRIES_INTL.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  )}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <Weight className="w-4 h-4 inline ml-1 text-primary" />
                  {isRTL ? "الوزن (كجم)" : "Weight (kg)"}
                </label>
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={weight}
                  onChange={e => setWeight(parseFloat(e.target.value) || 0.1)}
                  className="rounded-xl"
                />
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  <Ruler className="w-4 h-4 inline ml-1 text-primary" />
                  {isRTL ? "الأبعاد (سم) — الطول × العرض × الارتفاع" : "Dimensions (cm) — L × W × H"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" min={1} value={length} onChange={e => setLength(parseInt(e.target.value) || 1)} placeholder={isRTL ? "الطول" : "Length"} className="rounded-xl" />
                  <Input type="number" min={1} value={width} onChange={e => setWidth(parseInt(e.target.value) || 1)} placeholder={isRTL ? "العرض" : "Width"} className="rounded-xl" />
                  <Input type="number" min={1} value={height} onChange={e => setHeight(parseInt(e.target.value) || 1)} placeholder={isRTL ? "الارتفاع" : "Height"} className="rounded-xl" />
                </div>
              </div>

              {/* Calculate Button */}
              <Button
                onClick={handleCalc}
                size="lg"
                className="w-full xbolt-gradient-blue text-white border-0 font-bold rounded-xl text-base py-6 shadow-lg"
              >
                <Calculator className="w-5 h-5 ml-2" />
                {isRTL ? "احسب السعر الآن" : "Calculate Price Now"}
              </Button>

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-secondary/50 rounded-2xl p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-foreground">{isRTL ? "نتيجة الحساب" : "Calculation Result"}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? "رسوم أساسية" : "Base fee"}</span>
                      <span className="font-semibold text-foreground">{result.base.toFixed(2)} {isRTL ? "ريال" : "SAR"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? "رسوم الوزن" : "Weight fee"}</span>
                      <span className="font-semibold text-foreground">{result.perKg.toFixed(2)} {isRTL ? "ريال" : "SAR"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{isRTL ? "الوزن الحجمي" : "Volumetric weight"}</span>
                      <span className="font-semibold text-foreground">{result.volumetric.toFixed(2)} {isRTL ? "كجم" : "kg"}</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between">
                      <span className="font-bold text-foreground">{isRTL ? "الإجمالي التقديري" : "Estimated Total"}</span>
                      <span className="font-black text-primary text-xl">{result.total.toFixed(2)} {isRTL ? "ريال" : "SAR"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>{isRTL ? `وقت التوصيل المتوقع: ${result.days}` : `Estimated delivery: ${result.days}`}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    {isRTL
                      ? "* هذا سعر تقديري. السعر النهائي يُحدد عند الحجز بناءً على الوزن الفعلي والخدمات المختارة."
                      : "* This is an estimated price. Final price is determined at booking based on actual weight and selected services."}
                  </p>
                  <Link href="/book">
                    <Button className="w-full xbolt-gradient text-white border-0 font-bold rounded-xl">
                      {isRTL ? "احجز الآن بهذا السعر" : "Book Now at This Price"}
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Why XBOLT */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-4 text-center">
              {isRTL ? "لماذا XBOLT أفضل من DHL مباشرة؟" : "Why is XBOLT better than DHL directly?"}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {(isRTL ? [
                { title: "أسعار أفضل", desc: "نحصل على أسعار مخفضة من DHL ونمررها لك مباشرة" },
                { title: "خدمة عربية", desc: "دعم فني باللغة العربية على مدار الساعة" },
                { title: "نقاط مكافآت", desc: "اكسب نقاط مع كل شحنة واستبدلها بخصومات" },
              ] : [
                { title: "Better Prices", desc: "We get discounted rates from DHL and pass them directly to you" },
                { title: "Arabic Service", desc: "Arabic-language technical support around the clock" },
                { title: "Reward Points", desc: "Earn points with every shipment and redeem for discounts" },
              ]).map((item, i) => (
                <div key={i} className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-bold text-foreground text-sm mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
