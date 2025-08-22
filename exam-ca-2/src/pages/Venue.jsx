import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../lib/venues";

export default function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await getVenueById({ id, accessToken, apiKey });
        if (!cancel) setVenue(res?.data);
      } catch (e) {
        if (!cancel) setErr(e.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id, accessToken, apiKey]);

  if (loading) return <div className="p-6">Loading venue…</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;
  if (!venue) return <div className="p-6">Not found</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={venue.media?.[0]?.url || "https://placehold.co/800x450?text=Venue"}
        alt={venue.media?.[0]?.alt || venue.name}
        className="w-full rounded mb-4 aspect-video object-cover"
      />
      <h1 className="text-2xl font-bold">{venue.name}</h1>
      <p className="mt-2 text-white/80">{venue.description}</p>
      <div className="mt-3 text-sm">
        Max guests: {venue.maxGuests} • Price: {venue.price}
      </div>
      {/* Next: availability calendar + booking form */}
    </div>
  );
}
