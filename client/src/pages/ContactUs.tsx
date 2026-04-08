import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare, CheckCircle,
  Building, Headphones, Package, ShieldCheck, Briefcase, Star,
  Scale, Lock, BarChart2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } }),
};

const DEPARTMENTS = [
  { icon: Headphones, email: "support@xbolt.com.sa", color: "bg-blue-50 text-blue-600" },
  { icon: BarChart2, email: "sales@xbolt.com.sa", color: "bg-green-50 text-green-600" },
  { icon: Package, email: "ops@xbolt.com.sa", color: "bg-orange-50 text-orange-600" },
  { icon: Mail, email: "info@xbolt.com.sa", color: "bg-purple-50 text-purple-600" },
  { icon: Building, email: "accounts@xbolt.com.sa", color: "bg-yellow-50 text-yellow-600" },
  { icon: Briefcase, email: "business@xbolt.com.sa", color: "bg-teal-50 text-teal-600" },
  { icon: Star, email: "feedback@xbolt.com.sa", color: "bg-pink-50 text-pink-600" },
  { icon: Scale, email: "legal@xbolt.com.sa", color: "bg-gray-100 text-gray-600" },
  { icon: Lock, email: "privacy@xbolt.com.sa", color: "bg-indigo-50 text-indigo-600" },
  { icon: ShieldCheck, email: "gm@xbolt.com.sa", color: "bg-red-50 text-red-600" },
];

export default function ContactUs() {
  const { t, isRTL } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = isRTL
      ? "اتصل بنا | XBOLT - خدمة عملاء الشحن على مدار الساعة"
      : "Contact Us | XBOLT - 24/7 Shipping Customer Service";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", isRTL
        ? "تواصل مع فريق XBOLT لخدمة الشحن. نحن هنا 24/7 للإجابة على استفساراتك."
        : "Contact XBOLT shipping team. We're here 24/7 to answer your questions."
      );
    }
  }, [isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error(isRTL ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success(isRTL ? "تم إرسال رسالتك بنجاح!" : "Your message was sent successfully!");
  };

  const deptKeys = Object.keys(t.contact.departments).filter(k => k !== 'title') as Array<keyof typeof t.contact.departments>;

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
            <Link href="/about"><span className="text-white/70 hover:text-white text-sm font-medium cursor-pointer transition-colors">{t.nav.about}</span></Link>
            <Link href="/track"><span className="text-white/70 hover:text-white text-sm font-medium cursor-pointer transition-colors">{t.nav.track}</span></Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageToggle className="text-white/70 hover:text-white" />
            <Link href="/book">
              <Button size="sm" className="xbolt-gradient-gold text-foreground border-0 font-bold rounded-xl">{t.nav.bookNow}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="xbolt-gradient py-16">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-16 h-16 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-6 shadow-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">{t.contact.title}</h1>
            <p className="text-white/70 text-lg max-w-xl mx-auto">{t.contact.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Info Cards ── */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Phone, title: isRTL ? "اتصل بنا" : "Call Us", value: "+966550777809", sub: isRTL ? "الأحد – الخميس، 8ص – 10م" : "Sun–Thu, 8AM–10PM", color: "bg-blue-50 text-blue-600", href: "tel:+966550777809" },
              { icon: Mail, title: isRTL ? "البريد الإلكتروني" : "Email", value: "info@xbolt.com.sa", sub: isRTL ? "نرد خلال ساعتين" : "Reply within 2 hours", color: "bg-green-50 text-green-600", href: "mailto:info@xbolt.com.sa" },
              { icon: MapPin, title: isRTL ? "موقعنا" : "Location", value: isRTL ? "الخبر، المنطقة الشرقية" : "Al Khobar, Eastern Region", sub: isRTL ? "المملكة العربية السعودية" : "Saudi Arabia", color: "bg-purple-50 text-purple-600", href: "#" },
              { icon: Clock, title: isRTL ? "ساعات العمل" : "Working Hours", value: isRTL ? "24/7 دعم إلكتروني" : "24/7 Online Support", sub: isRTL ? "الأحد – الخميس 8ص – 10م" : "Sun–Thu 8AM–10PM", color: "bg-amber-50 text-amber-600", href: "#" },
            ].map((c, i) => (
              <motion.a key={i} href={c.href} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl p-5 border border-border shadow-sm card-hover block text-center no-underline">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-3`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{c.title}</h3>
                <p className="font-black text-foreground text-sm">{c.value}</p>
                <p className="text-muted-foreground text-xs mt-1">{c.sub}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Departments ── */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-2xl font-black text-foreground mb-2">
                  {isRTL ? "أرسل لنا رسالة" : "Send Us a Message"}
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {isRTL ? "سنرد عليك خلال ساعتين في أوقات العمل" : "We'll reply within 2 hours during business hours"}
                </p>

                {sent ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">
                      {isRTL ? "تم الإرسال بنجاح!" : "Message Sent!"}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {isRTL ? "سيتواصل معك فريقنا خلال ساعتين" : "Our team will contact you within 2 hours"}
                    </p>
                    <Button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                      variant="outline" className="rounded-xl">
                      {isRTL ? "إرسال رسالة أخرى" : "Send Another Message"}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t.contact.form.name} *</label>
                        <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                          placeholder={isRTL ? "محمد أحمد" : "John Smith"} className="rounded-xl h-11" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t.contact.form.email} *</label>
                        <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                          placeholder="example@email.com" className="rounded-xl h-11" dir="ltr" required />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t.contact.form.phone}</label>
                        <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                          placeholder="+966 5X XXX XXXX" className="rounded-xl h-11" dir="ltr" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">{t.contact.form.subject}</label>
                        <Input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                          placeholder={isRTL ? "استفسار عن شحنة" : "Shipment inquiry"} className="rounded-xl h-11" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">{t.contact.form.message} *</label>
                      <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                        placeholder={isRTL ? "اكتب رسالتك هنا..." : "Write your message here..."} rows={5} required
                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    </div>
                    <Button type="submit" disabled={sending} className="w-full xbolt-gradient-blue text-white border-0 font-bold h-12 rounded-xl shadow-lg">
                      {sending ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {isRTL ? "جارٍ الإرسال..." : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {t.contact.form.submit}
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Departments */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-3">
              <h2 className="text-xl font-black text-foreground mb-4">{t.contact.departments.title}</h2>
              {deptKeys.map((key, i) => {
                const dept = t.contact.departments[key] as { name: string; email: string; desc: string };
                const DeptIcon = DEPARTMENTS[i]?.icon || Mail;
                const color = DEPARTMENTS[i]?.color || "bg-blue-50 text-blue-600";
                return (
                  <div key={key} className="bg-card rounded-2xl p-4 border border-border shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <DeptIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm mb-0.5">{dept.name}</h3>
                        <p className="text-muted-foreground text-xs mb-1.5">{dept.desc}</p>
                        <a href={`mailto:${dept.email}`} className="text-primary text-xs font-medium hover:underline break-all" dir="ltr">
                          {dept.email}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* WhatsApp */}
              <a href="https://wa.me/966550777809" target="_blank" rel="noopener noreferrer"
                className="block bg-green-500 hover:bg-green-600 transition-colors rounded-2xl p-5 text-white text-center shadow-lg mt-4">
                <div className="flex items-center justify-center gap-2 font-bold">
                  <MessageSquare className="w-5 h-5" />
                  {isRTL ? "تواصل عبر واتساب" : "Chat on WhatsApp"}
                </div>
                <p className="text-green-100 text-xs mt-1">
                  {isRTL ? "ردود فورية خلال دقائق" : "Instant replies within minutes"}
                </p>
              </a>
            </motion.div>
          </div>
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
