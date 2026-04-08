import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, MapPin, CheckCircle, Clock, Truck,
  Globe, ArrowLeft, Zap, Phone, Mail, AlertCircle
} from "lucide-react";
import { MapView } from "@/components/Map";



const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
  confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
  picked_up: { label: "تم الاستلام", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
  in_transit: { label: "في الطريق", color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Truck },
  out_for_delivery: { label: "خارج للتوصيل", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Truck },
  delivered: { label: "تم التسليم", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  failed: { label: "فشل التسليم", color: "bg-red-100 text-red-800 border-red-200", icon: AlertCircle },
  cancelled: { label: "ملغاة", color: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertCircle },
  pending_payment: { label: "في انتظار الدفع", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
};

const PROGRESS_STEPS = [
  { key: "pending", label: "الطلب" },
  { key: "confirmed", label: "التأكيد" },
  { key: "picked_up", label: "الاستلام" },
  { key: "in_transit", label: "في الطريق" },
  { key: "out_for_delivery", label: "التوصيل" },
  { key: "delivered", label: "التسليم" },
];

function getProgressIndex(status: string) {
  return PROGRESS_STEPS.findIndex(s => s.key === status);
}

export default function TrackShipment() {
  const params = useParams<{ trackingNumber?: string }>();
  const [, navigate] = useLocation();
  const [input, setInput] = useState(params.trackingNumber || "");
  const [searchTerm, setSearchTerm] = useState(params.trackingNumber || "");

  const { data, isLoading, error } = trpc.shipments.track.useQuery(
    { trackingNumber: searchTerm },
    { enabled: !!searchTerm, retry: false }
  );

  const handleSearch = () => {
    if (!input.trim()) return;
    setSearchTerm(input.trim());
    navigate(`/track/${input.trim()}`);
  };

  const shipment = data?.shipment;
  const events = data?.events || [];
  const statusInfo = shipment ? STATUS_LABELS[shipment.status] : null;
  const progressIdx = shipment ? getProgressIndex(shipment.status) : -1;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="xbolt-gradient border-b border-white/10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png" alt="XBOLT" className="h-8 w-auto object-contain" />
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">تتبع الشحنة</h1>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 ml-1" />
              الرئيسية
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-8"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 text-center">أدخل رقم التتبع</h2>
          <div className="flex gap-3 max-w-lg mx-auto">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="مثال: XB1A2B3C4D"
              className="text-center font-mono text-lg h-12 rounded-xl"
              dir="ltr"
            />
            <Button
              onClick={handleSearch}
              className="xbolt-gradient-blue text-white border-0 font-bold px-6 h-12 rounded-xl shadow-lg"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="w-16 h-16 rounded-full xbolt-gradient-blue flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <p className="text-muted-foreground font-medium">جارٍ البحث عن شحنتك...</p>
            </motion.div>
          )}

          {error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">رقم التتبع غير موجود</h3>
              <p className="text-muted-foreground">تأكد من صحة رقم التتبع وحاول مجدداً</p>
            </motion.div>
          )}

          {shipment && statusInfo && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Status Card */}
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">رقم التتبع</p>
                    <p className="text-2xl font-black text-primary font-mono ltr-text">{shipment.trackingNumber}</p>
                  </div>
                  <Badge className={`${statusInfo.color} border px-4 py-2 text-sm font-bold rounded-full`}>
                    <statusInfo.icon className="w-4 h-4 ml-1.5" />
                    {statusInfo.label}
                  </Badge>
                </div>

                {/* Progress Bar */}
                {!["failed", "cancelled"].includes(shipment.status) && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute top-4 right-0 left-0 h-0.5 bg-muted" />
                      <div
                        className="absolute top-4 right-0 h-0.5 xbolt-gradient-blue transition-all duration-700"
                        style={{ width: `${progressIdx >= 0 ? (progressIdx / (PROGRESS_STEPS.length - 1)) * 100 : 0}%` }}
                      />
                      {PROGRESS_STEPS.map((s, i) => (
                        <div key={s.key} className="relative z-10 flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            i <= progressIdx
                              ? "xbolt-gradient-blue border-primary shadow-md"
                              : "bg-background border-muted"
                          }`}>
                            {i < progressIdx ? (
                              <CheckCircle className="w-4 h-4 text-white" />
                            ) : i === progressIdx ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-white" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                            )}
                          </div>
                          <span className={`text-xs font-medium hidden sm:block ${i <= progressIdx ? "text-primary" : "text-muted-foreground"}`}>
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipment Details */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">المرسل</p>
                    <p className="font-bold text-foreground">{shipment.senderName}</p>
                    <p className="text-sm text-muted-foreground">{shipment.senderCity}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">المستلم</p>
                    <p className="font-bold text-foreground">{shipment.receiverName}</p>
                    <p className="text-sm text-muted-foreground">{shipment.receiverCity}</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">نوع الشحنة</p>
                    <p className="font-bold text-foreground">{shipment.type === "local" ? "شحن محلي" : "شحن دولي"}</p>
                    <p className="text-sm text-muted-foreground">{shipment.weight} كجم</p>
                  </div>
                  <div className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">الموقع الحالي</p>
                    <p className="font-bold text-foreground">{shipment.currentLocation || "—"}</p>
                    <p className="text-sm text-muted-foreground">آخر تحديث</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              {shipment.currentLat && shipment.currentLng && (
                <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      الموقع الحالي للشحنة
                    </h3>
                  </div>
                  <div className="h-64">
                    <MapView
                      onMapReady={(map) => {
                        const lat = parseFloat(String(shipment.currentLat));
                        const lng = parseFloat(String(shipment.currentLng));
                        const pos = { lat, lng };
                        map.setCenter(pos);
                        map.setZoom(13);
                        new google.maps.Marker({
                          position: pos,
                          map,
                          title: "موقع الشحنة",
                          icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 12,
                            fillColor: "#3b82f6",
                            fillOpacity: 1,
                            strokeColor: "#fff",
                            strokeWeight: 3,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Timeline */}
              {events.length > 0 && (
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    سجل الشحنة
                  </h3>
                  <div className="relative">
                    <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-5">
                      {events.map((event, i) => {
                        const evStatus = STATUS_LABELS[event.status] || { label: event.status, color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock };
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex gap-4 pr-10 relative"
                          >
                            <div className={`absolute right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background ${i === 0 ? "xbolt-gradient-blue" : "bg-muted"}`}>
                              <evStatus.icon className={`w-4 h-4 ${i === 0 ? "text-white" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold text-foreground text-sm">{event.description}</p>
                                  {event.location && (
                                    <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                      <MapPin className="w-3 h-3" />
                                      {event.location}
                                    </p>
                                  )}
                                </div>
                                <p className="text-muted-foreground text-xs whitespace-nowrap flex-shrink-0">
                                  {new Date(event.createdAt).toLocaleString("ar-SA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
