import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineChartBar,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineShieldExclamation,
  HiOutlineBolt,
  HiOutlineArchiveBox,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBell,
} from "react-icons/hi2";
import { TbCoins, TbMessageReport } from "react-icons/tb";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { Reveal } from "../components/animations/Reveal";
import { CountUp } from "../components/animations/CountUp";
import { Spinner } from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import { Avatar } from "../components/ui/Avatar";
import TrustGraph from "../components/TrustGraph";
import dayjs from "dayjs";

const TABS = [
  { key: "overview", label: "Overview", icon: HiOutlineChartBar },
  { key: "orders", label: "Orders", icon: HiOutlineShoppingBag },
  { key: "products", label: "Products", icon: HiOutlineArchiveBox },
  { key: "stress", label: "Stress radar", icon: HiOutlineShieldExclamation },
  { key: "chats", label: "Flagged chats", icon: TbMessageReport },
  ...(isAdminRole()
    ? [{ key: "admin", label: "Admin", icon: HiOutlineBell }]
    : []),
];

function isAdminRole() {
  try {
    return useAuthStore.getState().user?.role === "admin";
  } catch {
    return false;
  }
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stress, setStress] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [karma, setKarma] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      api
        .get("/orders/seller")
        .then((r) => r.data.orders)
        .catch(() => []),
      api
        .get("/products/mine")
        .then((r) => r.data.items)
        .catch(() => []),
      api
        .get("/stress/mine")
        .then((r) => r.data)
        .catch(() => null),
      api
        .get("/faq/flagged")
        .then((r) => r.data.items)
        .catch(() => []),
      api
        .get("/stress/karma")
        .then((r) => r.data)
        .catch(() => null),
    ]).then(([o, p, s, f, k]) => {
      setOrders(o);
      setProducts(p);
      setStress(s);
      setFlagged(f);
      setKarma(k);
      setLoading(false);
    });
  }, [user]);

  const gmv = useMemo(
    () =>
      orders
        .filter((o) =>
          ["paid", "packed", "shipped", "delivered"].includes(o.status),
        )
        .reduce((s, o) => s + (o.total || 0), 0),
    [orders],
  );
  const pending = orders.filter((o) =>
    ["pending", "paid", "packed"].includes(o.status),
  ).length;

  if (!user)
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-sm text-ink/60">
          Please{" "}
          <Link to="/login" className="text-coral">
            log in
          </Link>
        </p>
      </div>
    );
  if (loading)
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <Spinner />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <Reveal>
        <div className="text-[10px] uppercase tracking-[0.25em] font-jakarta font-semibold text-coral mb-2">
          Welcome back, {user.name.split(" ")[0]}
        </div>
        <div className="flex items-center gap-4">
          <Avatar
            src={user.avatar}
            name={user.name}
            size="lg"
            aura={user.trustScore}
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-fraunces text-2xl md:text-3xl text-ink tracking-tight truncate">
              {user.shopName || "Dashboard"}
            </h1>
            <div className="mt-1 text-[11px] text-ink/55 font-jakarta flex items-center gap-2 flex-wrap">
              <span>
                Role <strong className="text-ink/75">{user.role}</strong>
              </span>
              <span className="text-ink/20">·</span>
              <span>
                Referral{" "}
                <strong className="text-ink/75">{user.referralCode}</strong>
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Tabs */}
      <div className="mt-6 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-jakarta font-semibold shrink-0 transition border ${
              tab === t.key
                ? "bg-ink text-cream border-ink"
                : "bg-white/60 border-ink/5 text-ink/70 hover:border-ink/20"
            }`}
          >
            <t.icon className="text-sm" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "overview" && (
          <div className="grid md:grid-cols-4 gap-3">
            <KpiCard
              icon={<HiOutlineBolt />}
              label="GMV last 30d"
              value={
                <>
                  <span className="text-sm">₹</span>
                  <CountUp to={gmv} />
                </>
              }
              tone="from-coral to-tangerine text-white"
            />
            <KpiCard
              icon={<HiOutlineShoppingBag />}
              label="Orders"
              value={<CountUp to={orders.length} />}
              tone="from-mint to-lavender text-ink"
            />
            <KpiCard
              icon={<HiOutlineArchiveBox />}
              label="Pending"
              value={<CountUp to={pending} />}
              tone="from-butter to-peach text-ink"
            />
            <KpiCard
              icon={<TbCoins />}
              label="Coins"
              value={<CountUp to={user.coins || 0} />}
              tone="from-lavender to-mint text-ink"
            />

            <div className="md:col-span-2 rounded-2xl bg-white/80 border border-ink/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-jakarta font-semibold text-ink/50 mb-1">
                    Latest activity
                  </div>
                  <h4 className="font-fraunces text-base text-ink tracking-tight">
                    Recent orders
                  </h4>
                </div>
                <Link
                  to="#"
                  onClick={() => setTab("orders")}
                  className="text-[11px] font-jakarta font-semibold text-ink/50 hover:text-coral transition"
                >
                  View all →
                </Link>
              </div>
              {orders.slice(0, 6).map((o) => (
                <Link
                  to={`/order/${o._id}`}
                  key={o._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-peach/40 transition"
                >
                  <img
                    src={o.items[0]?.image}
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-jakarta font-semibold text-ink line-clamp-1">
                      {o.items[0]?.title}
                    </div>
                    <div className="text-[10px] text-ink/45 mt-0.5">
                      {dayjs(o.createdAt).fromNow?.() ||
                        dayjs(o.createdAt).format("D MMM")}
                    </div>
                  </div>
                  <Badge tone="peach">{o.status}</Badge>
                  <div className="font-fraunces text-xs text-ink tracking-tight">
                    ₹{o.total?.toLocaleString("en-IN")}
                  </div>
                </Link>
              ))}
              {orders.length === 0 && (
                <p className="mt-2 text-xs text-ink/50 font-jakarta italic">
                  No orders yet
                </p>
              )}
            </div>
            {karma && (
              <div className="md:col-span-2">
                <TrustGraph
                  trustScore={user.trustScore}
                  fraudKarma={karma.fraudKarma}
                  breakdown={{}}
                  verified={user.isVerifiedSeller}
                />
              </div>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="rounded-2xl bg-white/80 border border-ink/5 divide-y divide-ink/5 overflow-hidden">
            {orders.length === 0 && (
              <div className="p-6 text-center text-xs text-ink/50 font-jakarta italic">
                No orders yet
              </div>
            )}
            {orders.map((o) => (
              <Link
                to={`/order/${o._id}`}
                key={o._id}
                className="flex items-center gap-3 p-3 hover:bg-peach/40 transition"
              >
                <img
                  src={o.items[0]?.image}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-jakarta font-semibold text-ink font-mono">
                    #{String(o._id).slice(-8).toUpperCase()}
                  </div>
                  <div className="text-[11px] text-ink/55 mt-0.5">
                    {o.buyer?.name} · {dayjs(o.createdAt).format("D MMM")}
                  </div>
                </div>
                <Badge tone="mint">{o.status}</Badge>
                <div className="font-fraunces text-base text-ink tracking-tight">
                  ₹{o.total?.toLocaleString("en-IN")}
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === "products" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((p) => (
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="rounded-xl bg-white/80 border border-ink/5 overflow-hidden hover:-translate-y-0.5 transition"
              >
                <img
                  src={p.images?.[0]?.url}
                  alt=""
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <div className="text-xs font-jakarta font-semibold text-ink line-clamp-2">
                    {p.title}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[11px]">
                    <span className="font-fraunces text-sm text-ink tracking-tight">
                      ₹{p.price}
                    </span>
                    <span
                      className={`font-jakarta ${
                        p.stock === 0 ? "text-coral" : "text-leaf"
                      }`}
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {products.length === 0 && (
              <p className="col-span-full text-center text-xs text-ink/50 font-jakarta italic py-6">
                No products listed
              </p>
            )}
          </div>
        )}

        {tab === "stress" && (
          <div className="rounded-2xl bg-white/80 border border-ink/5 p-5">
            <div className="text-[10px] uppercase tracking-[0.25em] font-jakarta font-semibold text-coral mb-2">
              Operational health
            </div>
            <h3 className="font-fraunces text-xl text-ink tracking-tight flex items-center gap-2">
              <HiOutlineShieldExclamation className="text-coral" /> Stress radar
            </h3>
            <p className="text-xs text-ink/55 font-jakarta mt-1">
              Proactive coaching when your shop shows strain.
            </p>
            <div className="mt-5 flex items-center gap-5 flex-wrap">
              <Gauge score={stress?.score || 0} />
              <div className="flex-1 min-w-[240px]">
                {(stress?.signals || []).length === 0 ? (
                  <div className="rounded-xl bg-mint/40 border border-white p-3">
                    <p className="text-xs text-leaf font-jakarta font-semibold">
                      You're cruising — no stress signals detected.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {(stress?.signals || []).map((s) => (
                      <li
                        key={s.key}
                        className="rounded-xl bg-cream border border-ink/5 p-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            tone={
                              s.level === "high"
                                ? "coral"
                                : s.level === "medium"
                                  ? "peach"
                                  : "mint"
                            }
                          >
                            {s.level}
                          </Badge>
                          <span className="text-[10px] text-ink/45 font-jakarta uppercase tracking-wider">
                            Weight {s.weight}
                          </span>
                        </div>
                        <div className="text-xs text-ink font-jakarta">
                          {s.message}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "chats" && (
          <div className="rounded-2xl bg-white/80 border border-ink/5 divide-y divide-ink/5 overflow-hidden">
            {flagged.length === 0 && (
              <div className="p-8 text-center">
                <div className="text-xs text-leaf font-jakarta font-semibold">
                  No flagged chats — karma cruise
                </div>
              </div>
            )}
            {flagged.map((m) => (
              <div key={m._id} className="p-3 flex items-center gap-3">
                <Avatar
                  src={m.from?.avatar}
                  name={m.from?.name}
                  size="xs"
                  aura={m.from?.fraudKarma}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-jakarta font-semibold text-ink flex items-center gap-1">
                    <HiOutlineHeart className="text-coral text-xs" />{" "}
                    {m.from?.name}
                  </div>
                  <div className="text-[11px] text-coral italic mt-0.5">
                    Hidden by Controlled Chats
                  </div>
                </div>
                <Badge tone="coral">{m.moderation?.label || "flagged"}</Badge>
              </div>
            ))}
          </div>
        )}

        {tab === "admin" && <AdminPanel />}
      </div>
    </div>
  );
}

function KpiCard({ icon, label, value, tone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl p-4 border border-ink/5 bg-gradient-to-br ${tone}`}
    >
      <div className="text-lg opacity-70">{icon}</div>
      <div className="mt-2 text-[10px] uppercase font-jakarta font-semibold tracking-[0.2em] opacity-80">
        {label}
      </div>
      <div className="font-fraunces text-2xl tracking-tight mt-0.5">
        {value}
      </div>
    </motion.div>
  );
}

function Gauge({ score }) {
  const color = score >= 60 ? "#FF6B6B" : score >= 30 ? "#FFA94D" : "#51CF66";
  const pct = Math.min(100, score);
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#FFF3B0"
          strokeWidth="8"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 44}
          initial={{ strokeDashoffset: 2 * Math.PI * 44 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 44 * (1 - pct / 100) }}
          transition={{ duration: 1.2 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-fraunces text-2xl text-ink leading-none tracking-tight">
            <CountUp to={pct} />
          </div>
          <div className="text-[9px] text-ink/50 uppercase tracking-[0.2em] font-jakarta font-semibold mt-1">
            Stress
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function reindex() {
    setBusy(true);
    try {
      const { data } = await api.post("/ml/reindex");
      setMsg(`Re-indexed ${data.indexed} products.`);
    } catch (e) {
      setMsg(e.response?.data?.error || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white/80 border border-ink/5 p-5 space-y-3">
      <div className="text-[10px] uppercase tracking-[0.25em] font-jakarta font-semibold text-coral mb-2">
        Operator tools
      </div>
      <h3 className="font-fraunces text-xl text-ink tracking-tight flex items-center gap-2">
        <HiOutlineChatBubbleLeftRight className="text-mauve" /> Admin controls
      </h3>
      <button
        onClick={reindex}
        disabled={busy}
        className="rounded-full bg-ink text-cream font-jakarta font-semibold text-xs px-4 py-2 disabled:opacity-50 transition"
      >
        {busy ? "Re-indexing..." : "Re-build product embeddings"}
      </button>
      {msg && <div className="text-xs text-ink/60 font-jakarta">{msg}</div>}
    </div>
  );
}
