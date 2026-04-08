import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Package, Users, TrendingUp, DollarSign, Search, Filter,
  CheckCircle, Clock, Truck, AlertCircle, Zap, BarChart3,
  MapPin, RefreshCw, Eye, Edit3, Trash2, ChevronDown
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { XBoltNavbarLogo, XBoltFooterLogo } from '@/components/XBoltLogo';
import { XBoltFullLogo } from '@/components/XBoltFullLogo';

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

const STATUS_OPTIONS = [
  "pending", "confirmed", "picked_up", "in_transit",
  "out_for_delivery", "delivered", "failed", "cancelled"
];

type AdminTab = "overview" | "shipments" | "users" | "analytics";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: shipmentsData, refetch: refetchShipments } = trpc.admin.shipments.useQuery(
    { page, limit: 15, search, status: statusFilter === "all" ? undefined : statusFilter },
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  const { data: usersData } = trpc.admin.users.useQuery(
    { page: 1, limit: 20 },
    { enabled: isAuthenticated && user?.role === "admin" && tab === "users" }
  );

  const updateStatusMutation = trpc.admin.updateShipmentStatus.useMutation({
    onSuccess: () => {
      toast.success("تم تحديث حالة الشحنة");
      setUpdatingId(null);
      refetchShipments();
    },
    onError: (err) => toast.error(err.message),
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">غير مصرح لك بالدخول</h2>
          <p className="text-muted-foreground mb-6">هذه الصفحة مخصصة للمسؤولين فقط</p>
          <Link href="/"><Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl">العودة للرئيسية</Button></Link>
        </div>
      </div>
    );
  }

  const shipments = shipmentsData?.shipments || [];
  const users = usersData?.users || [];

  const chartData = [
    { name: "يناير", شحنات: 120, إيرادات: 18000 },
    { name: "فبراير", شحنات: 145, إيرادات: 22000 },
    { name: "مارس", شحنات: 180, إيرادات: 28000 },
    { name: "أبريل", شحنات: 160, إيرادات: 24000 },
    { name: "مايو", شحنات: 210, إيرادات: 32000 },
    { name: "يونيو", شحنات: 195, إيرادات: 29000 },
  ];

  const pieData = [
    { name: "محلي", value: 65, color: "#3b82f6" },
    { name: "دولي", value: 35, color: "#8b5cf6" },
  ];

  const tabs: { key: AdminTab; label: string; icon: any }[] = [
    { key: "overview", label: "نظرة عامة", icon: BarChart3 },
    { key: "shipments", label: "الشحنات", icon: Package },
    { key: "users", label: "المستخدمون", icon: Users },
    { key: "analytics", label: "التحليلات", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <div className="xbolt-gradient border-b border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <XBoltFullLogo size="md" className="cursor-pointer" />
          </Link>
          <h1 className="text-white font-bold text-lg">لوحة تحكم الأدمن</h1>
          <div className="flex items-center gap-2">
            <div className="bg-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full xbolt-gradient-gold flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user?.name?.[0]}</span>
              </div>
              <span className="text-white text-sm font-medium">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container pb-0">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                  tab === t.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Overview Tab */}
        {tab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "إجمالي الشحنات", value: stats?.totalShipments || 0, icon: Package, color: "from-blue-500 to-blue-700", suffix: "" },
                { label: "الشحنات النشطة", value: stats?.activeShipments || 0, icon: Truck, color: "from-purple-500 to-purple-700", suffix: "" },
                { label: "إجمالي الإيرادات", value: stats?.totalRevenue || 0, icon: DollarSign, color: "from-green-500 to-green-700", suffix: " ريال" },
                { label: "المستخدمون", value: stats?.totalUsers || 0, icon: Users, color: "from-orange-500 to-orange-700", suffix: "" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm"
                >
                  <div className={`bg-gradient-to-br ${stat.color} p-4`}>
                    <stat.icon className="w-7 h-7 text-white/80" />
                  </div>
                  <div className="p-4">
                    <p className="text-2xl font-black text-foreground">
                      {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                    </p>
                    <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Status breakdown */}
            {stats?.statusBreakdown && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4">توزيع حالات الشحنات</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                    const info = STATUS_LABELS[status];
                    if (!info) return null;
                    return (
                      <div key={status} className={`${info.color} border rounded-xl p-3 text-center`}>
                        <p className="text-2xl font-black">{count as number}</p>
                        <p className="text-xs font-semibold">{info.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent shipments */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-foreground">أحدث الشحنات</h3>
                <button onClick={() => setTab("shipments")} className="text-primary text-sm font-semibold hover:underline">عرض الكل</button>
              </div>
              <div className="space-y-3">
                {shipments.slice(0, 5).map(s => {
                  const status = STATUS_LABELS[s.status] || { label: s.status, color: "bg-gray-100 text-gray-800 border-gray-200" };
                  return (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl xbolt-gradient-blue flex items-center justify-center">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-primary text-xs ltr-text">{s.trackingNumber}</p>
                          <p className="text-foreground text-sm font-medium">{s.receiverName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${status.color} border text-xs font-semibold px-2 py-0.5 rounded-full`}>{status.label}</Badge>
                        <span className="text-primary font-bold text-sm">{parseFloat(s.totalPrice).toFixed(0)} ر</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipments Tab */}
        {tab === "shipments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="ابحث برقم التتبع أو الاسم..." className="pr-9 rounded-xl" />
              </div>
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                className="border border-input rounded-xl px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">جميع الحالات</option>
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]?.label || s}</option>
                ))}
              </select>
              <Button variant="outline" onClick={() => refetchShipments()} className="rounded-xl font-semibold">
                <RefreshCw className="w-4 h-4 ml-1" />
                تحديث
              </Button>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">رقم التتبع</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">المرسل</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">المستلم</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">المسار</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">الحالة</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">التكلفة</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {shipments.map(s => {
                      const status = STATUS_LABELS[s.status] || { label: s.status, color: "bg-gray-100 text-gray-800 border-gray-200" };
                      return (
                        <tr key={s.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3">
                            <span className="font-mono font-bold text-primary text-xs ltr-text">{s.trackingNumber}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground text-sm">{s.senderName}</p>
                            <p className="text-muted-foreground text-xs">{s.senderCity}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-foreground text-sm">{s.receiverName}</p>
                            <p className="text-muted-foreground text-xs">{s.receiverCity}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-muted-foreground">{s.type === "local" ? "محلي" : "دولي"}</span>
                          </td>
                          <td className="px-4 py-3">
                            {updatingId === s.id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={newStatus}
                                  onChange={e => setNewStatus(e.target.value)}
                                  className="border border-input rounded-lg px-2 py-1 text-xs bg-background"
                                >
                                  <option value="">اختر الحالة</option>
                                  {STATUS_OPTIONS.map(opt => (
                                    <option key={opt} value={opt}>{STATUS_LABELS[opt]?.label}</option>
                                  ))}
                                </select>
                                <Button
                                  size="sm"
                                  className="xbolt-gradient-blue text-white border-0 text-xs h-7 rounded-lg"
                                  onClick={() => {
                                    if (newStatus) updateStatusMutation.mutate({ shipmentId: s.id, status: newStatus as any });
                                  }}
                                  disabled={!newStatus || updateStatusMutation.isPending}
                                >
                                  حفظ
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 text-xs rounded-lg" onClick={() => setUpdatingId(null)}>إلغاء</Button>
                              </div>
                            ) : (
                              <Badge className={`${status.color} border text-xs font-semibold px-2 py-0.5 rounded-full`}>{status.label}</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-primary text-sm">{parseFloat(s.totalPrice).toFixed(0)} ريال</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link href={`/track/${s.trackingNumber}`}>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-lg">
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => { setUpdatingId(s.id); setNewStatus(s.status); }}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {shipmentsData && shipmentsData.total > 15 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    عرض {(page - 1) * 15 + 1} - {Math.min(page * 15, shipmentsData.total)} من {shipmentsData.total}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg">السابق</Button>
                    <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page * 15 >= shipmentsData.total} className="rounded-lg">التالي</Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/50 border-b border-border">
                    <tr>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">المستخدم</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">البريد الإلكتروني</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">الدور</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">النقاط</th>
                      <th className="text-right text-xs font-bold text-muted-foreground px-4 py-3">تاريخ الانضمام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full xbolt-gradient-blue flex items-center justify-center shadow-sm">
                              <span className="text-white text-sm font-bold">{u.name?.[0] || "م"}</span>
                            </div>
                            <p className="font-semibold text-foreground text-sm">{u.name || "—"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground ltr-text">{u.email || "—"}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            u.role === "admin" ? "bg-red-100 text-red-800 border-red-200 border" :
                            u.role === "employee" ? "bg-blue-100 text-blue-800 border-blue-200 border" :
                            "bg-green-100 text-green-800 border-green-200 border"
                          }`}>
                            {u.role === "admin" ? "أدمن" : u.role === "employee" ? "موظف" : "عميل"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-primary text-sm">{(u as any).points || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4">الشحنات والإيرادات الشهرية</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", direction: "rtl" }}
                    />
                    <Bar dataKey="شحنات" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="إيرادات" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-foreground mb-4">توزيع أنواع الشحن</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {pieData.map(d => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <span className="text-sm text-muted-foreground">{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-bold text-foreground mb-4">اتجاه الشحنات</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", direction: "rtl" }} />
                  <Line type="monotone" dataKey="شحنات" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
