import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Package, Globe, MapPin, Shield, Zap, Star, ArrowLeft,
  Truck, Clock, CheckCircle, Phone, Mail, Award, TrendingUp,
  Search, ChevronLeft, Calculator
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const }
  })
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [trackingInput, setTrackingInput] = useState("");

  const handleTrack = () => {
    if (!trackingInput.trim()) {
      toast.error(isRTL ? "الرجاء إدخال رقم التتبع" : "Please enter a tracking number");
      return;
    }
    navigate(`/track/${trackingInput.trim()}`);
  };

  const stats = [
    { value: t.stats.shipmentsValue, label: t.stats.shipments, icon: Package },
    { value: t.stats.countriesValue, label: t.stats.countries, icon: Globe },
    { value: t.stats.successValue, label: t.stats.successRate, icon: CheckCircle },
    { value: t.stats.supportValue, label: t.stats.support, icon: Clock },
  ];

  const services = [
    {
      icon: Truck,
      title: t.services.local.title,
      desc: t.services.local.desc,
      color: "from-blue-500 to-blue-700",
      features: t.services.local.features,
      price: t.services.local.price,
      href: "/book",
    },
    {
      icon: Globe,
      title: t.services.international.title,
      desc: t.services.international.desc,
      color: "from-purple-500 to-purple-700",
      features: t.services.international.features,
      price: t.services.international.price,
      href: "/book",
    },
  ];

  const features = [
    { icon: Zap, title: t.features.fast.title, desc: t.features.fast.desc },
    { icon: Shield, title: t.features.insurance.title, desc: t.features.insurance.desc },
    { icon: MapPin, title: t.features.tracking.title, desc: t.features.tracking.desc },
    { icon: Award, title: t.features.rewards.title, desc: t.features.rewards.desc },
    { icon: TrendingUp, title: t.features.pricing.title, desc: t.features.pricing.desc },
    { icon: Star, title: t.features.service.title, desc: t.features.service.desc },
  ];

  const steps = [
    { n: "01", title: t.howItWorks.step1.title, desc: t.howItWorks.step1.desc },
    { n: "02", title: t.howItWorks.step2.title, desc: t.howItWorks.step2.desc },
    { n: "03", title: t.howItWorks.step3.title, desc: t.howItWorks.step3.desc },
    { n: "04", title: t.howItWorks.step4.title, desc: t.howItWorks.step4.desc },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 xbolt-gradient border-b border-white/10 shadow-md">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png"
                alt="XBOLT"
                className="h-8 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <a href="/#services">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.services}</Button>
            </a>
            <Link href="/track">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.track}</Button>
            </Link>
            <Link href="/book">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.book}</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.about}</Button>
            </Link>
            <Link href="/contact">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.contact}</Button>
            </Link>
            <Link href="/shipping-guide">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">دليل الشحن</Button>
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-shipments">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.myShipments}</Button>
                </Link>
                <Link href="/rewards">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.rewards}</Button>
                </Link>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.admin}</Button>
                  </Link>
                )}
                {user?.role === "employee" && (
                  <Link href="/employee">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 font-medium">{t.nav.employee}</Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side: Language Toggle + Auth */}
          <div className="flex items-center gap-2">
            <LanguageToggle className="text-white/80 hover:text-white" />
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                  <div className="w-6 h-6 rounded-full xbolt-gradient-blue flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.[0] || (isRTL ? "م" : "U")}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{user?.name || (isRTL ? "مستخدم" : "User")}</span>
                </div>
                <Link href="/book">
                  <Button size="sm" className="xbolt-gradient-blue text-white border-0 shadow-md font-semibold">
                    {t.nav.bookNow}
                  </Button>
                </Link>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm" className="xbolt-gradient-blue text-white border-0 shadow-md font-semibold">
                  {t.nav.login}
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Full-width truck background image (like DHL style) */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/truck-orange-warehouse_58b0f943.png"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay: Deep Navy gradient for readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, rgba(12,39,60,0.97) 0%, rgba(12,39,60,0.92) 40%, rgba(12,39,60,0.65) 70%, rgba(12,39,60,0.35) 100%)' }} />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-white"
            >
              <motion.div variants={fadeUp} custom={0}>
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm mb-6 px-4 py-1.5 text-sm font-medium">
                  <Star className="w-3.5 h-3.5 ml-1.5 text-yellow-400" />
                  {t.hero.badge}
                </Badge>
              </motion.div>

              <motion.h1 variants={fadeUp} custom={1} className="text-5xl lg:text-7xl font-black leading-tight mb-6">
                {t.hero.title1}
                <span className="block shimmer-text">{t.hero.title2}</span>
                <span className="text-white/80 text-4xl lg:text-5xl font-bold">{t.hero.title3}</span>
              </motion.h1>

              <motion.p variants={fadeUp} custom={2} className="text-white/70 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg">
                {t.hero.subtitle}
              </motion.p>

              {/* Quick Track */}
              <motion.div variants={fadeUp} custom={3} className="glass rounded-2xl p-4 mb-8 max-w-lg">
                <p className="text-white/60 text-sm mb-3 font-medium">{t.hero.trackLabel}</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackingInput}
                    onChange={e => setTrackingInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleTrack()}
                    placeholder={t.hero.trackPlaceholder}
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none focus:border-white/50 transition-colors"
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <Button onClick={handleTrack} className="bg-white text-primary hover:bg-white/90 font-semibold rounded-xl px-4">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
                <Link href="/book">
                  <Button size="lg" className="xbolt-gradient-blue text-white border-0 font-bold shadow-xl glow-orange px-8 py-6 text-base rounded-xl">
                    {t.hero.bookBtn}
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </Button>
                </Link>
                <Link href="/track">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-base rounded-xl backdrop-blur-sm">
                    {t.hero.trackBtn}
                  </Button>
                </Link>
                <Link href="/price-calculator">
                  <Button size="lg" variant="outline" className="border-amber-400/50 text-amber-300 hover:bg-amber-400/10 font-semibold px-8 py-6 text-base rounded-xl backdrop-blur-sm">
                    <Calculator className="w-4 h-4 ml-2" />
                    {isRTL ? 'احسب السعر' : 'Calculate Price'}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-white/60 text-sm">رقم التتبع</p>
                      <p className="text-white font-mono font-bold text-lg">XB1A2B3C4D</p>
                    </div>
                    <div className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                      <span className="text-green-400 text-xs font-semibold">في الطريق</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3 mb-6">
                    {[
                      { label: "تم الاستلام", done: true, time: "10:00 ص" },
                      { label: "في المستودع", done: true, time: "12:30 م" },
                      { label: "في الطريق", done: true, time: "02:00 م" },
                      { label: "التسليم", done: false, time: "اليوم" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-green-500" : "bg-white/20"}`}>
                          {step.done ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-white/50" />}
                        </div>
                        <div className="flex-1">
                          <div className={`h-0.5 rounded-full ${step.done ? "bg-green-500/50" : "bg-white/10"}`} />
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${step.done ? "text-white" : "text-white/40"}`}>{step.label}</p>
                          <p className="text-white/40 text-xs">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/30 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">التسليم المتوقع</p>
                      <p className="text-white/60 text-xs">اليوم بين 4-6 مساءً</p>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -left-6 glass rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full xbolt-gradient-gold flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">+50 نقطة</p>
                      <p className="text-white/60 text-xs">مكافأة التسليم</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-3 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500/30 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">تم التسليم!</p>
                      <p className="text-white/60 text-xs">الرياض، حي النخيل</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 inset-x-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 66.7C120 53.3 240 26.7 360 20C480 13.3 600 26.7 720 33.3C840 40 960 40 1080 33.3C1200 26.7 1320 13.3 1380 6.7L1440 0V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="oklch(0.98 0.005 240)" />
          </svg>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl lg:text-4xl font-black text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Carriers Strip ─────────────────────────────────────────────────────── */}
      <section className="py-10 bg-card border-y border-border/50">
        <div className="container">
          <p className="text-center text-muted-foreground text-sm font-medium mb-8">
            {isRTL ? 'شريك الشحن الدولي المعتمد' : 'Our International Shipping Partner'}
          </p>
          <div className="flex items-center justify-center">
            {/* DHL Official Logo */}
            <div className="flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/DHL_Logo_official_68ef29eb.png"
                alt="DHL Express"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 bg-secondary/30">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5">{t.services.sectionBadge}</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
              {t.services.sectionTitle}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.services.sectionDesc}
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[{
              ...services[0],
              image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/van-navy_1a57cdbf.png"
            }, {
              ...services[1],
              image: "https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/container-blue_0df51f87.png"
            }].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="card-hover"
              >
                <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border/50">
                  <div className={`bg-gradient-to-br ${service.color} p-8 relative overflow-hidden min-h-[200px]`}>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10"
                      style={{ backgroundImage: "radial-gradient(circle at 70% 30%, white 0%, transparent 60%)" }} />
                    {/* Service image */}
                    <div className="absolute bottom-0 right-0 w-48 h-36 opacity-30 pointer-events-none">
                      <img src={service.image} alt="" className="w-full h-full object-contain object-bottom" />
                    </div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4 shadow-lg">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">{service.title}</h3>
                      <p className="text-white/80 leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-2 mb-6">
                      {service.features.map((f, j) => (
                        <div key={j} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-foreground/80 text-sm font-medium">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-bold text-lg">{service.price}</span>
                      <Link href={service.href}>
                        <Button className="xbolt-gradient-blue text-white border-0 font-semibold rounded-xl">
                          {t.services.bookBtn}
                          <ChevronLeft className="w-4 h-4 mr-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5">{t.howItWorks.sectionBadge}</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
              {t.howItWorks.sectionTitle}
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center"
              >
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl xbolt-gradient flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <span className="text-white font-black text-xl">{step.n}</span>
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5">{t.features.sectionBadge}</Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-5xl font-black text-foreground mb-4">
              {t.features.sectionTitle}
            </motion.h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`bg-card rounded-2xl p-6 border border-border/50 card-hover shadow-sm ${i === 1 ? 'cursor-pointer' : ''}`}
                onClick={i === 1 ? () => window.location.href = '/insurance-info' : undefined}
              >
                <div className="w-12 h-12 rounded-xl xbolt-gradient-blue flex items-center justify-center mb-4 shadow-md">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                {i === 1 && (
                  <p className="text-primary text-xs font-semibold mt-3 flex items-center gap-1">
                    <span>{isRTL ? 'اعرف أكثر' : 'Learn more'}</span>
                    <ChevronLeft className="w-3 h-3" />
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>      {/* ── Price Calculator CTA ──────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#0C273C] to-[#1a3a52] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Text side */}
              <div className="p-10 lg:p-14 flex flex-col justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
                  <Calculator className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
                  {isRTL ? (
                    <>احسب سعر شحنتك <span className="text-amber-400">الآن</span></>
                  ) : (
                    <>Calculate Your Price <span className="text-amber-400">Now</span></>
                  )}
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  {isRTL
                    ? 'وفّر وقتك ومجهودك واحصل على سعر أفضل من DHL بسهولة — بدون تسجيل'
                    : 'Save time and effort and get a better price than DHL easily — no registration required'}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/price-calculator">
                    <Button size="lg" className="xbolt-gradient-gold text-foreground border-0 font-bold rounded-xl shadow-lg px-8">
                      <Calculator className="w-5 h-5 ml-2" />
                      {isRTL ? 'احسب السعر الآن' : 'Calculate Price Now'}
                    </Button>
                  </Link>
                  <Link href="/book">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl px-8">
                      {isRTL ? 'احجز مباشرة' : 'Book Directly'}
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Stats side */}
              <div className="bg-[#F14E23]/10 p-10 lg:p-14 flex flex-col justify-center gap-6" dir={isRTL ? 'rtl' : 'ltr'}>
                {[
                  { label: isRTL ? 'توفير متوسط مقارنة بـ DHL مباشرةً' : 'Average saving vs. DHL direct', value: 'حتى 30%', color: 'text-amber-400' },
                  { label: isRTL ? 'نتيجة خلال ثواني' : 'Result in seconds', value: '< 5 ثواني', color: 'text-green-400' },
                  { label: isRTL ? 'بدون تسجيل أو بيانات بنكية' : 'No registration or bank details', value: '100%', color: 'text-blue-400' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                    <span className="text-white/70 text-sm">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Brand Showcase ──────────────────────────────────────────────────────── */}     <section className="py-20 bg-[#0C273C] overflow-hidden">
        <div className="container">
          {/* Row 1: Big image left + text right (DHL style) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden mb-6 shadow-2xl"
          >
            {/* Image */}
            <div className="relative h-80 lg:h-auto min-h-[360px] bg-[#13354C] flex items-center justify-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/truck-navy-transparent_c81e80dd.png"
                alt="XBOLT Truck"
                className="w-full h-full object-contain p-6 drop-shadow-2xl"
              />
            </div>
            {/* Text */}
            <div className="bg-[#F14E23] p-10 lg:p-14 flex flex-col justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
              <p className="text-white/80 text-sm font-semibold uppercase tracking-widest mb-3">
                {isRTL ? "أسطولنا" : "Our Fleet"}
              </p>
              <h2 className="text-white font-black text-3xl lg:text-4xl mb-4 leading-tight">
                {isRTL ? "شبكة لوجستية متكاملة" : "Complete Logistics Network"}
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                {isRTL
                  ? "أسطول متنوع من الشاحنات والمركبات والحاويات لتلبية جميع احتياجات الشحن الدولي والمحلي بكفاءة عالية."
                  : "A diverse fleet of trucks, vehicles and containers to meet all international and local shipping needs with high efficiency."}
              </p>
            </div>
          </motion.div>

          {/* Row 2: Three equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Van */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl overflow-hidden bg-[#13354C] shadow-xl group"
            >
              <div className="h-52 flex items-center justify-center p-6 bg-[#1a4060]">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/van-white_b5311138.png"
                  alt="XBOLT Van"
                  className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5" dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className="text-white font-bold text-lg mb-1">{isRTL ? "توصيل سريع" : "Express Delivery"}</h3>
                <p className="text-white/60 text-sm">{isRTL ? "مركبات خفيفة للتوصيل السريع داخل المدن" : "Light vehicles for fast urban delivery"}</p>
              </div>
            </motion.div>

            {/* Card 2: Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl overflow-hidden bg-[#13354C] shadow-xl group"
            >
              <div className="h-52 flex items-center justify-center p-6 bg-[#F14E23]/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/container-orange_ba3b326f.png"
                  alt="XBOLT Container"
                  className="h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5" dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className="text-white font-bold text-lg mb-1">{isRTL ? "شحن بحري" : "Sea Freight"}</h3>
                <p className="text-white/60 text-sm">{isRTL ? "حاويات دولية لجميع الوجهات العالمية" : "International containers to all global destinations"}</p>
              </div>
            </motion.div>

            {/* Card 3: Delivery Person */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl overflow-hidden bg-[#13354C] shadow-xl group"
            >
              <div className="h-52 overflow-hidden">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/delivery-person_9a4da2b1.png"
                  alt="XBOLT Delivery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5" dir={isRTL ? 'rtl' : 'ltr'}>
                <h3 className="text-white font-bold text-lg mb-1">{isRTL ? "توصيل باب لباب" : "Door to Door"}</h3>
                <p className="text-white/60 text-sm">{isRTL ? "خدمة توصيل احترافية من الباب للباب" : "Professional door-to-door delivery service"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 xbolt-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 50%), radial-gradient(circle at 70% 50%, white 0%, transparent 50%)" }} />
        <div className="container relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-black text-white mb-6">
              {t.cta.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
              {t.cta.desc}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
              <Link href="/book">
                <Button size="lg" className="xbolt-gradient-gold text-foreground border-0 font-bold shadow-xl glow-gold px-10 py-6 text-lg rounded-xl">
                  {t.cta.bookBtn}
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-10 py-6 text-lg rounded-xl">
                  {isRTL ? 'تتبع شحنتك' : 'Track Shipment'}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="xbolt-gradient border-t border-white/10 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png"
                  alt="XBOLT"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                {t.footer.desc}
              </p>
              {/* بيانات السجل التجاري */}
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  {/* لوجو وزارة التجارة السعودية */}
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-white/10 flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                      <rect width="24" height="24" rx="3" fill="#006B3F"/>
                      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">تج</text>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] leading-none mb-0.5">{isRTL ? 'وزارة التجارة' : 'Ministry of Commerce'}</p>
                    <span className="text-white/70 text-xs font-mono">{isRTL ? 'الرقم الموحد: 7010XXXXXXX' : 'Unified No: 7010XXXXXXX'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* لوجو هيئة الزكاة والضريبة والجمارك */}
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-white/10 flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                      <rect width="24" height="24" rx="3" fill="#1B4F72"/>
                      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">زكا</text>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] leading-none mb-0.5">{isRTL ? 'هيئة الزكاة والضريبة' : 'Zakat & Tax Authority'}</p>
                    <span className="text-white/70 text-xs font-mono">{isRTL ? 'الرقم الضريبي: 3XXXXXXXXXXX003' : 'VAT No: 3XXXXXXXXXXX003'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <a href="tel:+966550777809" className="flex flex-row-reverse items-center gap-1.5 text-white/60 hover:text-[#F14E23] text-sm transition-colors">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span dir="ltr">+966550777809</span>
                </a>
                <a href="mailto:info@xbolt.com.sa" className="flex flex-row-reverse items-center gap-1.5 text-white/60 hover:text-[#F14E23] text-sm transition-colors">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>info@xbolt.com.sa</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t.footer.servicesTitle}</h4>
              <ul className="space-y-2">
                {[
                  { label: isRTL ? "الشحن المحلي" : "Local Shipping", href: "/book" },
                  { label: isRTL ? "الشحن الدولي" : "International Shipping", href: "/book" },
                  { label: isRTL ? "تتبع الشحنات" : "Track Shipments", href: "/track" },
                  { label: isRTL ? "التأمين على الشحنات" : "Shipment Insurance", href: "/insurance-info" },
                  { label: isRTL ? "احسب السعر" : "Calculate Price", href: "/price-calculator" },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href}>
                      <span className="text-white/60 hover:text-[#F14E23] text-sm transition-colors cursor-pointer">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">{t.footer.companyTitle}</h4>
              <ul className="space-y-2">
                {[
                  { label: t.footer.company[0], href: "/about" },
                  { label: t.footer.company[1], href: "/contact" },
                  { label: t.footer.company[2], href: "/privacy" },
                  { label: t.footer.company[3], href: "/terms" },
                  { label: "دليل الشحن الدولي", href: "/shipping-guide" },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href}>
                      <span className="text-white/60 hover:text-[#F14E23] text-sm transition-colors cursor-pointer">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">{t.footer.copyright}</p>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/xboltsa" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm" aria-label="إنستغرام">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://twitter.com/xboltsa" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-black flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm" aria-label="تويتر X">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://snapchat.com/add/xboltsa" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm" aria-label="سناب شات">
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/></svg>
              </a>
              <a href="https://tiktok.com/@xboltsa" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-black flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm" aria-label="تيك توك">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {t.footer.location}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
