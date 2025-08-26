import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVenueById } from "../lib/venues";
import { createBooking } from "../lib/bookings";
import { getAccessToken, getApiKey, isAuthed } from "../lib/session";

export default function Venue() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // booking form state
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

  async function onBook(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!isAuthed()) {
      setErr("Please login to book.");
      return;
    }
    if (!dateFrom || !dateTo) {
      setErr("Please choose both start and end dates.");
      return;
    }
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      setErr("End date must be after start date.");
      return;
    }
    if (guests < 1 || (venue?.maxGuests && guests > venue.maxGuests)) {
      setErr(
        `Guests must be between 1 and ${venue?.maxGuests ?? "the venue limit"}.`
      );
      return;
    }

    try {
      setBusy(true);
      const payload = { dateFrom, dateTo, guests: Number(guests), venueId: id };
      await createBooking({ payload, accessToken, apiKey });
      setMsg("🎉 Booking created!");
      // optional: clear inputs
      // setDateFrom(""); setDateTo(""); setGuests(1);
    } catch (e) {
      setErr(e.message || "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6">Loading venue…</div>;
  if (err && !venue) return <div className="p-6 text-red-500">{err}</div>;
  if (!venue) return <div className="p-6">Not found</div>;

  const todayISO = new Date().toISOString().split("T")[0];

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

      <form
        onSubmit={onBook}
        className="mt-6 p-4 border border-white/10 rounded bg-white/5 space-y-3"
      >
        <h2 className="font-semibold">Book this venue</h2>
        {msg && <div className="text-green-400">{msg}</div>}
        {err && <div className="text-red-400">{err}</div>}

        <div className="grid sm:grid-cols-3 gap-3">
          <label className="block">
            <span className="text-sm">From</span>
            <input
              type="date"
              min={todayISO}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
            />
          </label>
          <label className="block">
            <span className="text-sm">To</span>
            <input
              type="date"
              min={dateFrom || todayISO}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
            />
          </label>
          <label className="block">
            <span className="text-sm">Guests</span>
            <input
              type="number"
              min={1}
              max={venue.maxGuests || 10}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
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

      {/* Later: render unavailable dates from venue bookings to make a proper calendar */}
    </div>
  );
}
