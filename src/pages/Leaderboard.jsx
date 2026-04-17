import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineTrophy,
  HiStar,
  HiOutlineShieldCheck,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { TbCrown, TbMedal } from "react-icons/tb";
import api from "../services/api";
import { Avatar } from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { Reveal } from "../components/animations/Reveal";
import { Spinner } from "../components/ui/Spinner";

const CITIES = [
  "All",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Lucknow",
  "Varanasi",
];

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const [city, setCity] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params: { sort: "rating", limit: 60 } })
      .then(({ data }) => {
        const sellers = new Map();
        for (const p of data.items || []) {
          const s = p.seller;
          if (!s) continue;
          const cur = sellers.get(s._id) || { ...s, productCount: 0 };
          cur.productCount += 1;
          sellers.set(s._id, cur);
        }
        let list = Array.from(sellers.values()).sort(
          (a, b) => (b.trustScore || 0) - (a.trustScore || 0),
        );
        if (city !== "All")
          list = list.filter((s) => s.location?.city === city);
        setRows(list.slice(0, 30));
      })
      .finally(() => setLoading(false));
  }, [city]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  const PODIUM_ICON = [TbCrown, TbMedal, HiOutlineTrophy];
  const PODIUM_TONE = ["coral", "peach", "butter"];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <Reveal>
        <div className="text-[10px] uppercase tracking-[0.25em] font-jakarta font-semibold text-coral mb-2">
          Weekly local heroes
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-fraunces text-2xl md:text-3xl text-ink tracking-tight flex items-center gap-2">
              <HiOutlineTrophy className="text-mauve" />
              Karma leaderboard
            </h1>
            <p className="mt-1 text-xs text-ink/55 font-jakarta">
              Top sellers ranked by trust score, karma, and community karma.
            </p>
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-full bg-white/80 px-3 py-1.5 border border-ink/10 text-xs font-jakarta font-semibold text-ink cursor-pointer hover:border-ink/20 transition"
          >
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </Reveal>

      {loading ? (
        <div className="mt-10 grid place-items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            {top3.map((s, i) => {
              const Icon = PODIUM_ICON[i];
              return (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className={`rounded-2xl p-4 border border-ink/5 relative overflow-hidden ${
                    i === 0
                      ? "bg-gradient-to-br from-coral to-tangerine text-white"
                      : i === 1
                        ? "bg-gradient-to-br from-peach to-butter text-ink"
                        : "bg-gradient-to-br from-lavender to-mint text-ink"
                  }`}
                >
                  {/* Rank marker */}
                  <div
                    className={`absolute top-3 left-3 text-[10px] uppercase tracking-[0.2em] font-jakarta font-bold ${
                      i === 0 ? "text-white/80" : "text-ink/60"
                    }`}
                  >
                    Rank 0{i + 1}
                  </div>

                  <motion.span
                    animate={{ rotate: [0, 6, -4, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className="absolute top-3 right-3 text-2xl opacity-80"
                  >
                    <Icon />
                  </motion.span>

                  <Link
                    to={`/profile/${s._id}`}
                    className="flex items-center gap-2.5 mt-6"
                  >
                    <Avatar
                      src={s.avatar}
                      name={s.name}
                      size="md"
                      aura={s.trustScore}
                    />
                    <div className="min-w-0">
                      <div className="font-fraunces text-base tracking-tight truncate">
                        {s.shopName || s.name}
                      </div>
                      <div
                        className={`text-[10px] flex items-center gap-1 mt-0.5 ${
                          i === 0 ? "text-white/80" : "text-ink/60"
                        }`}
                      >
                        <HiOutlineMapPin className="text-xs" />
                        <span className="truncate">
                          {s.location?.city || "India"}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="mt-4 flex items-end gap-5">
                    <div>
                      <div
                        className={`text-[9px] uppercase tracking-[0.2em] font-jakarta font-semibold ${
                          i === 0 ? "text-white/70" : "text-ink/55"
                        }`}
                      >
                        Trust
                      </div>
                      <div className="font-fraunces text-2xl tracking-tight mt-0.5">
                        {s.trustScore}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`text-[9px] uppercase tracking-[0.2em] font-jakarta font-semibold ${
                          i === 0 ? "text-white/70" : "text-ink/55"
                        }`}
                      >
                        Karma
                      </div>
                      <div className="font-fraunces text-xl tracking-tight mt-0.5">
                        {s.fraudKarma}
                      </div>
                    </div>
                  </div>

                  <Badge tone={PODIUM_TONE[i]} className="mt-3">
                    Local hero this week
                  </Badge>
                </motion.div>
              );
            })}
          </div>

          {/* Rest of the leaderboard */}
          {rest.length > 0 && (
            <section className="mt-6 rounded-2xl bg-white/80 border border-ink/5 divide-y divide-ink/5 overflow-hidden">
              <div className="px-4 py-2.5 bg-cream/40">
                <div className="text-[10px] uppercase tracking-[0.2em] font-jakarta font-semibold text-ink/50">
                  Rising sellers
                </div>
              </div>
              {rest.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.02 }}
                  className="px-4 py-2.5 flex items-center gap-3 hover:bg-peach/20 transition"
                >
                  <span className="w-7 text-ink/45 font-fraunces text-sm tracking-tight shrink-0">
                    {String(i + 4).padStart(2, "0")}
                  </span>
                  <Avatar
                    src={s.avatar}
                    name={s.name}
                    size="xs"
                    aura={s.trustScore}
                  />
                  <Link to={`/profile/${s._id}`} className="flex-1 min-w-0">
                    <div className="font-jakarta font-semibold text-xs text-ink flex items-center gap-1 truncate">
                      {s.shopName || s.name}
                      {s.isVerifiedSeller && (
                        <HiOutlineShieldCheck className="text-leaf text-sm shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-ink/50 mt-0.5">
                      {s.location?.city}
                    </div>
                  </Link>
                  <div className="flex items-center gap-3 text-[11px] font-jakarta">
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-ink/45">
                        Trust
                      </div>
                      <div className="font-fraunces text-sm text-ink tracking-tight">
                        {s.trustScore}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-butter">
                      <HiStar className="text-sm fill-butter" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}
