import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Zap, Shield, Eye, Lock, Database, Bell, UserCheck, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";



const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const } }),
};

const SECTIONS = [
  {
    icon: Database,
    title: "المعلومات التي نجمعها",
    content: [
      { subtitle: "معلومات الحساب", text: "عند إنشاء حساب، نجمع: الاسم الكامل، عنوان البريد الإلكتروني، رقم الجوال، وكلمة المرور المشفرة." },
      { subtitle: "معلومات الشحنة", text: "عنوان المرسل والمستلم، محتويات الطرد، الوزن والأبعاد، وتفاصيل الدفع (مشفرة ومحمية)." },
      { subtitle: "بيانات الاستخدام", text: "عنوان IP، نوع المتصفح، الصفحات التي تزورها، ومدة الجلسة — لتحسين تجربتك." },
      { subtitle: "الموقع الجغرافي", text: "موقعك التقريبي لتحديد أقرب مراكز الشحن وتقدير وقت التوصيل." },
    ],
  },
  {
    icon: Eye,
    title: "كيف نستخدم معلوماتك",
    content: [
      { subtitle: "تقديم الخدمة", text: "معالجة طلبات الشحن، تتبع الطرود، وإرسال إشعارات حالة الشحنة." },
      { subtitle: "تحسين الخدمة", text: "تحليل أنماط الاستخدام لتطوير ميزات جديدة وتحسين الأداء." },
      { subtitle: "التواصل", text: "إرسال تأكيدات الطلبات، تحديثات الحالة، والعروض الترويجية (بموافقتك)." },
      { subtitle: "الأمان والامتثال", text: "منع الاحتيال، الامتثال للمتطلبات القانونية، وحماية حقوق جميع المستخدمين." },
    ],
  },
  {
    icon: Lock,
    title: "حماية معلوماتك",
    content: [
      { subtitle: "التشفير", text: "جميع البيانات المنقولة محمية بتشفير SSL/TLS 256-bit. بيانات الدفع مشفرة وفق معيار PCI-DSS." },
      { subtitle: "التخزين الآمن", text: "بياناتك مخزنة على خوادم آمنة في مراكز بيانات معتمدة داخل المملكة العربية السعودية." },
      { subtitle: "التحكم في الوصول", text: "وصول محدود للموظفين المصرح لهم فقط، مع سجلات تدقيق كاملة لكل وصول." },
      { subtitle: "النسخ الاحتياطي", text: "نسخ احتياطية يومية مشفرة لضمان عدم فقدان بياناتك في أي حال." },
    ],
  },
  {
    icon: UserCheck,
    title: "حقوقك",
    content: [
      { subtitle: "الاطلاع", text: "يحق لك طلب نسخة كاملة من بياناتك الشخصية المحفوظة لدينا في أي وقت." },
      { subtitle: "التصحيح", text: "يمكنك تعديل أو تصحيح أي معلومات غير دقيقة من خلال إعدادات حسابك." },
      { subtitle: "الحذف", text: "يحق لك طلب حذف حسابك وجميع بياناتك الشخصية، مع الاحتفاظ بما يلزم قانونياً." },
      { subtitle: "إلغاء الاشتراك", text: "يمكنك إلغاء الاشتراك في الرسائل التسويقية في أي وقت من إعدادات الإشعارات." },
    ],
  },
  {
    icon: Bell,
    title: "ملفات تعريف الارتباط (Cookies)",
    content: [
      { subtitle: "الضرورية", text: "ملفات تعريف أساسية لتشغيل الموقع وتذكر جلسة تسجيل دخولك." },
      { subtitle: "الأداء", text: "نستخدم أدوات تحليل مجهولة الهوية لفهم كيفية استخدام الموقع وتحسينه." },
      { subtitle: "التفضيلات", text: "تذكر إعداداتك المفضلة مثل اللغة والمنطقة الجغرافية." },
      { subtitle: "التحكم", text: "يمكنك إدارة أو حذف ملفات تعريف الارتباط من إعدادات متصفحك في أي وقت." },
    ],
  },
  {
    icon: Shield,
    title: "مشاركة البيانات مع أطراف ثالثة",
    content: [
      { subtitle: "شركاء التوصيل", text: "نشارك معلومات الشحنة الضرورية فقط مع شركاء التوصيل المعتمدين لإتمام الخدمة." },
      { subtitle: "معالجو الدفع", text: "بيانات الدفع تُعالج مباشرة من بوابات دفع معتمدة (مدى، Visa، Mastercard) ولا نحتفظ بها." },
      { subtitle: "الجهات الحكومية", text: "نلتزم بالإفصاح عند الطلب القانوني الرسمي من الجهات المختصة في المملكة." },
      { subtitle: "لا بيع للبيانات", text: "نؤكد صراحةً أننا لا نبيع أو نؤجر بياناتك الشخصية لأي طرف ثالث لأغراض تجارية." },
    ],
  },
];

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = "سياسة الخصوصية | XBOLT - حماية بياناتك أولويتنا";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", "سياسة خصوصية XBOLT: كيف نجمع ونستخدم ونحمي بياناتك الشخصية. نلتزم بأعلى معايير حماية البيانات وفق نظام حماية البيانات الشخصية السعودي.");
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
            <div className="w-16 h-16 rounded-2xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-5 shadow-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-3">سياسة الخصوصية</h1>
            <p className="text-white/60 text-sm">آخر تحديث: مارس 2026 | سارية المفعول منذ: يناير 2024</p>
          </motion.div>
        </div>
      </section>

      {/* ── Intro ── */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container max-w-4xl">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <p className="text-blue-800 leading-relaxed text-sm">
              <strong>ملخص سريع:</strong> في XBOLT، خصوصيتك ليست مجرد التزام قانوني — إنها قيمة أساسية نؤمن بها. نجمع فقط ما نحتاجه لتقديم الخدمة، نحميه بأعلى معايير التشفير، ولا نبيعه أبداً. هذه السياسة تشرح بالتفصيل ما نجمعه ولماذا وكيف تتحكم فيه.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-12 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-8">
            {SECTIONS.map((section, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 p-6 border-b border-border bg-secondary/30">
                  <div className="w-10 h-10 rounded-xl xbolt-gradient-blue flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-black text-foreground">{section.title}</h2>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-5">
                  {section.content.map((item, j) => (
                    <div key={j} className="space-y-1">
                      <h3 className="font-bold text-foreground text-sm">{item.subtitle}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legal Compliance */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-8 bg-card rounded-2xl border border-border shadow-sm p-6">
            <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              الامتثال القانوني
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              تلتزم XBOLT بنظام حماية البيانات الشخصية الصادر بالمرسوم الملكي رقم م/19 لعام 1443هـ، ولوائح هيئة الاتصالات وتقنية المعلومات في المملكة العربية السعودية. كما نلتزم بمعايير ISO 27001 لأمن المعلومات.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              في حال وجود أي تعارض بين هذه السياسة والقوانين المحلية المعمول بها، تسود أحكام القانون. لأي استفسار قانوني، تواصل مع مسؤول حماية البيانات لدينا على: <a href="mailto:privacy@xbolt.com.sa" className="text-primary hover:underline" dir="ltr">privacy@xbolt.com.sa</a>
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-6 bg-secondary/50 rounded-2xl p-6 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-black text-foreground mb-2">هل لديك سؤال حول خصوصيتك؟</h3>
            <p className="text-muted-foreground text-sm mb-4">فريق حماية البيانات لدينا جاهز للإجابة</p>
            <Link href="/contact">
              <Button className="xbolt-gradient-blue text-white border-0 font-bold rounded-xl">تواصل مع فريق الخصوصية</Button>
            </Link>
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
            <Link href="/privacy"><span className="hover:text-primary cursor-pointer transition-colors font-bold text-primary">سياسة الخصوصية</span></Link>
            <Link href="/terms"><span className="hover:text-primary cursor-pointer transition-colors">الشروط والأحكام</span></Link>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 XBOLT. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
