import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { Award, Star, Zap, Gift, TrendingUp, Plus, Minus, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";



const LEVEL_CONFIG = {
  bronze: { label: "برونزي", color: "text-amber-700 bg-amber-100 border-amber-300", next: 500, icon: "🥉" },
  silver: { label: "فضي", color: "text-gray-600 bg-gray-100 border-gray-300", next: 2000, icon: "🥈" },
  gold: { label: "ذهبي", color: "text-yellow-700 bg-yellow-100 border-yellow-300", next: 5000, icon: "🥇" },
  platinum: { label: "بلاتيني", color: "text-purple-700 bg-purple-100 border-purple-300", next: null, icon: "💎" },
};

export default function RewardsPage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: history = [] } = trpc.points.myHistory.useQuery(undefined, { enabled: isAuthenticated });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl xbolt-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Award className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-3">تسجيل الدخول مطلوب</h2>
          <a href={getLoginUrl()}>
            <Button className="xbolt-gradient-blue text-white border-0 font-bold px-8 py-3 rounded-xl shadow-lg">تسجيل الدخول</Button>
          </a>
        </div>
      </div>
    );
  }

  const level = (user as any)?.level || "bronze";
  const points = (user as any)?.points || 0;
  const levelConfig = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.bronze;
  const progress = levelConfig.next ? Math.min((points / levelConfig.next) * 100, 100) : 100;

  const rewards = [
    { title: "خصم 10% على الشحنة التالية", points: 200, icon: "🎁" },
    { title: "شحن مجاني داخل الرياض", points: 500, icon: "🚚" },
    { title: "خصم 25% على الشحن الدولي", points: 1000, icon: "✈️" },
    { title: "شحن مجاني لأي مدينة", points: 2000, icon: "🌟" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="xbolt-gradient border-b border-white/10">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030889101/AXX6a5Wsrmtto6aGtEGd45/logo-orange-cropped_8655df36.png" alt="XBOLT" className="h-8 w-auto object-contain" />
            </div>
          </Link>
          <h1 className="text-white font-bold text-lg">نقاطي ومكافآتي</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
          >
            <span>رجوع</span>
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {/* Points Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xbolt-gradient rounded-3xl p-8 text-white mb-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 50%)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/70 text-sm mb-1">رصيد نقاطك</p>
                <p className="text-6xl font-black">{points.toLocaleString()}</p>
                <p className="text-white/70 text-sm">نقطة</p>
              </div>
              <div className="text-6xl">{levelConfig.icon}</div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Badge className={`${levelConfig.color} border font-bold px-4 py-1.5 text-sm`}>
                {levelConfig.label}
              </Badge>
              {levelConfig.next && (
                <span className="text-white/70 text-sm">{levelConfig.next - points} نقطة للمستوى التالي</span>
              )}
            </div>
            {levelConfig.next && (
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full xbolt-gradient-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Level benefits */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Object.entries(LEVEL_CONFIG).map(([key, config]) => (
            <div key={key} className={`rounded-2xl p-4 border-2 text-center transition-all ${level === key ? "border-primary shadow-md" : "border-border bg-card"}`}>
              <div className="text-3xl mb-2">{config.icon}</div>
              <p className={`font-bold text-sm ${level === key ? "text-primary" : "text-muted-foreground"}`}>{config.label}</p>
              <p className="text-xs text-muted-foreground">{config.next ? `${config.next} نقطة` : "الأعلى"}</p>
            </div>
          ))}
        </div>

        {/* Available Rewards */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm mb-6">
          <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-primary" />
            المكافآت المتاحة
          </h3>
          <div className="space-y-3">
            {rewards.map((reward, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reward.icon}</span>
                  <p className="font-semibold text-foreground text-sm">{reward.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-sm">{reward.points} نقطة</span>
                  <Button
                    size="sm"
                    disabled={points < reward.points}
                    className={`rounded-xl text-xs font-bold ${points >= reward.points ? "xbolt-gradient-blue text-white border-0 shadow-md" : "opacity-50 cursor-not-allowed"}`}
                  >
                    استبدال
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Points History */}
        {history.length > 0 && (
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              سجل النقاط
            </h3>
            <div className="space-y-3">
              {history.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "earn" || tx.type === "bonus" ? "bg-green-100" : "bg-red-100"}`}>
                      {tx.type === "earn" || tx.type === "bonus" ? (
                        <Plus className="w-4 h-4 text-green-600" />
                      ) : (
                        <Minus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString("ar-SA")}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.type === "earn" || tx.type === "bonus" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "earn" || tx.type === "bonus" ? "+" : "-"}{Math.abs(tx.points)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
