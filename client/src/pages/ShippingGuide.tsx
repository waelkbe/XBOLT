import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package, Globe, Clock, Shield, CheckCircle, ArrowLeft,
  Plane, MapPin, Phone, Mail, ChevronDown, ChevronUp
} from "lucide-react";
import { useState } from "react";

// ─── SEO Meta ────────────────────────────────────────────────────────────────
// هذه الصفحة مُحسَّنة لكلمات البحث:
//   - شحن من السعودية إلى أوروبا
//   - شحن من السعودية إلى ألمانيا / فرنسا / بريطانيا / إيطاليا / إسبانيا / أمريكا
//   - أسعار الشحن الدولي من السعودية
//   - شركة شحن دولي السعودية

const DESTINATIONS = [
  {
    country: "ألمانيا",
    countryEn: "Germany",
    flag: "🇩🇪",
    transitDays: "3-5",
    highlights: ["أكبر اقتصاد في أوروبا", "خدمة DHL Express", "تتبع لحظي"],
    highlightsEn: ["Largest economy in Europe", "DHL Express service", "Real-time tracking"],
    cities: ["برلين", "ميونخ", "هامبورغ", "فرانكفورت"],
    citiesEn: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
    slug: "germany",
  },
  {
    country: "فرنسا",
    countryEn: "France",
    flag: "🇫🇷",
    transitDays: "3-5",
    highlights: ["مركز الأزياء والتجارة", "شبكة توزيع واسعة", "خدمة موثوقة"],
    highlightsEn: ["Fashion & commerce hub", "Wide distribution network", "Reliable service"],
    cities: ["باريس", "مرسيليا", "ليون", "بوردو"],
    citiesEn: ["Paris", "Marseille", "Lyon", "Bordeaux"],
    slug: "france",
  },
  {
    country: "بريطانيا",
    countryEn: "United Kingdom",
    flag: "🇬🇧",
    transitDays: "3-5",
    highlights: ["سوق تجاري ضخم", "خدمة جمركية متخصصة", "تسليم سريع"],
    highlightsEn: ["Massive commercial market", "Specialized customs service", "Fast delivery"],
    cities: ["لندن", "مانشستر", "برمنغهام", "غلاسغو"],
    citiesEn: ["London", "Manchester", "Birmingham", "Glasgow"],
    slug: "uk",
  },
  {
    country: "إيطاليا",
    countryEn: "Italy",
    flag: "🇮🇹",
    transitDays: "4-6",
    highlights: ["مركز الموضة والتصميم", "خدمة شاملة", "أسعار تنافسية"],
    highlightsEn: ["Fashion & design capital", "Full service coverage", "Competitive pricing"],
    cities: ["روما", "ميلانو", "نابولي", "تورينو"],
    citiesEn: ["Rome", "Milan", "Naples", "Turin"],
    slug: "italy",
  },
  {
    country: "إسبانيا",
    countryEn: "Spain",
    flag: "🇪🇸",
    transitDays: "4-6",
    highlights: ["بوابة أوروبا الجنوبية", "خدمة متكاملة", "تغطية شاملة"],
    highlightsEn: ["Gateway to Southern Europe", "Integrated service", "Full coverage"],
    cities: ["مدريد", "برشلونة", "إشبيلية", "فالنسيا"],
    citiesEn: ["Madrid", "Barcelona", "Seville", "Valencia"],
    slug: "spain",
  },
  {
    country: "الولايات المتحدة",
    countryEn: "United States",
    flag: "🇺🇸",
    transitDays: "5-7",
    highlights: ["أكبر سوق استهلاكي", "خدمة DHL Express Premium", "تتبع 24/7"],
    highlightsEn: ["World's largest consumer market", "DHL Express Premium", "24/7 tracking"],
    cities: ["نيويورك", "لوس أنجلوس", "شيكاغو", "هيوستن"],
    citiesEn: ["New York", "Los Angeles", "Chicago", "Houston"],
    slug: "usa",
  },
];

const FAQS = [
  {
    q: "كم تكلفة الشحن من السعودية إلى أوروبا؟",
    a: "تبدأ أسعار الشحن من السعودية إلى أوروبا من 35 ريال للكيلوغرام الأول، وتتناقص مع زيادة الوزن. نقدم أسعاراً تنافسية بفضل شراكتنا مع DHL Express.",
  },
  {
    q: "كم يستغرق الشحن من السعودية إلى ألمانيا؟",
    a: "يستغرق الشحن من السعودية إلى ألمانيا عادةً 3-5 أيام عمل عبر خدمة DHL Express، مع إمكانية التتبع اللحظي لشحنتك.",
  },
  {
    q: "ما هي المواد المسموح بشحنها دولياً؟",
    a: "يمكن شحن معظم البضائع التجارية والشخصية. المواد الممنوعة تشمل: المواد الخطرة، الأسلحة، المواد المخدرة، والمواد القابلة للاشتعال. تواصل معنا للتأكد من أهلية بضاعتك.",
  },
  {
    q: "هل تشمل الخدمة التخليص الجمركي؟",
    a: "نعم، نقدم خدمة التخليص الجمركي الكاملة في كلا الاتجاهين (الصادر من السعودية والوارد للدولة المقصودة) ضمن خدمتنا الشاملة.",
  },
  {
    q: "كيف يمكنني تتبع شحنتي؟",
    a: "بعد إتمام الحجز، ستحصل على رقم تتبع يمكنك استخدامه في صفحة التتبع على موقعنا أو مباشرةً على موقع DHL للمتابعة اللحظية.",
  },
  {
    q: "هل يمكن شحن الطرود الشخصية (غير التجارية)؟",
    a: "نعم، نخدم الأفراد والشركات على حدٍّ سواء. يمكنك شحن الهدايا، الملابس، الإلكترونيات، والمقتنيات الشخصية بسهولة.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-right hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm">{q}</span>
        {open ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function ShippingGuide() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isEn = lang === 'en';
  return (
    <div className="min-h-screen bg-background" dir={isEn ? 'ltr' : 'rtl'}>
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 xbolt-gradient border-b border-white/10 shadow-md">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png"
              alt="XBOLT"
              className="h-8 w-auto object-contain cursor-pointer"
            />
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(isEn ? 'ar' : 'en')}
              className="text-white/70 hover:text-white text-sm font-medium px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40 transition-all"
            >
              {isEn ? 'عربي' : 'EN'}
            </button>
            <Link href="/book">
              <Button size="sm" className="xbolt-gradient-blue text-white border-0 font-semibold">
                {isEn ? 'Book Shipment' : 'احجز شحنتك الآن'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="xbolt-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="container relative z-10 text-center text-white">
          <Badge className="bg-white/10 text-white border-white/20 mb-6 px-4 py-1.5">
            <Globe className="w-3.5 h-3.5 ml-1.5" />
            {isEn ? 'International Shipping Guide from Saudi Arabia' : 'دليل الشحن الدولي من السعودية'}
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
            {isEn ? 'Ship from Saudi Arabia to' : 'شحن من السعودية إلى'}
            <span className="block shimmer-text">{isEn ? 'Europe & America' : 'أوروبا وأمريكا'}</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            {isEn
              ? 'Reliable and fast international shipping from Saudi Arabia to Germany, France, UK, Italy, Spain, and the USA — with competitive prices and real-time tracking.'
              : 'خدمة شحن دولي موثوقة وسريعة من المملكة العربية السعودية إلى ألمانيا، فرنسا، بريطانيا، إيطاليا، إسبانيا والولايات المتحدة — بأسعار تنافسية وتتبع لحظي.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book">
              <Button size="lg" className="xbolt-gradient-blue text-white border-0 font-bold shadow-xl px-8 py-6 rounded-xl">
                {isEn ? 'Get Instant Quote' : 'احصل على سعر فوري'}
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <a href="tel:+966550777809">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                <Phone className="w-5 h-5 ml-2" />
                {isEn ? 'Contact Us' : 'تواصل معنا'}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Why XBOLT ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-black text-center text-foreground mb-10">
            {isEn ? <>Why Choose <span className="text-primary">XBOLT</span> for International Shipping?</> : <>لماذا تختار <span className="text-primary">XBOLT</span> للشحن الدولي؟</>}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isEn ? [
              { icon: Plane, title: "Official DHL Partner", desc: "Official partnership with DHL Express for the fastest and most reliable international shipping" },
              { icon: Clock, title: "Delivery in 3-7 Days", desc: "Guaranteed arrival to Europe in 3-5 days and the USA in 5-7 business days" },
              { icon: Shield, title: "Full Insurance", desc: "All shipments are fully insured throughout their journey from Riyadh to destination" },
              { icon: Package, title: "Customs Clearance", desc: "We handle full customs clearance in both directions without complications" },
            ] : [
              { icon: Plane, title: "شريك DHL الرسمي", desc: "شراكة رسمية مع DHL Express لضمان أسرع وأموثق خدمة شحن دولي" },
              { icon: Clock, title: "توصيل خلال 3-7 أيام", desc: "وصول مضمون لأوروبا في 3-5 أيام وأمريكا في 5-7 أيام عمل" },
              { icon: Shield, title: "تأمين شامل", desc: "جميع الشحنات مؤمَّنة بالكامل طوال رحلتها من الرياض حتى الوجهة" },
              { icon: Package, title: "تخليص جمركي", desc: "نتولى التخليص الجمركي الكامل في كلا الاتجاهين بدون تعقيدات" },
            ]).map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="card-hover border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ─────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-2xl font-black text-center text-foreground mb-3">
            وجهات الشحن الدولي
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            نغطي أهم الأسواق الأوروبية والأمريكية بخدمة DHL Express الاحترافية
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESTINATIONS.map((dest) => (
              <Card key={dest.slug} className="card-hover border-border/50 overflow-hidden">
                <div className="h-2 xbolt-gradient-blue" />
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{dest.flag}</span>
                    <div>
                      <h3 className="font-black text-foreground text-lg">
                        الشحن إلى {dest.country}
                      </h3>
                      <p className="text-muted-foreground text-xs">Shipping to {dest.countryEn}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-semibold">{dest.transitDays} {isEn ? 'days' : 'أيام'}</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {(isEn ? dest.highlightsEn : dest.highlights).map(h => (
                      <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(isEn ? dest.citiesEn : dest.cities).map(city => (
                      <span key={city} className="text-xs bg-muted rounded-md px-2 py-0.5 text-muted-foreground">
                        <MapPin className="w-2.5 h-2.5 inline ml-0.5" />{city}
                      </span>
                    ))}
                  </div>
                  <Link href="/book">
                    <Button size="sm" className="w-full xbolt-gradient-blue text-white border-0 font-semibold">
                      {isEn ? `Ship to ${dest.countryEn}` : `احجز شحنة إلى ${dest.country}`}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-black text-center text-foreground mb-10">
            {isEn ? 'How Does International Shipping Work?' : 'كيف تعمل خدمة الشحن الدولي؟'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(isEn ? [
              { step: "01", title: "Enter Shipment Details", desc: "Enter the shipment weight, dimensions, and destination to get an instant quote" },
              { step: "02", title: "Choose Your Service", desc: "Select from available shipping options based on your budget and required speed" },
              { step: "03", title: "We Pick Up Your Shipment", desc: "We send our representative to collect the shipment from your location in Riyadh, Jeddah, or Dammam" },
              { step: "04", title: "Delivery to Destination", desc: "Your shipment arrives to the recipient with automatic notification and real-time tracking" },
            ] : [
              { step: "01", title: "أدخل بيانات الشحنة", desc: "أدخل وزن الشحنة، الأبعاد، ووجهتها للحصول على سعر فوري" },
              { step: "02", title: "اختر الخدمة المناسبة", desc: "اختر من بين خيارات الشحن المتاحة حسب الميزانية والسرعة المطلوبة" },
              { step: "03", title: "نستلم الشحنة منك", desc: "نرسل مندوبنا لاستلام الشحنة من موقعك في الرياض أو جدة أو الدمام" },
              { step: "04", title: "التسليم للوجهة", desc: "تصل شحنتك للمستلم مع إشعار تلقائي وإمكانية التتبع اللحظي" },
            ]).map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl xbolt-gradient flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span className="text-[#F14E23] font-black text-xl">{step}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-black text-center text-foreground mb-3">
            {isEn ? 'Frequently Asked Questions' : 'الأسئلة الشائعة'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {isEn ? 'Everything you need to know about international shipping from Saudi Arabia' : 'كل ما تحتاج معرفته عن الشحن الدولي من السعودية'}
          </p>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 xbolt-gradient">
        <div className="container text-center text-white">
          <h2 className="text-3xl font-black mb-4">
            {isEn ? 'Ready to Ship Your Goods Worldwide?' : 'جاهز لشحن بضاعتك للعالم؟'}
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            {isEn ? 'Get an instant quote now or contact our team for a customized offer tailored to your needs' : 'احصل على سعر فوري الآن أو تواصل مع فريقنا للحصول على عرض مخصص لاحتياجاتك'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book">
              <Button size="lg" className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-6 rounded-xl shadow-xl">
                {isEn ? 'Book Shipment Now' : 'احجز شحنتك الآن'}
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <a href="mailto:info@xbolt.com.sa">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-xl">
                <Mail className="w-5 h-5 ml-2" />
                info@xbolt.com.sa
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="xbolt-gradient border-t border-white/10 py-8">
        <div className="container text-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-9c_931d6d8e.png"
            alt="XBOLT"
            className="h-7 w-auto mx-auto mb-4"
          />
          <p className="text-white/50 text-sm">
            © 2025 XBOLT — شركة الشحن الدولي السعودية. جميع الحقوق محفوظة.
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <Link href="/"><span className="text-white/50 hover:text-white text-xs transition-colors cursor-pointer">الرئيسية</span></Link>
            <Link href="/book"><span className="text-white/50 hover:text-white text-xs transition-colors cursor-pointer">احجز شحنة</span></Link>
            <Link href="/track"><span className="text-white/50 hover:text-white text-xs transition-colors cursor-pointer">تتبع الشحنة</span></Link>
            <Link href="/contact"><span className="text-white/50 hover:text-white text-xs transition-colors cursor-pointer">تواصل معنا</span></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
