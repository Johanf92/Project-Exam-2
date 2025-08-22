import { useEffect, useState } from "react";
import { getVenues } from "../lib/venues";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getVenues({ accessToken, apiKey, q });
        if (!cancel) setVenues(res?.data || []);
      } catch (e) {
        if (!cancel) setErr(e.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [q]);

  if (loading) return <div className="p-6">Loading venues…</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <input
        className="border border-white/20 bg-black/40 text-white px-3 py-2 rounded w-full mb-4"
        placeholder="Search venues…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {venues.map((v) => (
          <article
            key={v.id}
            className="border border-white/10 rounded-lg p-4 bg-white/5"
          >
            <img
              src={
                v.media?.[0]?.url || "https://placehold.co/600x400?text=Venue"
              }
              alt={v.media?.[0]?.alt || v.name}
              className="rounded mb-3 w-full aspect-video object-cover"
            />
            <h3 className="font-semibold">{v.name}</h3>
            <p className="text-sm text-white/70 line-clamp-3">
              {v.description}
            </p>
            <div className="mt-2 text-sm">
              Max guests: {v.maxGuests} • Price: {v.price}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
