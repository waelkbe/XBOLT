import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { Package, MapPin, Search, Plus, Clock, Zap, ArrowLeft, Filter } from "lucide-react";
import { useState } from "react";



const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "تم التأكيد", color: "bg-blue-100 text-blue-800 border-blue-200" },
  picked_up: { label: "تم الاستلام", color: "bg-purple-100 text-purple-800 border-purple-200" },
  in_transit: { label: "في الطريق", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  out_for_delivery: { label: "خارج للتوصيل", color: "bg-orange-100 text-orange-800 border-orange-200" },
  delivered: { label: "تم التسليم", color: "bg-green-100 text-green-800 border-green-200" },
  failed: { label: "فشل التسليم", color: "bg-red-100 text-red-800 border-red-200" },
  cancelled: { label: "ملغاة", color: "bg-gray-100 text-gray-800 border-gray-200" },
  pending_payment: { label: "في انتظار الدفع", color: "bg-amber-100 text-amber-800 border-amber-200" },
};

export default function MyShipments() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: shipments = [], isLoading } = trpc.shipments.myShipments.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl xbolt-gradient-blue flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">تسجيل الدخول مطلوب</h2>
          <a href={getLoginUrl()}>
            <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl shadow-lg">تسجيل الدخول</Button>
          </a>
        </div>
      </div>
    );
  }

  const filtered = shipments.filter(s => {
    const matchSearch = !search || s.trackingNumber.includes(search) || s.receiverName.includes(search) || s.senderName.includes(search);
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="xbolt-gradient border-b border-white/10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png" alt="XBOLT" className="h-8 w-auto object-contain" />
              <span className="text-white font-black text-lg">XBOLT</span>
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">شحناتي</h1>
          <div className="flex items-center gap-2">
            <Link href="/book">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 font-semibold rounded-xl">
                <Plus className="w-4 h-4 ml-1" />
                شحنة جديدة
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>رجوع</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="ابحث برقم التتبع أو الاسم..." className="pr-9 rounded-xl" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: "all", label: "الكل" },
              { key: "pending_payment", label: "انتظار الدفع" },
              { key: "in_transit", label: "في الطريق" },
              { key: "delivered", label: "مُسلّمة" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${filter === f.key ? "xbolt-gradient-blue text-white shadow-md" : "bg-card border border-border text-muted-foreground hover:border-primary/50"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card rounded-2xl p-5 border border-border animate-pulse h-28" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">لا توجد شحنات</h3>
            <p className="text-muted-foreground mb-6">ابدأ بحجز شحنتك الأولى الآن</p>
            <Link href="/book">
              <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl shadow-lg">
                <Plus className="w-4 h-4 ml-2" />
                احجز شحنة
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((shipment, i) => {
              const status = STATUS_LABELS[shipment.status] || { label: shipment.status, color: "bg-gray-100 text-gray-800 border-gray-200" };
              return (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-2xl p-5 border border-border shadow-sm card-hover"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl xbolt-gradient-blue flex items-center justify-center shadow-md flex-shrink-0">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-primary text-sm ltr-text">{shipment.trackingNumber}</p>
                        <p className="text-foreground font-semibold">{shipment.receiverName}</p>
                        <p className="text-muted-foreground text-xs flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {shipment.senderCity} → {shipment.receiverCity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <Badge className={`${status.color} border text-xs font-semibold px-3 py-1 rounded-full`}>{status.label}</Badge>
                        <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(shipment.createdAt).toLocaleDateString("ar-SA")}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href={`/track/${shipment.trackingNumber}`}>
                          <Button size="sm" className="xbolt-gradient-blue text-white border-0 font-semibold rounded-xl text-xs">
                            <MapPin className="w-3 h-3 ml-1" />
                            تتبع
                          </Button>
                        </Link>
                        <p className="text-primary font-bold text-sm text-center">{parseFloat(shipment.totalPrice).toFixed(0)} ر</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
