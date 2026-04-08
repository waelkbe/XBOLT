import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { XBoltNavbarLogo, XBoltFooterLogo } from '@/components/XBoltLogo';
import { XBoltFullLogo } from '@/components/XBoltFullLogo';
import {
  Package, Search, CheckCircle, Truck, AlertCircle, Zap,
  MapPin, RefreshCw, ScanLine, User, Phone, Clock, Edit3
} from "lucide-react";

const STATUS_OPTIONS = [
  { key: "confirmed", label: "تم التأكيد", color: "bg-blue-100 text-blue-800" },
  { key: "picked_up", label: "تم الاستلام", color: "bg-purple-100 text-purple-800" },
  { key: "in_transit", label: "في الطريق", color: "bg-indigo-100 text-indigo-800" },
  { key: "out_for_delivery", label: "خارج للتوصيل", color: "bg-orange-100 text-orange-800" },
  { key: "delivered", label: "تم التسليم", color: "bg-green-100 text-green-800" },
  { key: "failed", label: "فشل التسليم", color: "bg-red-100 text-red-800" },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800 border-blue-200" },
  picked_up: { label: "تم الاستلام", color: "bg-purple-100 text-purple-800 border-purple-200" },
  in_transit: { label: "في الطريق", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  out_for_delivery: { label: "خارج للتوصيل", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "تم التسليم", color: "bg-green-100 text-green-800 border-green-200" },
  failed: { label: "فشل التسليم", color: "bg-red-100 text-red-800 border-red-200" },
  cancelled: { label: "ملغاة", color: "bg-gray-100 text-gray-800 border-gray-200" },
  pending_payment: { label: "انتظار الدفع", color: "bg-amber-100 text-amber-800 border-amber-200" },
};

export default function EmployeeDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [scanInput, setScanInput] = useState("");
  const [scannedShipment, setScannedShipment] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  const { data: shipmentsData, refetch } = trpc.employee.myAssignedShipments.useQuery(
    { search },
    { enabled: isAuthenticated && (user?.role === "employee" || user?.role === "admin") }
  );

  const trackQuery = trpc.shipments.track.useQuery(
    { trackingNumber: scanInput },
    { enabled: false }
  );

  const updateStatusMutation = trpc.employee.updateShipmentStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة الشحنة بنجاح!");
      setScannedShipment(null);
      setScanInput("");
      setSelectedStatus("");
      setLocation("");
      setNotes("");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleScan = async () => {
    if (!scanInput.trim()) return;
    const result = await trackQuery.refetch();
    if (result.data?.shipment) {
      setScannedShipment(result.data.shipment);
      setSelectedStatus(result.data.shipment.status);
      toast.success("تم العثور على الشحنة!");
    } else {
      toast.error("رقم التتبع غير موجود");
    }
  };

  const handleUpdateStatus = () => {
    if (!scannedShipment || !selectedStatus) return;
    updateStatusMutation.mutate({
      shipmentId: scannedShipment.id,
      status: selectedStatus as any,
      location: location || undefined,
      notes: notes || undefined,
    });
  };

  if (!isAuthenticated || (user?.role !== "employee" && user?.role !== "admin")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">غير مصرح لك بالدخول</h2>
          <Link href="/"><Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl">العودة للرئيسية</Button></Link>
        </div>
      </div>
    );
  }

  const shipments = shipmentsData?.shipments || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="xbolt-gradient border-b border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <XBoltFullLogo size="md" />
              <span className="text-white font-black text-lg">XBOLT</span>
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">لوحة الموظف</h1>
          <div className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
            <User className="w-4 h-4 text-white/70" />
            <span className="text-white text-sm font-medium">{user?.name}</span>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-5xl">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Scanner + Update */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode Scanner */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h2 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-primary" />
                مسح الباركود / البحث
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleScan()}
                    placeholder="أدخل رقم التتبع..."
                    className="font-mono text-center rounded-xl h-12 text-base"
                    dir="ltr"
                  />
                </div>
                <Button
                  onClick={handleScan}
                  disabled={trackQuery.isFetching}
                  className="w-full xbolt-gradient-blue text-white border-0 font-bold h-11 rounded-xl shadow-lg"
                >
                  <Search className="w-4 h-4 ml-2" />
                  {trackQuery.isFetching ? "جارٍ البحث..." : "بحث"}
                </Button>
              </div>
            </div>

            {/* Scanned Shipment */}
            <AnimatePresence>
              {scannedShipment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-2xl p-6 border-2 border-primary shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">تحديث الحالة</h3>
                    <button onClick={() => setScannedShipment(null)} className="text-muted-foreground hover:text-foreground text-sm">إغلاق</button>
                  </div>

                  <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                    <p className="font-mono font-black text-primary text-sm ltr-text mb-1">{scannedShipment.trackingNumber}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-foreground font-medium">{scannedShipment.receiverName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground ltr-text">{scannedShipment.receiverPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{scannedShipment.receiverCity}، {scannedShipment.receiverAddress}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">الحالة الجديدة</label>
                      <div className="grid grid-cols-2 gap-2">
                        {STATUS_OPTIONS.map(opt => (
                          <button
                            key={opt.key}
                            onClick={() => setSelectedStatus(opt.key)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                              selectedStatus === opt.key
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">الموقع الحالي</label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="مثال: مستودع الرياض" className="pr-8 rounded-xl text-sm" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">ملاحظات</label>
                      <textarea
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="أي ملاحظات إضافية..."
                        rows={2}
                        className="w-full border border-input rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleUpdateStatus}
                      disabled={!selectedStatus || updateStatusMutation.isPending}
                      className="w-full xbolt-gradient-blue text-white border-0 font-bold h-11 rounded-xl shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4 ml-2" />
                      {updateStatusMutation.isPending ? "جارٍ التحديث..." : "تحديث الحالة"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Assigned Shipments */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                الشحنات المُسندة
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="pr-8 rounded-xl text-sm h-9 w-40" />
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="rounded-xl">
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {shipments.length === 0 ? (
              <div className="bg-card rounded-2xl p-12 border border-border shadow-sm text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">لا توجد شحنات مُسندة حالياً</p>
              </div>
            ) : (
              <div className="space-y-3">
                {shipments.map((s, i) => {
                  const status = STATUS_LABELS[s.status] || { label: s.status, color: "bg-gray-100 text-gray-800 border-gray-200" };
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-card rounded-2xl p-4 border border-border shadow-sm card-hover"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl xbolt-gradient-blue flex items-center justify-center shadow-md flex-shrink-0">
                            <Truck className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-primary text-xs ltr-text">{s.trackingNumber}</p>
                            <p className="font-semibold text-foreground text-sm">{s.receiverName}</p>
                            <p className="text-muted-foreground text-xs flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span className="ltr-text">{s.receiverPhone}</span>
                            </p>
                            <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {s.receiverCity}، {s.receiverAddress}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={`${status.color} border text-xs font-semibold px-2 py-0.5 rounded-full`}>{status.label}</Badge>
                          <Button
                            size="sm"
                            className="xbolt-gradient-blue text-white border-0 font-semibold rounded-xl text-xs h-7"
                            onClick={() => {
                              setScanInput(s.trackingNumber);
                              setScannedShipment(s);
                              setSelectedStatus(s.status);
                            }}
                          >
                            <Edit3 className="w-3 h-3 ml-1" />
                            تحديث
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
