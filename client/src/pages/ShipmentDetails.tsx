import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, ArrowLeft, Zap, Clock, CheckCircle } from "lucide-react";



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

export default function ShipmentDetails() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id || "0");

  const { data: shipment, isLoading } = trpc.shipments.getById.useQuery({ id }, { enabled: !!id });
  const { data: events = [] } = trpc.shipments.events.useQuery({ shipmentId: id }, { enabled: !!id });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full xbolt-gradient-blue flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <h2 className="text-2xl font-black text-foreground mb-4">الشحنة غير موجودة</h2>
          <Link href="/my-shipments">
            <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl">العودة لشحناتي</Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = STATUS_LABELS[shipment.status] || { label: shipment.status, color: "bg-gray-100 text-gray-800 border-gray-200" };

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
          <h1 className="text-white font-bold text-lg">تفاصيل الشحنة</h1>
          <Link href="/my-shipments">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 ml-1" />
              شحناتي
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-muted-foreground text-sm">رقم التتبع</p>
                <p className="text-xl font-black text-primary font-mono ltr-text">{shipment.trackingNumber}</p>
              </div>
              <Badge className={`${status.color} border px-4 py-2 text-sm font-bold rounded-full`}>{status.label}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">المرسل</p>
                <p className="font-bold text-foreground">{shipment.senderName}</p>
                <p className="text-sm text-muted-foreground">{shipment.senderPhone}</p>
                <p className="text-sm text-muted-foreground">{shipment.senderCity}، {shipment.senderAddress}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">المستلم</p>
                <p className="font-bold text-foreground">{shipment.receiverName}</p>
                <p className="text-sm text-muted-foreground">{shipment.receiverPhone}</p>
                <p className="text-sm text-muted-foreground">{shipment.receiverCity}، {shipment.receiverAddress}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">تفاصيل الطرد</p>
                <p className="font-bold text-foreground">{shipment.weight} كجم</p>
                <p className="text-sm text-muted-foreground">{shipment.type === "local" ? "شحن محلي" : "شحن دولي"}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-2 font-medium">التكلفة</p>
                <p className="font-black text-primary text-xl">{parseFloat(shipment.totalPrice).toFixed(2)} ريال</p>
                <p className="text-sm text-muted-foreground">{shipment.paymentStatus === "paid" ? "مدفوع" : "غير مدفوع"}</p>
              </div>
            </div>
          </div>

          {events.length > 0 && (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                سجل الشحنة
              </h3>
              <div className="space-y-4">
                {events.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? "xbolt-gradient-blue" : "bg-muted"}`}>
                      <CheckCircle className={`w-4 h-4 ${i === 0 ? "text-white" : "text-muted-foreground"}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{event.description}</p>
                      {event.location && <p className="text-muted-foreground text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                      <p className="text-muted-foreground text-xs">{new Date(event.createdAt).toLocaleString("ar-SA")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Link href={`/track/${shipment.trackingNumber}`}>
              <Button className="xbolt-gradient-blue text-white border-0 font-bold px-6 py-3 rounded-xl shadow-lg">
                <MapPin className="w-4 h-4 ml-2" />
                تتبع الشحنة
              </Button>
            </Link>
            <Link href="/my-shipments">
              <Button variant="outline" className="font-semibold px-6 py-3 rounded-xl">العودة</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
