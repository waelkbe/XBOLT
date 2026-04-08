import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, FileText, Package, CreditCard, AlertTriangle, Scale, RefreshCw, Phone, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";



const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const } }),
};

const TERMS_SECTIONS = [
  {
    id: 1,
    icon: FileText,
    title: "أحكام عامة وقبول الشروط",
    content: `باستخدامك لمنصة XBOLT (الموقع الإلكتروني أو التطبيق)، فإنك توافق على الالتزام بهذه الشروط والأحكام بالكامل. إذا كنت لا توافق على أي جزء منها، يُرجى التوقف عن استخدام الخدمة.

تحتفظ XBOLT بالحق في تعديل هذه الشروط في أي وقت، مع إشعار المستخدمين عبر البريد الإلكتروني أو إشعار داخل المنصة. استمرارك في استخدام الخدمة بعد التعديل يُعدّ قبولاً للشروط الجديدة.

هذه الشروط تحكمها أنظمة المملكة العربية السعودية، وأي نزاع يُحال إلى المحاكم المختصة في مدينة الخبر.`,
  },
  {
    id: 2,
    icon: Package,
    title: "شروط الشحن والمحظورات",
    content: `**المواد المحظورة شحنها عبر XBOLT:**
• المواد المتفجرة والأسلحة بجميع أنواعها
• المخدرات والمواد المحظورة قانونياً
• الحيوانات الحية أو المواد العضوية القابلة للتلف (بدون ترتيبات خاصة)
• العملات والمعادن الثمينة غير الموثقة
• أي مواد تنتهك حقوق الملكية الفكرية

**مسؤولية المرسل:**
يتحمل المرسل المسؤولية الكاملة عن دقة وصحة محتويات الشحنة المُعلنة. أي إخفاء أو تضليل في محتوى الشحنة يُعرّض المرسل للمساءلة القانونية وإلغاء الخدمة دون استرداد.

**الوزن والأبعاد:**
تُحتسب رسوم الشحن بناءً على الوزن الفعلي أو الوزن الحجمي (أيهما أكبر). الوزن الحجمي = (الطول × العرض × الارتفاع) ÷ 5000.`,
  },
  {
    id: 3,
    icon: CreditCard,
    title: "الأسعار والدفع والفواتير",
    content: `**الأسعار:**
جميع الأسعار المعروضة بالريال السعودي وتشمل ضريبة القيمة المضافة (15%). تخضع الأسعار للتغيير دون إشعار مسبق، لكن الأسعار المؤكدة عند الحجز تبقى ثابتة.

**طرق الدفع المقبولة:**
مدى، فيزا، ماستركارد، Apple Pay، STC Pay، وتحويل بنكي للعملاء الشركات.

**الفواتير:**
تُرسل فاتورة إلكترونية معتمدة لكل عملية دفع على البريد الإلكتروني المسجل. الفواتير متاحة في حسابك لمدة 3 سنوات.

**رسوم إضافية:**
قد تُطبق رسوم إضافية في حالات: محاولة التوصيل الفاشلة (بعد 3 محاولات)، التخزين الزائد، أو تغيير العنوان بعد الشحن.`,
  },
  {
    id: 4,
    icon: RefreshCw,
    title: "سياسة الإلغاء والاسترداد",
    content: `**إلغاء الطلب:**
• قبل استلام الشحنة: إلغاء مجاني كامل مع استرداد فوري
• بعد الاستلام وقبل الشحن: استرداد 80% من قيمة الطلب
• بعد بدء الشحن: لا يمكن الإلغاء، لكن يمكن إعادة التوجيه برسوم إضافية

**حالات الاسترداد الكامل:**
• تأخر التوصيل عن الموعد المضمون بأكثر من 48 ساعة
• تلف الشحنة الموثق أثناء النقل
• فقدان الشحنة المؤكد بعد التحقيق

**مدة الاسترداد:**
3-7 أيام عمل للبطاقات الائتمانية، 1-3 أيام لمدى وMada.

**تقديم طلب الاسترداد:**
خلال 14 يوماً من تاريخ التسليم المتوقع عبر صفحة "شحناتي" أو التواصل مع خدمة العملاء.`,
  },
  {
    id: 5,
    icon: AlertTriangle,
    title: "المسؤولية والتعويض",
    content: `**حدود مسؤولية XBOLT:**
تتحمل XBOLT المسؤولية عن الأضرار المباشرة الناتجة عن إهمال موثق من جانبها، وفق قيمة الشحنة المُعلنة مع التأمين المفعّل.

**إخلاء المسؤولية:**
لا تتحمل XBOLT المسؤولية عن:
• الأضرار الناتجة عن التعبئة غير الملائمة من قِبل المرسل
• التأخير بسبب ظروف قاهرة (كوارث طبيعية، إضرابات، قرارات حكومية)
• الخسائر غير المباشرة أو الأرباح الفائتة
• محتويات الشحنة غير المُعلنة أو المحظورة

**التأمين الاختياري:**
يُنصح بشدة بتفعيل التأمين الإضافي للشحنات ذات القيمة العالية. يغطي التأمين حتى 50,000 ريال بنسبة 1.5% من قيمة المحتوى.`,
  },
  {
    id: 6,
    icon: Scale,
    title: "حل النزاعات والقانون الحاكم",
    content: `**مرحلة التسوية الودية:**
في حال أي نزاع، يُلزم الطرفان بمحاولة التسوية الودية خلال 30 يوماً من تاريخ الإخطار الرسمي بالنزاع.

**الوساطة:**
إذا تعذرت التسوية الودية، يُحال النزاع إلى الوساطة عبر مركز التحكيم التجاري لدول مجلس التعاون الخليجي.

**القانون الحاكم:**
تخضع هذه الشروط لأنظمة المملكة العربية السعودية، وتختص محاكم مدينة الخبر بالفصل في أي نزاعات.

**لغة العقد:**
النسخة العربية من هذه الشروط هي النسخة المعتمدة قانونياً. أي ترجمة لأغراض مرجعية فقط.`,
  },
];

export default function TermsAndConditions() {
  const [openSection, setOpenSection] = useState<number | null>(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = "الشروط والأحكام | XBOLT - خدمات الشحن المحلي والدولي";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "شروط وأحكام استخدام منصة XBOLT للشحن. تعرف على سياسة الإلغاء والاسترداد، المواد المحظورة، وحدود المسؤولية. محدّث مارس 2026.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* ── Header ── */}
      <header className="xbolt-gradient border-b border-white/10 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png" alt="XBOLT" className="h-8 w-auto object-contain" />
              <span className="text-white font-black text-lg">XBOLT</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 ml-1" />
              الرئيسية
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="xbolt-gradient py-14">
        <div className="container text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <div className="w-16 h-16 rounded-2xl xbolt-gradient-gold flex items-center justify-center mx-auto mb-5 shadow-xl">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">الشروط والأحكام</h1>
            <p className="text-white/60 text-sm">آخر تحديث: مارس 2026 | يُرجى قراءتها بعناية قبل استخدام الخدمة</p>
          </motion.div>
        </div>
      </section>

      {/* ── Quick Summary ── */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container max-w-4xl">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h2 className="font-black text-amber-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              ملخص النقاط الأساسية
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "إلغاء مجاني قبل استلام الشحنة",
                "يوجد تأمين على الشحنات",
                "المواد المحظورة ممنوع شحنها تماماً",
                "الأسعار تشمل ضريبة القيمة المضافة",
                "القانون السعودي يحكم جميع النزاعات",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-2 text-amber-800 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Accordion Sections ── */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-3">
            {TERMS_SECTIONS.map((section, i) => (
              <motion.div key={section.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-3 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl xbolt-gradient-blue flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-foreground">{section.title}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${openSection === section.id ? "rotate-180" : ""}`} />
                </button>
                {openSection === section.id && (
                  <div className="px-6 pb-6 border-t border-border">
                    <div className="pt-5 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                      {section.content.split('\n').map((line, j) => (
                        <p key={j} className={line.startsWith('**') ? "font-bold text-foreground mt-4 mb-1" : line.startsWith('•') ? "mr-4 mb-1" : "mb-2"}>
                          {line.startsWith('**') ? line.replace(/\*\*/g, '') : line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Acceptance */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-8 bg-card rounded-2xl border border-border shadow-sm p-6 text-center">
            <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-black text-foreground mb-2 text-lg">هل لديك استفسار حول الشروط؟</h3>
            <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
              إذا كان لديك أي سؤال حول هذه الشروط أو كيفية تطبيقها، فريقنا القانوني جاهز للإجابة.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact">
                <Button className="xbolt-gradient-blue text-white border-0 font-bold rounded-xl">
                  <Phone className="w-4 h-4 ml-2" />
                  تواصل مع فريق الدعم
                </Button>
              </Link>
              <a href="mailto:legal@xbolt.com.sa">
                <Button variant="outline" className="rounded-xl font-semibold" dir="ltr">legal@xbolt.com.sa</Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/xbolt-logo-footer_3d0eaba4.webp" alt="XBOLT" className="h-7 w-auto object-contain" />
            <span className="font-black text-foreground">XBOLT</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/about"><span className="hover:text-primary cursor-pointer transition-colors">من نحن</span></Link>
            <Link href="/contact"><span className="hover:text-primary cursor-pointer transition-colors">اتصل بنا</span></Link>
            <Link href="/privacy"><span className="hover:text-primary cursor-pointer transition-colors">سياسة الخصوصية</span></Link>
            <Link href="/terms"><span className="hover:text-primary cursor-pointer transition-colors font-bold text-primary">الشروط والأحكام</span></Link>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 XBOLT. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
