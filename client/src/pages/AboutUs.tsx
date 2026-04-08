import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Target, Eye, Award, Users, Package, Globe, Clock, Shield, TrendingUp, ArrowLeft, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } }),
};

const STATS = [
  { icon: Package, value: "آلاف", label: "شحنة مكتملة", color: "text-blue-500" },
  { icon: Users, value: "مئات", label: "عميل موثوق", color: "text-green-500" },
  { icon: Globe, value: "+120", label: "دولة حول العالم", color: "text-purple-500" },
  { icon: Clock, value: "99.2%", label: "نسبة التسليم الناجح", color: "text-amber-500" },
];

const VALUES = [
  { icon: Shield, title: "الأمانة والشفافية", desc: "نلتزم بالصدق التام مع عملائنا في الأسعار والمواعيد وجميع تفاصيل الخدمة دون أي رسوم مخفية." },
  { icon: TrendingUp, title: "الابتكار المستمر", desc: "نطور تقنياتنا باستمرار لنقدم تجربة شحن أكثر ذكاءً وسرعة وموثوقية في كل مرة." },
  { icon: Users, title: "العميل أولاً", desc: "رضا العميل هو مقياس نجاحنا الحقيقي، ونعمل على تجاوز توقعاته في كل شحنة." },
  { icon: Globe, title: "الوصول العالمي", desc: "نربط المملكة العربية السعودية بالعالم من خلال شبكة شركاء موثوقين في أكثر من 120 دولة." },
];

const TEAM = [
  { name: "م/ عبدالله الهاشم", role: "الرئيس التنفيذي", initials: "AH", color: "from-blue-500 to-blue-700" },
  { name: "وائل كرم", role: "مدير تطوير الاعمال", initials: "WK", color: "from-purple-500 to-purple-700" },
  { name: "ريم شوقي", role: "مديرة التقنية", initials: "RSH", color: "from-green-500 to-green-700" },
  { name: "اماني عمر", role: "مديرة تجربة العملاء", initials: "AO", color: "from-amber-500 to-amber-700" },
];

const MILESTONES = [
  { year: "1", title: "التأسيس", desc: "انطلقت XBOLT من الخبر بفريق صغير وحلم كبير في تحويل قطاع الشحن." },
  { year: "2", title: "التوسع المحلي", desc: "غطينا جميع مناطق المملكة العربية السعودية " },
  { year: "3", title: "الانطلاق الدولي", desc: "أطلقنا خدمة الشحن الدولي لأكثر من 90 دولة بشراكات استراتيجية عالمية." },
  { year: "4", title: "التحول الرقمي", desc: "أطلقنا منصتنا الذكية مع تتبع لحظي وذكاء اصطناعي لتحسين مسارات التوصيل." },
  { year: "5", title: "القيادة الإقليمية", desc: "أصبحنا من أسرع شركات الشحن نمواً في منطقة الخليج مع آلاف الشحنات المكتملة." },
];

export default function AboutUs() {
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    document.title = isRTL
      ? "من نحن | XBOLT - منصة الشحن الذكية"
      : "About Us | XBOLT - Smart Shipping Platform";
  }, [isRTL]);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Header ── */}
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/"><span className="text-white/70 hover:text-white text-sm font-medium cursor-pointer transition-colors">{isRTL ? "الرئيسية" : "Home"}</span></Link>
            <Link href="/track"><span className="text-white/70 hover:text-white text-sm font-medium cursor-pointer transition-colors">{t.nav.track}</span></Link>
            <Link href="/contact"><span className="text-white/70 hover:text-white text-sm font-medium cursor-pointer transition-colors">{t.nav.contact}</span></Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle className="text-white/70 hover:text-white" />
            <Link href="/book">
              <Button size="sm" className="xbolt-gradient-gold text-foreground border-0 font-bold rounded-xl">{t.nav.bookNow}</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>{isRTL ? 'رجوع' : 'Back'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="xbolt-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Star className="w-4 h-4 text-amber-400" />
              {t.hero.badge}
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {t.about.subtitle}
            </h1>
            <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              {t.about.missionText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-6 text-center border border-border shadow-sm card-hover">
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-4`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <p className="text-3xl font-black text-foreground mb-1">{s.value}</p>
                <p className="text-muted-foreground text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-primary text-sm font-bold uppercase tracking-wider mb-3 block">قصتنا</span>
              <h2 className="text-3xl lg:text-4xl font-black text-foreground mb-6 leading-tight">
                من فكرة بسيطة إلى<br />
                <span className="text-primary">منصة تغير قطاع الشحن</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  بدأت XBOLT عام 2026 من مكتب صغير في الخبر ، حين لاحظ مؤسسونا الفجوة الكبيرة بين ما يحتاجه العملاء من خدمة شحن موثوقة وما كان متاحاً في السوق. كان الهدف واضحاً: بناء منصة شحن تضع العميل في المركز.
                </p>
                <p>
                  اليوم، نفخر بخدمة عملائنا وتوصيل شحناتهم إلى أكثر من 120 دولة حول العالم، مع الحفاظ على أعلى معايير الجودة — لأننا لا نشحن طرودًا فحسب، بل نشحن ثقة.
                </p>
                <p>
                  تقنيتنا تعمل في الخلفية لضمان أفضل مسار وأسرع توصيل وأدق تتبع، بينما يركز فريقنا البشري على ما لا تستطيع الآلة فعله: الاهتمام الحقيقي بكل عميل.
                </p>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, title: "شحن آمن 100%", desc: "تأمين شامل على جميع الشحنات", color: "bg-blue-50 text-blue-600" },
                { icon: Clock, title: "توصيل سريع", desc: "خلال 24-48 ساعة داخل المملكة", color: "bg-green-50 text-green-600" },
                { icon: Globe, title: "تغطية عالمية", desc: "أكثر من 120 دولة حول العالم", color: "bg-purple-50 text-purple-600" },
                { icon: Award, title: "جودة مضمونة", desc: "معتمدون من هيئة الاتصالات", color: "bg-amber-50 text-amber-600" },
              ].map((item, i) => (
                <div key={i} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 xbolt-gradient-blue" />
              <div className="w-12 h-12 rounded-xl xbolt-gradient-blue flex items-center justify-center mb-5">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-4">رسالتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                تمكين الأفراد والشركات في المملكة العربية السعودية والمنطقة من الوصول إلى خدمات شحن موثوقة وذكية وبأسعار شفافة، من خلال منصة رقمية متكاملة تجمع بين التقنية والخدمة الإنسانية.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="bg-card rounded-2xl p-8 border border-border shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 xbolt-gradient-gold" />
              <div className="w-12 h-12 rounded-xl xbolt-gradient-gold flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-4">رؤيتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                أن نكون المنصة الأولى للشحن الذكي في منطقة الشرق الأوسط وشمال أفريقيا بحلول 2030، مع الحفاظ على أعلى معايير الجودة والموثوقية وتجربة المستخدم.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider mb-3 block">ما يميزنا</span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">قيمنا الأساسية</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm card-hover text-center">
                <div className="w-14 h-14 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-black text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider mb-3 block">مسيرتنا</span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">رحلة النجاح</h2>
          </motion.div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute right-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            <div className="space-y-8">
              {MILESTONES.map((m, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="flex gap-6 items-start">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl xbolt-gradient-blue flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-sm">{m.year}</span>
                    </div>
                  </div>
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-sm flex-1">
                    <h3 className="font-black text-foreground mb-2 text-lg">{m.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{m.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <span className="text-primary text-sm font-bold uppercase tracking-wider mb-3 block">فريقنا</span>
            <h2 className="text-3xl lg:text-4xl font-black text-foreground">القيادة التنفيذية</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">فريق من المحترفين ذوي الخبرة في قطاعات الشحن والتقنية وخدمة العملاء</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {TEAM.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm card-hover text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <span className="text-white font-black text-xl">{t.initials}</span>
                </div>
                <h3 className="font-black text-foreground text-sm mb-1">{t.name}</h3>
                <p className="text-muted-foreground text-xs">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 xbolt-gradient">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">جاهز للبدء مع XBOLT؟</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">انضم إلى العملاء الذين يثقون في XBOLT لشحن طرودهم يومياً</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="xbolt-gradient-gold text-foreground border-0 font-bold px-8 py-6 rounded-xl shadow-xl glow-gold">
                  احجز شحنتك الأولى
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 rounded-xl">
                  تواصل معنا
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/xbolt-logo-footer_3d0eaba4.webp"
              alt="XBOLT"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/about"><span className="hover:text-primary cursor-pointer transition-colors">{t.nav.about}</span></Link>
            <Link href="/contact"><span className="hover:text-primary cursor-pointer transition-colors">{t.nav.contact}</span></Link>
            <Link href="/privacy"><span className="hover:text-primary cursor-pointer transition-colors">{isRTL ? "سياسة الخصوصية" : "Privacy Policy"}</span></Link>
            <Link href="/terms"><span className="hover:text-primary cursor-pointer transition-colors">{isRTL ? "الشروط والأحكام" : "Terms"}</span></Link>
          </div>
          <p className="text-muted-foreground text-sm">{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
