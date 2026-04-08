import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertCircle, ArrowLeft, Package, Globe, Clock, FileText, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } }),
};

export default function InsuranceInfo() {
  const { isRTL } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = isRTL ? "التأمين على الشحنات | XBOLT" : "Shipment Insurance | XBOLT";
  }, [isRTL]);

  const coverageItems = isRTL ? [
    { icon: Package, title: "الفقدان الكلي", desc: "تغطية كاملة في حالة فقدان الشحنة بالكامل أثناء النقل أو التخزين المؤقت." },
    { icon: AlertCircle, title: "التلف والكسر", desc: "تعويض عن أي تلف أو كسر يحدث للبضاعة أثناء عمليات النقل والمناولة." },
    { icon: Globe, title: "الشحن الدولي", desc: "تغطية شاملة للشحنات الدولية من باب إلى باب في أكثر من 120 دولة." },
    { icon: Clock, title: "التأخير الجمركي", desc: "تغطية الأضرار الناجمة عن التأخير في التخليص الجمركي في بعض الحالات." },
  ] : [
    { icon: Package, title: "Total Loss", desc: "Full coverage in case of complete loss of shipment during transit or temporary storage." },
    { icon: AlertCircle, title: "Damage & Breakage", desc: "Compensation for any damage or breakage occurring during transport and handling." },
    { icon: Globe, title: "International Shipping", desc: "Comprehensive coverage for international door-to-door shipments in 120+ countries." },
    { icon: Clock, title: "Customs Delay", desc: "Coverage for damages resulting from customs clearance delays in certain cases." },
  ];

  const plans = isRTL ? [
    {
      name: "الأساسي",
      price: "0.5%",
      priceDesc: "من قيمة الشحنة",
      color: "from-blue-500 to-blue-700",
      features: ["تغطية الفقدان الكلي", "تغطية التلف الجزئي", "حد أقصى 5,000 ريال", "معالجة المطالبات خلال 7 أيام"],
      recommended: false,
    },
    {
      name: "المتقدم",
      price: "1%",
      priceDesc: "من قيمة الشحنة",
      color: "from-orange-500 to-red-600",
      features: ["تغطية الفقدان الكلي", "تغطية التلف الكامل", "حد أقصى 20,000 ريال", "معالجة المطالبات خلال 3 أيام", "تغطية الشحن الدولي"],
      recommended: true,
    },
    {
      name: "الشامل",
      price: "1.5%",
      priceDesc: "من قيمة الشحنة",
      color: "from-purple-500 to-purple-700",
      features: ["تغطية شاملة بلا حدود", "تغطية التلف والفقدان", "حد أقصى 100,000 ريال", "معالجة فورية للمطالبات", "تغطية دولية كاملة", "مدير حساب مخصص"],
      recommended: false,
    },
  ] : [
    {
      name: "Basic",
      price: "0.5%",
      priceDesc: "of shipment value",
      color: "from-blue-500 to-blue-700",
      features: ["Total loss coverage", "Partial damage coverage", "Up to SAR 5,000 limit", "Claims processed in 7 days"],
      recommended: false,
    },
    {
      name: "Advanced",
      price: "1%",
      priceDesc: "of shipment value",
      color: "from-orange-500 to-red-600",
      features: ["Total loss coverage", "Full damage coverage", "Up to SAR 20,000 limit", "Claims processed in 3 days", "International shipping coverage"],
      recommended: true,
    },
    {
      name: "Comprehensive",
      price: "1.5%",
      priceDesc: "of shipment value",
      color: "from-purple-500 to-purple-700",
      features: ["Unlimited comprehensive coverage", "Damage & loss coverage", "Up to SAR 100,000 limit", "Instant claims processing", "Full international coverage", "Dedicated account manager"],
      recommended: false,
    },
  ];

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
          <h1 className="text-white font-bold text-lg">{isRTL ? "التأمين على الشحنات" : "Shipment Insurance"}</h1>
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
      <section className="xbolt-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-blue-500 blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full bg-amber-500 blur-3xl" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">
              {isRTL ? "حماية شاملة لشحناتك" : "Complete Protection for Your Shipments"}
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
              {isRTL
                ? "مع XBOLT، شحناتك محمية بالكامل. نقدم خطط تأمين مرنة تناسب جميع أنواع البضائع والميزانيات، مع ضمان تعويض سريع وشفاف في حالة أي حادث."
                : "With XBOLT, your shipments are fully protected. We offer flexible insurance plans for all types of goods and budgets, with guaranteed fast and transparent compensation in case of any incident."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is covered */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-3">
              {isRTL ? "ماذا يغطي التأمين؟" : "What Does Insurance Cover?"}
            </h2>
            <p className="text-muted-foreground">
              {isRTL ? "تغطية شاملة لجميع مخاطر الشحن" : "Comprehensive coverage for all shipping risks"}
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coverageItems.map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-3">
              {isRTL ? "خطط التأمين" : "Insurance Plans"}
            </h2>
            <p className="text-muted-foreground">
              {isRTL ? "اختر الخطة التي تناسب احتياجاتك" : "Choose the plan that suits your needs"}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className={`bg-card rounded-2xl border overflow-hidden shadow-sm ${plan.recommended ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                {plan.recommended && (
                  <div className="bg-primary text-white text-center text-xs font-bold py-2">
                    {isRTL ? "الأكثر شيوعاً" : "Most Popular"}
                  </div>
                )}
                <div className={`bg-gradient-to-br ${plan.color} p-6 text-white`}>
                  <h3 className="text-xl font-black mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">{plan.price}</span>
                    <span className="text-white/70 text-sm">{plan.priceDesc}</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-foreground/80 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/book">
                    <Button className={`w-full font-bold rounded-xl ${plan.recommended ? 'xbolt-gradient-blue text-white border-0' : 'variant-outline'}`}>
                      {isRTL ? "احجز مع هذه الخطة" : "Book with this Plan"}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to claim */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground mb-3">
              {isRTL ? "كيف تقدم مطالبة تأمينية؟" : "How to File an Insurance Claim?"}
            </h2>
          </motion.div>
          <div className="space-y-4">
            {(isRTL ? [
              { n: "01", title: "تواصل معنا فوراً", desc: "في حالة فقدان أو تلف الشحنة، تواصل مع فريق الدعم خلال 24 ساعة من الاستلام." },
              { n: "02", title: "قدم الوثائق المطلوبة", desc: "أرسل فاتورة الشراء، صور الضرر، وأي وثائق داعمة عبر البريد الإلكتروني أو التطبيق." },
              { n: "03", title: "مراجعة المطالبة", desc: "يقوم فريقنا بمراجعة المطالبة خلال 3-7 أيام عمل والتحقق من جميع التفاصيل." },
              { n: "04", title: "صرف التعويض", desc: "بعد الموافقة، يتم صرف التعويض مباشرة إلى حسابك المصرفي خلال 5 أيام عمل." },
            ] : [
              { n: "01", title: "Contact Us Immediately", desc: "In case of loss or damage, contact our support team within 24 hours of receipt." },
              { n: "02", title: "Submit Required Documents", desc: "Send purchase invoice, damage photos, and any supporting documents via email or app." },
              { n: "03", title: "Claim Review", desc: "Our team reviews the claim within 3-7 business days and verifies all details." },
              { n: "04", title: "Compensation Payment", desc: "After approval, compensation is paid directly to your bank account within 5 business days." },
            ]).map((step, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="flex items-start gap-4 bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="w-12 h-12 rounded-xl xbolt-gradient flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white font-black text-sm">{step.n}</span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 xbolt-gradient">
        <div className="container text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <FileText className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-3">
              {isRTL ? "هل لديك استفسار عن التأمين؟" : "Have a question about insurance?"}
            </h2>
            <p className="text-white/70 mb-6">
              {isRTL ? "فريق الدعم متاح 24/7 للإجابة على جميع استفساراتك" : "Support team available 24/7 to answer all your questions"}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:+966550777809">
                <Button size="lg" className="bg-white text-[#0C273C] hover:bg-white/90 font-bold rounded-xl flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  +966550777809
                </Button>
              </a>
              <a href="mailto:insurance@xbolt.com.sa">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  insurance@xbolt.com.sa
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
