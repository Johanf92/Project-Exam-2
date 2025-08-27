// src/pages/Venue.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../lib/venues.js";
import { createBooking } from "../lib/bookings.js";
import { getAccessToken, getApiKey, isAuthed } from "../lib/session.js";
import { overlaps } from "../lib/dateRange.js";
import CalendarRange from "../components/CalendarRange.jsx";

export default function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // booking form
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [guests, setGuests] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const accessToken = getAccessToken();
  const apiKey = getApiKey();

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        // includeBookings=true so the calendar can disable booked dates
        const res = await getVenueById({
          id,
          accessToken,
          apiKey,
          includeBookings: true,
        });
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

  function toISO(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-").map(Number);
    // midday -> avoids DST/tz edge cases
    return new Date(y, m - 1, d, 12, 0, 0).toISOString();
  }

  async function onBook(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!isAuthed()) return setErr("Please login to book.");
    if (!dateFrom || !dateTo)
      return setErr("Please choose both start and end dates.");

    const startISO = toISO(dateFrom);
    const endISO = toISO(dateTo);

    const start = new Date(startISO);
    const end = new Date(endISO);
    if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
      return setErr("End date must be after start date.");
    }

    const max = venue?.maxGuests ?? 1;
    const nGuests = Number(guests);
    if (nGuests < 1 || nGuests > max) {
      return setErr(`Guests must be between 1 and ${max}.`);
    }

    // Prevent overlaps before calling API (mirror server 409)
    const existing = venue?.bookings || [];
    const conflict = existing.some((b) =>
      overlaps(startISO, endISO, b.dateFrom, b.dateTo)
    );
    if (conflict)
      return setErr("Those dates are already booked. Try different dates.");

    try {
      setBusy(true);
      await createBooking({
        payload: {
          dateFrom: startISO,
          dateTo: endISO,
          guests: nGuests,
          venueId: id,
        },
        accessToken,
        apiKey,
      });
      setMsg("🎉 Booking created!");
    } catch (e) {
      setErr(e.message || "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6 text-black">Loading venue…</div>;
  if (err && !venue) return <div className="p-6 text-red-600">{err}</div>;
  if (!venue) return <div className="p-6 text-black">Not found</div>;

  const hero =
    venue.media?.[0]?.url || "https://placehold.co/1200x600?text=Venue";
  const meta = venue.meta || {};
  const loc = venue.location || {};

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden border border-black/10 bg-white">
        <img
          src={hero}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Title + quick facts */}
      <section className="rounded-2xl bg-white border border-black/10 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-black">{venue.name}</h1>
            <p className="text-black/70 text-sm">
              {loc.city || loc.address || "—"}
              {loc.country ? `, ${loc.country}` : ""}
            </p>
          </div>
          <div className="text-sm flex flex-wrap gap-2">
            <span className="px-2 py-1 rounded border border-black/10 bg-white text-black">
              Guests: {venue.maxGuests}
            </span>
            <span className="px-2 py-1 rounded border border-black/10 bg-white text-black">
              Price: {venue.price}
            </span>
            {typeof venue.rating === "number" && (
              <span className="px-2 py-1 rounded border border-black/10 bg-white text-black">
                Rating: {venue.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-black">
          {meta.wifi && (
            <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
              Wi-Fi
            </span>
          )}
          {meta.parking && (
            <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
              Parking
            </span>
          )}
          {meta.breakfast && (
            <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
              Breakfast
            </span>
          )}
          {meta.pets && (
            <span className="px-2 py-1 rounded bg-black/5 border border-black/10">
              Pets allowed
            </span>
          )}
        </div>

        {/* Description */}
        {venue.description && (
          <p className="mt-4 text-black leading-relaxed">{venue.description}</p>
        )}

        {/* Gallery */}
        {venue.media?.length > 1 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {venue.media.slice(1, 5).map((m, i) => (
              <img
                key={i}
                src={m.url}
                alt={m.alt || `Photo ${i + 2}`}
                className="w-full aspect-video object-cover rounded border border-black/10"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </section>

      {/* Availability */}
      <section className="rounded-2xl bg-white border border-black/10 p-4">
        <h2 className="font-semibold text-black mb-2">Availability</h2>
        <CalendarRange
          bookings={venue.bookings || []}
          selected={{
            from: dateFrom ? new Date(dateFrom) : undefined,
            to: dateTo ? new Date(dateTo) : undefined,
          }}
          onSelect={(range) => {
            if (!range) return;
            const fmt = (d) => d?.toISOString?.().slice(0, 10) || "";
            setDateFrom(range.from ? fmt(range.from) : "");
            setDateTo(range.to ? fmt(range.to) : "");
          }}
        />
        {/* Optional compact list below the calendar */}
        {!!venue.bookings?.length && (
          <div className="text-xs text-black/70 mt-3">
            Unavailable:&nbsp;
            {venue.bookings.map((b) => (
              <span key={b.id} className="mr-2">
                {new Date(b.dateFrom).toISOString().slice(0, 10)} →{" "}
                {new Date(b.dateTo).toISOString().slice(0, 10)}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Booking form */}
      <section className="rounded-2xl bg-white border border-black/10 p-4">
        <form onSubmit={onBook} className="space-y-3">
          <h2 className="font-semibold text-black">Book this venue</h2>
          {msg && <div className="text-green-600">{msg}</div>}
          {err && <div className="text-red-600">{err}</div>}

          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block text-black">
              <span className="text-sm">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              />
            </label>
            <label className="block text-black">
              <span className="text-sm">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              />
            </label>
            <label className="block text-black">
              <span className="text-sm">Guests</span>
              <input
                type="number"
                min={1}
                max={venue.maxGuests || 10}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              />
            </label>
          </div>

          <button
            disabled={busy}
            className="mt-2 px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
          >
            {busy ? "Booking…" : "Book now"}
          </button>
        </form>
      </section>
    </div>
  );
}
