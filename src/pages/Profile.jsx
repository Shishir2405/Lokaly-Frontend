import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiStar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBuildingStorefront,
} from "react-icons/hi2";
import api from "../services/api";
import { Avatar } from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { Reveal } from "../components/animations/Reveal";
import { Spinner } from "../components/ui/Spinner";
import TrustGraph from "../components/TrustGraph";
import ProductCard from "../components/ProductCard";
import PostCard from "../components/PostCard";
import { MasonryGrid } from "../components/ui/Masonry";
import { useAuthStore } from "../store/authStore";

const TABS = [
  { key: "products", label: "Products" },
  { key: "posts", label: "Posts" },
  { key: "reviews", label: "Reviews" },
];

export default function Profile() {
  const params = useParams();
  const me = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isMe = params.id === "me";
  const id = isMe ? me?._id : params.id;

  // eslint-disable-next-line no-console
  console.log("[Profile] render", {
    paramId: params.id,
    isMe,
    resolvedId: id,
    hasToken: !!token,
    hasMe: !!me,
    meId: me?._id,
    meName: me?.name,
    meRole: me?.role,
  });

  // Seed synchronously: when viewing /profile/me, start with the auth user so
  // the page is never empty (and never flashes "Profile not found") while the
  // background /trust enrichment is in flight.
  const [user, setUser] = useState(() => (isMe && me ? me : null));
  const [trust, setTrust] = useState(null);
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep the seeded user in sync if the auth me hydrates/changes while we're on the page.
  useEffect(() => {
    if (isMe && me && !user) setUser(me);
  }, [isMe, me, user]);

  useEffect(() => {
    if (!id) {
      // /profile/me on a fresh tab where auth hasn't hydrated yet. Just wait —
      // the isMe+me effect above or the Navigate guard below will take over.
      if (!isMe || !token) setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    const jobs = [
      api
        .get(`/trust/${id}`)
        .then(({ data }) => {
          if (cancelled) return;
          // eslint-disable-next-line no-console
          console.log("[Profile] /trust OK", { id, data });
          // Merge server-side enriched fields on top of any cached me fields.
          setUser((prev) => ({ ...(prev || {}), ...(data.user || {}) }));
          setTrust(data);
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error("[Profile] /trust FAILED", {
            id,
            status: err?.response?.status,
            data: err?.response?.data,
            message: err.message,
          });
          if (cancelled) return;
          const status = err?.response?.status;
          // 404 = user id doesn't exist at all. For viewers-of-others, show not-found.
          // For /me we still keep the cached auth user as fallback (stale but renderable).
          if (status === 404 && !isMe) setNotFound(true);
          if (isMe && me) setUser(me);
        }),
      api
        .get("/products", { params: { seller: id, limit: 12 } })
        .then(({ data }) => !cancelled && setProducts(data.items || []))
        .catch(() => !cancelled && setProducts([])),
      api
        .get("/posts", { params: { authorId: id, limit: 12 } })
        .then(({ data }) => !cancelled && setPosts(data.items || []))
        .catch(() => !cancelled && setPosts([])),
      api
        .get(`/reviews/seller/${id}`)
        .then(({ data }) => !cancelled && setReviews(data.items || []))
        .catch(() => !cancelled && setReviews([])),
    ];

    Promise.allSettled(jobs).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, isMe, token, me]);

  // Not logged in and asking for /me: send to login.
  if (isMe && !token) {
    return <Navigate to="/login?next=/profile/me" replace />;
  }

  // Strict not-found only when we truly tried and got a 404 for a non-me id.
  if (notFound && !user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="font-fraunces text-2xl text-ink tracking-tight">
          Profile not found
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          This shop may have been removed or the link is outdated.
        </p>
      </div>
    );
  }

  // No user yet AND nothing has loaded AND we're still loading → show spinner.
  if (!user && loading) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  // Final safety net: if we somehow still have no user object (e.g. /profile/me
  // right after login before `me` propagates), render a minimal empty state
  // instead of crashing the render below.
  if (!user) {
    return (
      <div className="min-h-[50vh] grid place-items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          initial={{ y: -16 }}
          animate={{ y: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-peach via-lavender to-mint"
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row gap-5 md:items-end">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xl"
              aura={user.trustScore}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.25em] font-jakarta font-semibold text-ink/60 mb-2">
                {user.role === "seller" ? "Seller profile" : "Buyer profile"}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {user.isVerifiedSeller && (
                  <Badge tone="mint" icon={<HiOutlineShieldCheck />}>
                    Verified
                  </Badge>
                )}
                {user.role === "seller" && (
                  <Badge tone="peach" icon={<HiOutlineBuildingStorefront />}>
                    {user.shopCategory || "Shop"}
                  </Badge>
                )}
                {trust?.trustScore >= 85 && (
                  <Badge tone="coral">Local hero</Badge>
                )}
              </div>
              <h1 className="font-fraunces text-3xl md:text-4xl text-ink mt-2 tracking-tight">
                {user.shopName || user.name}
              </h1>
              <div className="mt-1.5 text-xs text-ink/65 font-jakarta flex items-center gap-1.5">
                <HiOutlineMapPin className="text-sm" />
                {user.location?.city || "India"}
              </div>
              {user.bio && (
                <p className="mt-3 max-w-lg text-xs text-ink/70 font-jakarta leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
            {me && me._id !== id && (
              <Link
                to={`/messages?to=${id}`}
                className="rounded-full bg-ink text-cream font-jakarta font-semibold text-xs px-5 py-2.5 inline-flex items-center gap-1.5 hover:bg-ink/90 transition shrink-0"
              >
                <HiOutlineChatBubbleLeftRight className="text-sm" /> Message
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-10 grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-full font-jakarta font-semibold text-xs transition border shrink-0 ${
                  tab === t.key
                    ? "bg-ink text-cream border-ink"
                    : "bg-white/60 border-ink/5 text-ink/70 hover:border-ink/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-5">
            {tab === "products" &&
              (products.length === 0 ? (
                <EmptyTabState label="No products yet" />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              ))}
            {tab === "posts" &&
              (posts.length === 0 ? (
                <EmptyTabState label="No posts yet" />
              ) : (
                <MasonryGrid breakpointCols={{ default: 2, 900: 1 }}>
                  {posts.map((p) => (
                    <PostCard key={p._id} post={p} />
                  ))}
                </MasonryGrid>
              ))}
            {tab === "reviews" &&
              (reviews.length === 0 ? (
                <EmptyTabState label="No reviews yet" />
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {reviews.map((r) => (
                    <Reveal key={r._id}>
                      <div className="rounded-2xl bg-white/80 border border-ink/5 p-4">
                        <div className="flex items-center gap-2">
                          <Avatar
                            src={r.buyer?.avatar}
                            name={r.buyer?.name}
                            size="xs"
                          />
                          <div className="flex-1 text-xs font-jakarta font-semibold text-ink truncate">
                            {r.buyer?.name}
                          </div>
                          <div className="flex items-center text-[11px]">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <HiStar
                                key={i}
                                className={
                                  i < r.rating
                                    ? "text-tangerine"
                                    : "text-ink/15"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <Link
                          to={`/product/${r.product?._id}`}
                          className="mt-1 block text-[10px] text-mauve hover:text-coral transition font-jakarta"
                        >
                          On {r.product?.title}
                        </Link>
                        <p className="mt-1.5 text-[12px] text-ink/75 font-jakarta leading-relaxed">
                          {r.text}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <aside className="space-y-4">
          {user.role === "seller" && (
            <TrustGraph
              trustScore={trust?.trustScore || user.trustScore}
              fraudKarma={user.fraudKarma}
              breakdown={trust?.breakdown}
              verified={user.isVerifiedSeller}
            />
          )}
          <div className="rounded-2xl bg-butter/50 border border-ink/5 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] font-jakarta font-semibold text-ink/50 mb-2">
              About this shop
            </div>
            <p className="text-xs text-ink/70 font-jakarta leading-relaxed">
              Every shop on Lokaly earns trust one review, one delivery, one
              namaste at a time.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function EmptyTabState({ label }) {
  return (
    <div className="rounded-2xl bg-white/60 border border-ink/5 p-6 text-center">
      <p className="text-xs text-ink/50 font-jakarta italic">{label}</p>
    </div>
  );
}
