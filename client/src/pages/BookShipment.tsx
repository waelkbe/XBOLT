import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";


import {
  Package, Globe, Truck, MapPin, Shield, Zap, CreditCard,
  CheckCircle, ArrowLeft, ArrowRight, FileText, Box,
  Phone, Mail, User, Building, Hash, Scale, Ruler,
  Star, Award, ChevronLeft
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BookingData {
  type: "local" | "international";
  senderName: string; senderPhone: string; senderEmail: string;
  senderDialCode: string; senderShortAddress: string;
  senderCountry: string; senderCity: string; senderAddress: string;
  senderDistrict: string; senderPostalCode: string;
  receiverName: string; receiverPhone: string; receiverEmail: string;
  receiverDialCode: string; receiverShortAddress: string;
  receiverCountry: string; receiverCity: string; receiverAddress: string;
  receiverDistrict: string; receiverPostalCode: string;
  packageType: "document" | "parcel" | "fragile" | "heavy";
  weight: number; length: number; width: number; height: number;
  description: string; declaredValue: number;
  insurance: boolean; expressDelivery: boolean;
  signatureRequired: boolean; packagingService: boolean;
  paymentMethod: "online" | "bank_transfer" | "cash";
  notes: string;
}

const SAUDI_CITIES = ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "تبوك", "بريدة", "أبها", "نجران", "حائل", "الجبيل", "ينبع", "الأحساء"];

// بيانات الدول مع الكود والعلم والمدينة الافتراضية
const COUNTRY_DATA: Record<string, { code: string; flag: string; dialCode: string; defaultCity: string }> = {
  "المملكة العربية السعودية": { code: "SA", flag: "🇸🇦", dialCode: "+966", defaultCity: "الرياض" },
  "الإمارات العربية المتحدة": { code: "AE", flag: "🇦🇪", dialCode: "+971", defaultCity: "دبي" },
  "الكويت": { code: "KW", flag: "🇰🇼", dialCode: "+965", defaultCity: "الكويت" },
  "البحرين": { code: "BH", flag: "🇧🇭", dialCode: "+973", defaultCity: "المنامة" },
  "قطر": { code: "QA", flag: "🇶🇦", dialCode: "+974", defaultCity: "الدوحة" },
  "عُمان": { code: "OM", flag: "🇴🇲", dialCode: "+968", defaultCity: "مسقط" },
  "مصر": { code: "EG", flag: "🇪🇬", dialCode: "+20", defaultCity: "القاهرة" },
  "الأردن": { code: "JO", flag: "🇯🇴", dialCode: "+962", defaultCity: "عمان" },
  "لبنان": { code: "LB", flag: "🇱🇧", dialCode: "+961", defaultCity: "بيروت" },
  "العراق": { code: "IQ", flag: "🇮🇶", dialCode: "+964", defaultCity: "بغداد" },
  "الولايات المتحدة": { code: "US", flag: "🇺🇸", dialCode: "+1", defaultCity: "New York" },
  "المملكة المتحدة": { code: "GB", flag: "🇬🇧", dialCode: "+44", defaultCity: "London" },
  "ألمانيا": { code: "DE", flag: "🇩🇪", dialCode: "+49", defaultCity: "Berlin" },
  "فرنسا": { code: "FR", flag: "🇫🇷", dialCode: "+33", defaultCity: "Paris" },
  "الصين": { code: "CN", flag: "🇨🇳", dialCode: "+86", defaultCity: "Beijing" },
  "الهند": { code: "IN", flag: "🇮🇳", dialCode: "+91", defaultCity: "Mumbai" },
  "باكستان": { code: "PK", flag: "🇵🇰", dialCode: "+92", defaultCity: "Karachi" },
  "تركيا": { code: "TR", flag: "🇹🇷", dialCode: "+90", defaultCity: "Istanbul" },
};
const COUNTRIES = Object.keys(COUNTRY_DATA);

const STEPS = [
  { id: 1, title: "نوع الشحنة", icon: Truck, desc: "اختر نوع الشحن" },
  { id: 2, title: "بيانات المرسل", icon: User, desc: "معلومات المرسل" },
  { id: 3, title: "بيانات المستلم", icon: MapPin, desc: "معلومات المستلم" },
  { id: 4, title: "تفاصيل الطرد", icon: Package, desc: "الوزن والأبعاد" },
  { id: 5, title: "الخدمات الإضافية", icon: Shield, desc: "خدمات إضافية" },
  { id: 6, title: "طريقة الدفع", icon: CreditCard, desc: "اختر طريقة الدفع" },
  { id: 7, title: "المراجعة", icon: FileText, desc: "راجع التفاصيل" },
  { id: 8, title: "الدفع", icon: Star, desc: "أتمم الدفع" },
  { id: 9, title: "التأكيد", icon: CheckCircle, desc: "تأكيد الشحنة" },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function BookShipment() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [createdShipment, setCreatedShipment] = useState<any>(null);

  const [data, setData] = useState<BookingData>({
    type: "local",
    senderName: user?.name || "", senderPhone: user?.phone || "", senderEmail: user?.email || "",
    senderDialCode: "+966", senderShortAddress: "",
    senderCountry: "المملكة العربية السعودية", senderCity: "الرياض",
    senderAddress: "", senderDistrict: "", senderPostalCode: "",
    receiverName: "", receiverPhone: "", receiverEmail: "",
    receiverDialCode: "+966", receiverShortAddress: "",
    receiverCountry: "المملكة العربية السعودية", receiverCity: "جدة",
    receiverAddress: "", receiverDistrict: "", receiverPostalCode: "",
    packageType: "parcel", weight: 1, length: 10, width: 10, height: 10,
    description: "", declaredValue: 0,
    insurance: false, expressDelivery: false, signatureRequired: false, packagingService: false,
    paymentMethod: "online", notes: "",
  });

  const priceQuery = trpc.shipments.calculatePrice.useQuery({
    type: data.type, weight: data.weight,
    expressDelivery: data.expressDelivery, insurance: data.insurance,
    packagingService: data.packagingService, signatureRequired: data.signatureRequired,
  });

  const createMutation = trpc.shipments.create.useMutation({
    onSuccess: (shipment) => {
      setCreatedShipment(shipment);
      goTo(9);
      toast.success("تم إنشاء الشحنة بنجاح!");
    },
    onError: (err) => toast.error(err.message || "حدث خطأ أثناء إنشاء الشحنة"),
  });

  const confirmPaymentMutation = trpc.shipments.confirmPayment.useMutation({
    onSuccess: () => {
      goTo(9);
      toast.success("تم تأكيد الدفع بنجاح!");
    },
    onError: (err) => toast.error(err.message),
  });

  const set = (key: keyof BookingData, value: any) => setData(prev => ({ ...prev, [key]: value }));

  // عند تغيير دولة المرسل: تحديث المدينة الافتراضية وكود الدولة تلقائياً
  const handleSenderCountryChange = useCallback((country: string) => {
    const info = COUNTRY_DATA[country];
    setData(prev => ({
      ...prev,
      senderCountry: country,
      senderCity: info?.defaultCity || "",
      senderDialCode: info?.dialCode || "+966",
    }));
  }, []);

  // عند تغيير دولة المستلم: تحديث المدينة الافتراضية وكود الدولة تلقائياً
  const handleReceiverCountryChange = useCallback((country: string) => {
    const info = COUNTRY_DATA[country];
    setData(prev => ({
      ...prev,
      receiverCountry: country,
      receiverCity: info?.defaultCity || "",
      receiverDialCode: info?.dialCode || "+966",
    }));
  }, []);

  const goTo = (s: number) => {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  };
  const next = () => step < 9 && goTo(step + 1);
  const prev = () => step > 1 && goTo(step - 1);

  const handleCreateShipment = () => {
    createMutation.mutate({
      ...data,
      weight: Number(data.weight),
      length: Number(data.length),
      width: Number(data.width),
      height: Number(data.height),
      declaredValue: Number(data.declaredValue) || undefined,
    });
  };

  const handleConfirmPayment = () => {
    if (!createdShipment) return;
    confirmPaymentMutation.mutate({
      shipmentId: createdShipment.id,
      paymentMethod: data.paymentMethod,
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 rounded-3xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">تسجيل الدخول مطلوب</h2>
          <p className="text-muted-foreground mb-6">يجب تسجيل الدخول لحجز شحنة جديدة</p>
          <a href={getLoginUrl()}>
            <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl shadow-lg">
              تسجيل الدخول
            </Button>
          </a>
        </div>
      </div>
    );
  }

  const price = priceQuery.data;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="xbolt-gradient border-b border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png" alt="XBOLT" className="h-8 w-auto object-contain" />
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">حجز شحنة جديدة</h1>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              <span>رجوع</span>
            </Button>
          </Link>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <motion.div
            className="h-full xbolt-gradient-gold"
            animate={{ width: `${(step / 9) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps indicator */}
      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex items-center min-w-max px-4 py-3 gap-1 mx-auto max-w-4xl">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => step > s.id && goTo(s.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  step === s.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : step > s.id
                    ? "bg-green-100 text-green-700 cursor-pointer hover:bg-green-200"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {step > s.id ? (
                  <CheckCircle className="w-3.5 h-3.5" />
                ) : (
                  <s.icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">{s.title}</span>
              </button>
              {i < STEPS.length - 1 && (
                <ChevronLeft className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="container py-8 max-w-3xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Step 1: Shipment Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">نوع الشحنة</h2>
                  <p className="text-muted-foreground">اختر نوع الشحن المناسب لاحتياجاتك</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    { type: "local" as const, icon: Truck, title: "شحن محلي", desc: "داخل المملكة العربية السعودية", price: "يبدأ من 25 ريال", color: "from-blue-500 to-blue-700", features: ["توصيل 24-48 ساعة", "تتبع لحظي", "تغطية كاملة"] },
                    { type: "international" as const, icon: Globe, title: "شحن دولي", desc: "لأكثر من 120 دولة حول العالم", price: "يبدأ من 80 ريال", color: "from-purple-500 to-purple-700", features: ["تغطية عالمية", "جمارك مُيسّرة", "تتبع دولي"] },
                  ].map(opt => (
                    <motion.button
                      key={opt.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => set("type", opt.type)}
                      className={`relative rounded-3xl overflow-hidden border-2 transition-all text-right ${
                        data.type === opt.type
                          ? "border-primary shadow-xl"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className={`bg-gradient-to-br ${opt.color} p-6`}>
                        <opt.icon className="w-10 h-10 text-white mb-3" />
                        <h3 className="text-xl font-black text-white">{opt.title}</h3>
                        <p className="text-white/80 text-sm">{opt.desc}</p>
                      </div>
                      <div className="bg-card p-5">
                        <p className="text-primary font-bold text-lg mb-3">{opt.price}</p>
                        <div className="space-y-1.5">
                          {opt.features.map(f => (
                            <div key={f} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-sm text-foreground/80">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {data.type === opt.type && (
                        <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Sender Info */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">بيانات المرسل</h2>
                  <p className="text-muted-foreground">أدخل معلومات المرسل بدقة</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الاسم الكامل *</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={data.senderName} onChange={e => set("senderName", e.target.value)} placeholder="محمد أحمد" className="pr-9" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">رقم الجوال *</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 border border-input rounded-lg px-2.5 py-2 bg-muted/50 flex-shrink-0 min-w-[90px]">
                          <span className="text-base leading-none">{COUNTRY_DATA[data.senderCountry]?.flag || "🌍"}</span>
                          <span className="text-xs font-bold text-foreground">{data.senderDialCode}</span>
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={data.senderPhone} onChange={e => set("senderPhone", e.target.value)} placeholder="5xxxxxxxx" className="pr-9" dir="ltr" />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={data.senderEmail} onChange={e => set("senderEmail", e.target.value)} placeholder="example@email.com" className="pr-9" dir="ltr" />
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الدولة *</Label>
                      <div className="relative">
                        <select
                          value={data.senderCountry}
                          onChange={e => handleSenderCountryChange(e.target.value)}
                          className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-8"
                        >
                          {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_DATA[c]?.flag} {c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">المدينة *</Label>
                      {data.senderCountry === "المملكة العربية السعودية" ? (
                        <select value={data.senderCity} onChange={e => set("senderCity", e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                          {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <Input value={data.senderCity} onChange={e => set("senderCity", e.target.value)} placeholder="المدينة" />
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الحي</Label>
                      <Input value={data.senderDistrict} onChange={e => set("senderDistrict", e.target.value)} placeholder="حي النخيل" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الرمز البريدي</Label>
                      <Input value={data.senderPostalCode} onChange={e => set("senderPostalCode", e.target.value)} placeholder="12345" dir="ltr" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">العنوان المختصر * <span className="text-xs text-muted-foreground font-normal">(مثال: EMCT2561</span></Label>
                      <Input value={data.senderShortAddress} onChange={e => set("senderShortAddress", e.target.value)} placeholder="حي النزهة، شارع الأمير سلطان" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 block">العنوان التفصيلي *</Label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea value={data.senderAddress} onChange={e => set("senderAddress", e.target.value)} placeholder="شارع الملك فهد، مبنى رقم 5، الطابق الثالث" rows={2} className="w-full border border-input rounded-lg px-3 py-2 pr-9 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Receiver Info */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">بيانات المستلم</h2>
                  <p className="text-muted-foreground">أدخل معلومات المستلم بدقة</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الاسم الكامل *</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={data.receiverName} onChange={e => set("receiverName", e.target.value)} placeholder="عبدالله محمد" className="pr-9" />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">رقم الجوال *</Label>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 border border-input rounded-lg px-2.5 py-2 bg-muted/50 flex-shrink-0 min-w-[90px]">
                          <span className="text-base leading-none">{COUNTRY_DATA[data.receiverCountry]?.flag || "🌍"}</span>
                          <span className="text-xs font-bold text-foreground">{data.receiverDialCode}</span>
                        </div>
                        <div className="relative flex-1">
                          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input value={data.receiverPhone} onChange={e => set("receiverPhone", e.target.value)} placeholder="5xxxxxxxx" className="pr-9" dir="ltr" />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 block">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input value={data.receiverEmail} onChange={e => set("receiverEmail", e.target.value)} placeholder="example@email.com" className="pr-9" dir="ltr" />
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الدولة *</Label>
                      <select value={data.receiverCountry} onChange={e => handleReceiverCountryChange(e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                        {COUNTRIES.map(c => <option key={c} value={c}>{COUNTRY_DATA[c]?.flag} {c}</option>)}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">المدينة *</Label>
                      {data.receiverCountry === "المملكة العربية السعودية" ? (
                        <select value={data.receiverCity} onChange={e => set("receiverCity", e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring">
                          {SAUDI_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      ) : (
                        <Input value={data.receiverCity} onChange={e => set("receiverCity", e.target.value)} placeholder="المدينة" />
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الحي</Label>
                      <Input value={data.receiverDistrict} onChange={e => set("receiverDistrict", e.target.value)} placeholder="حي الروضة" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">الرمز البريدي</Label>
                      <Input value={data.receiverPostalCode} onChange={e => set("receiverPostalCode", e.target.value)} placeholder="12345" dir="ltr" />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">العنوان المختصر * <span className="text-xs text-muted-foreground font-normal">(مثال: حي الروضة، ش الأمير)</span></Label>
                      <Input value={data.receiverShortAddress} onChange={e => set("receiverShortAddress", e.target.value)} placeholder="حي الروضة، شارع الأمير سلطان" required />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold mb-1.5 block">العنوان التفصيلي *</Label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea value={data.receiverAddress} onChange={e => set("receiverAddress", e.target.value)} placeholder="شارع الأمير سلطان، مبنى رقم 10، الطابق الثاني" rows={2} className="w-full border border-input rounded-lg px-3 py-2 pr-9 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Package Details */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">تفاصيل الطرد</h2>
                  <p className="text-muted-foreground">حدد نوع وأبعاد الطرد</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-6">
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">نوع الطرد *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { type: "document" as const, icon: FileText, label: "مستندات" },
                        { type: "parcel" as const, icon: Box, label: "طرد عادي" },
                        { type: "fragile" as const, icon: Shield, label: "قابل للكسر" },
                        { type: "heavy" as const, icon: Scale, label: "ثقيل" },
                      ].map(opt => (
                        <button
                          key={opt.type}
                          onClick={() => set("packageType", opt.type)}
                          className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                            data.packageType === opt.type
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <opt.icon className={`w-6 h-6 ${data.packageType === opt.type ? "text-primary" : "text-muted-foreground"}`} />
                          <span className={`text-xs font-semibold ${data.packageType === opt.type ? "text-primary" : "text-muted-foreground"}`}>{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-3 block">الوزن والأبعاد</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">الوزن (كجم) *</Label>
                        <div className="relative">
                          <Scale className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input type="number" min="0.1" step="0.1" value={data.weight} onChange={e => set("weight", parseFloat(e.target.value) || 1)} className="pr-8 text-center" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">الطول (سم)</Label>
                        <div className="relative">
                          <Ruler className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <Input type="number" min="1" value={data.length} onChange={e => set("length", parseFloat(e.target.value) || 10)} className="pr-8 text-center" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">العرض (سم)</Label>
                        <Input type="number" min="1" value={data.width} onChange={e => set("width", parseFloat(e.target.value) || 10)} className="text-center" />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1 block">الارتفاع (سم)</Label>
                        <Input type="number" min="1" value={data.height} onChange={e => set("height", parseFloat(e.target.value) || 10)} className="text-center" />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">وصف المحتوى</Label>
                      <Input value={data.description} onChange={e => set("description", e.target.value)} placeholder="مثال: ملابس، إلكترونيات..." />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold mb-1.5 block">القيمة المُعلنة (ريال)</Label>
                      <Input type="number" min="0" value={data.declaredValue || ""} onChange={e => set("declaredValue", parseFloat(e.target.value) || 0)} placeholder="0" />
                    </div>
                  </div>

                  {/* Live price preview */}
                  {price && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-sm font-semibold text-primary mb-2">السعر المبدئي</p>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground text-sm">السعر الأساسي</span>
                        <span className="font-bold text-foreground">{price.basePrice} ريال</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Extra Services */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">الخدمات الإضافية</h2>
                  <p className="text-muted-foreground">اختر الخدمات التي تحتاجها</p>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "expressDelivery" as const, icon: Zap, title: "التوصيل السريع", desc: "توصيل خلال 24 ساعة بدلاً من 48 ساعة", price: data.type === "local" ? "+20 ريال" : "+50 ريال", color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
                    { key: "insurance" as const, icon: Shield, title: "التأمين الشامل", desc: "حماية كاملة ضد الأضرار والفقدان", price: "+15 ريال", color: "text-blue-500 bg-blue-50 border-blue-200" },
                    { key: "packagingService" as const, icon: Box, title: "خدمة التغليف", desc: "تغليف احترافي لحماية محتويات الطرد", price: "+10 ريال", color: "text-green-500 bg-green-50 border-green-200" },
                    { key: "signatureRequired" as const, icon: CheckCircle, title: "توقيع المستلم", desc: "التأكد من استلام المستلم شخصياً بالتوقيع", price: "+5 ريال", color: "text-purple-500 bg-purple-50 border-purple-200" },
                  ].map(service => (
                    <motion.button
                      key={service.key}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => set(service.key, !data[service.key])}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right ${
                        data[service.key]
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${service.color}`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 text-right">
                        <p className="font-bold text-foreground">{service.title}</p>
                        <p className="text-muted-foreground text-sm">{service.desc}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-primary font-bold text-sm">{service.price}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${data[service.key] ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                          {data[service.key] && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {price && (
                  <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                    <h3 className="font-bold text-foreground mb-3">ملخص السعر</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">السعر الأساسي</span>
                        <span className="font-medium">{price.basePrice} ريال</span>
                      </div>
                      {price.extraServicesPrice > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الخدمات الإضافية</span>
                          <span className="font-medium">+{price.extraServicesPrice} ريال</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
                        <span>الإجمالي</span>
                        <span className="text-primary">{price.totalPrice} ريال</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Payment Method */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">طريقة الدفع</h2>
                  <p className="text-muted-foreground">اختر طريقة الدفع المناسبة</p>
                </div>
                <div className="space-y-4">
                  {[
                    { method: "online" as const, icon: CreditCard, title: "دفع إلكتروني", desc: "Apple Pay / Mada / STC Pay / بطاقة ائتمانية", badge: "الأسرع" },
                    { method: "bank_transfer" as const, icon: Building, title: "تحويل بنكي / سداد", desc: "حوّل المبلغ وارفع صورة الإيصال للتحقق", badge: null },
                    { method: "cash" as const, icon: Hash, title: "الدفع عند الاستلام", desc: "ادفع نقداً عند استلام الشحنة", badge: null },
                  ].map(opt => (
                    <motion.button
                      key={opt.method}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => set("paymentMethod", opt.method)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 transition-all text-right ${
                        data.paymentMethod === opt.method
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${data.paymentMethod === opt.method ? "xbolt-gradient-blue" : "bg-muted"}`}>
                        <opt.icon className={`w-6 h-6 ${data.paymentMethod === opt.method ? "text-white" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground">{opt.title}</p>
                          {opt.badge && <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">{opt.badge}</Badge>}
                        </div>
                        <p className="text-muted-foreground text-sm">{opt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.paymentMethod === opt.method ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                        {data.paymentMethod === opt.method && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-1.5 block">ملاحظات إضافية</Label>
                  <textarea value={data.notes} onChange={e => set("notes", e.target.value)} placeholder="أي تعليمات خاصة للتوصيل..." rows={3} className="w-full border border-input rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
              </div>
            )}

            {/* Step 7: Review */}
            {step === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">مراجعة الطلب</h2>
                  <p className="text-muted-foreground">تأكد من صحة جميع البيانات قبل المتابعة</p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "نوع الشحنة",
                      items: [
                        { label: "النوع", value: data.type === "local" ? "شحن محلي" : "شحن دولي" },
                        { label: "نوع الطرد", value: { document: "مستندات", parcel: "طرد عادي", fragile: "قابل للكسر", heavy: "ثقيل" }[data.packageType] },
                      ],
                      step: 1,
                    },
                    {
                      title: "المرسل",
                      items: [
                        { label: "الاسم", value: data.senderName },
                        { label: "الجوال", value: data.senderPhone },
                        { label: "العنوان", value: `${data.senderCity}، ${data.senderAddress}` },
                      ],
                      step: 2,
                    },
                    {
                      title: "المستلم",
                      items: [
                        { label: "الاسم", value: data.receiverName },
                        { label: "الجوال", value: data.receiverPhone },
                        { label: "العنوان", value: `${data.receiverCity}، ${data.receiverAddress}` },
                      ],
                      step: 3,
                    },
                    {
                      title: "تفاصيل الطرد",
                      items: [
                        { label: "الوزن", value: `${data.weight} كجم` },
                        { label: "الأبعاد", value: `${data.length} × ${data.width} × ${data.height} سم` },
                        { label: "المحتوى", value: data.description || "—" },
                      ],
                      step: 4,
                    },
                  ].map(section => (
                    <div key={section.title} className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-foreground">{section.title}</h3>
                        <button onClick={() => goTo(section.step)} className="text-primary text-xs font-semibold hover:underline">تعديل</button>
                      </div>
                      <div className="space-y-2">
                        {section.items.map(item => (
                          <div key={item.label} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {price && (
                    <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5">
                      <h3 className="font-bold text-foreground mb-3">ملخص التكلفة</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-muted-foreground">السعر الأساسي</span><span>{price.basePrice} ريال</span></div>
                        {price.extraServicesPrice > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">الخدمات الإضافية</span><span>+{price.extraServicesPrice} ريال</span></div>}
                        <div className="border-t border-primary/20 pt-2 flex justify-between font-black text-xl">
                          <span>الإجمالي</span>
                          <span className="text-primary">{price.totalPrice} ريال</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 8: Payment */}
            {step === 8 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-foreground mb-2">إتمام الدفع</h2>
                  <p className="text-muted-foreground">أكمل عملية الدفع لتأكيد شحنتك</p>
                </div>
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground text-sm mb-1">المبلغ المطلوب</p>
                    <p className="text-5xl font-black text-primary">{price?.totalPrice} <span className="text-2xl">ريال</span></p>
                  </div>

                  {data.paymentMethod === "online" && (
                    <div className="space-y-3">
                      <p className="font-semibold text-foreground text-center mb-4">اختر طريقة الدفع الإلكتروني</p>
                      {[
                        { name: "Apple Pay", emoji: "" },
                        { name: "Mada", emoji: "" },
                        { name: "STC Pay", emoji: "" },
                        { name: "بطاقة ائتمانية", emoji: "" },
                      ].map(method => (
                        <Button
                          key={method.name}
                          variant="outline"
                          className="w-full py-4 text-base font-semibold border-2 hover:border-primary hover:bg-primary/5 rounded-xl"
                          onClick={handleCreateShipment}
                          disabled={createMutation.isPending}
                        >
                          {method.name}
                        </Button>
                      ))}
                    </div>
                  )}

                  {data.paymentMethod === "bank_transfer" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h4 className="font-bold text-blue-800 mb-2">بيانات التحويل البنكي</h4>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between"><span className="text-blue-600">اسم البنك</span><span className="font-semibold text-blue-800">بنك الراجحي</span></div>
                          <div className="flex justify-between"><span className="text-blue-600">رقم الحساب</span><span className="font-mono font-bold text-blue-800 ltr-text">SA1234567890</span></div>
                          <div className="flex justify-between"><span className="text-blue-600">اسم المستفيد</span><span className="font-semibold text-blue-800">شركة XBOLT للشحن</span></div>
                          <div className="flex justify-between"><span className="text-blue-600">المبلغ</span><span className="font-bold text-blue-800">{price?.totalPrice} ريال</span></div>
                        </div>
                      </div>
                      <Button
                        className="w-full py-4 xbolt-gradient-blue text-white border-0 font-bold text-base rounded-xl shadow-lg"
                        onClick={handleCreateShipment}
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? "جارٍ الإنشاء..." : "تأكيد الطلب ورفع الإيصال لاحقاً"}
                      </Button>
                    </div>
                  )}

                  {data.paymentMethod === "cash" && (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                        <p className="text-green-800 font-semibold">سيتم تحصيل المبلغ عند استلام الشحنة</p>
                        <p className="text-green-600 text-sm mt-1">يرجى التأكد من توفر المبلغ عند الاستلام</p>
                      </div>
                      <Button
                        className="w-full py-4 xbolt-gradient-blue text-white border-0 font-bold text-base rounded-xl shadow-lg"
                        onClick={handleCreateShipment}
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? "جارٍ الإنشاء..." : "تأكيد الطلب"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 9: Confirmation */}
            {step === 9 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto shadow-2xl"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-black text-foreground mb-2">تم إنشاء الشحنة!</h2>
                  <p className="text-muted-foreground">شحنتك في طريقها إليك</p>
                </div>

                {createdShipment && (
                  <div className="bg-card rounded-2xl p-6 border border-border shadow-sm max-w-sm mx-auto">
                    <p className="text-muted-foreground text-sm mb-2">رقم التتبع</p>
                    <p className="text-2xl font-black text-primary font-mono ltr-text">{createdShipment.trackingNumber}</p>
                    <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">من</span>
                        <span className="font-medium">{data.senderCity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">إلى</span>
                        <span className="font-medium">{data.receiverCity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">التكلفة</span>
                        <span className="font-bold text-primary">{price?.totalPrice} ريال</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/track/${createdShipment?.trackingNumber}`}>
                    <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl shadow-lg">
                      <MapPin className="w-4 h-4 ml-2" />
                      تتبع الشحنة
                    </Button>
                  </Link>
                  <Link href="/my-shipments">
                    <Button variant="outline" className="font-semibold px-8 py-3 rounded-xl">
                      شحناتي
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="ghost" className="font-semibold px-8 py-3 rounded-xl">
                      الصفحة الرئيسية
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation buttons */}
        {step < 9 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={prev}
              disabled={step === 1}
              className="font-semibold px-6 rounded-xl"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              السابق
            </Button>

            {step < 8 ? (
              <Button
                onClick={next}
                className="xbolt-gradient-blue text-white border-0 font-bold px-8 rounded-xl shadow-lg"
              >
                التالي
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
