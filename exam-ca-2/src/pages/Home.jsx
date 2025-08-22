import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVenues } from "../lib/venues";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    if (!accessToken || !apiKey) {
      setErr("Please login to view venues.");
      setLoading(false);
      return;
    }
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
  }, [q, accessToken, apiKey]);

  if (loading) return <div className="p-6">Loading venues…</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
          placeholder="Search venues…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {venues.map((v) => (
          <Link
            to={`/venue/${v.id}`}
            key={v.id}
            className="border border-white/10 rounded-lg overflow-hidden bg-white/5 hover:border-white/20"
          >
            <img
              src={
                v.media?.[0]?.url || "https://placehold.co/600x400?text=Venue"
              }
              alt={v.media?.[0]?.alt || v.name}
              className="w-full aspect-video object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold">{v.name}</h3>
              <div className="mt-1 text-sm text-white/70 line-clamp-2">
                {v.description}
              </div>
              <div className="mt-2 text-sm">
                Guests: {v.maxGuests} • Price: {v.price}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
