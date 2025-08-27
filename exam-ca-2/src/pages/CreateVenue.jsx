import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../lib/venues.js";
import { getAccessToken, getApiKey } from "../lib/session.js";
import { getProfile } from "../lib/profiles.js";

export default function CreateVenue() {
  const nav = useNavigate();
  const accessToken = getAccessToken();
  const apiKey = getApiKey();
  const nameFromLS = localStorage.getItem("profileName");

  // simple manager gate (fetch profile to confirm)
  const [isManager, setIsManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await getProfile({ name: nameFromLS, accessToken, apiKey });
        if (!cancel) setIsManager(!!res?.data?.venueManager);
      } catch (e) {
        if (!cancel) setErr(e.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [nameFromLS, accessToken, apiKey]);

  // form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    mediaUrl: "",
    mediaAlt: "",
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    // basic validation
    if (!form.name?.trim()) return setErr("Name is required");
    if (!form.price || Number(form.price) < 0)
      return setErr("Price must be ≥ 0");
    if (!form.maxGuests || Number(form.maxGuests) < 1)
      return setErr("Max guests must be ≥ 1");

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      media: form.mediaUrl
        ? [
            {
              url: form.mediaUrl.trim(),
              alt: form.mediaAlt?.trim() || form.name.trim(),
            },
          ]
        : [],
      price: Number(form.price),
      maxGuests: Number(form.maxGuests),
      meta: {
        wifi: !!form.wifi,
        parking: !!form.parking,
        breakfast: !!form.breakfast,
        pets: !!form.pets,
      },
      location: {
        address: form.address?.trim() || "",
        city: form.city?.trim() || "",
        zip: form.zip?.trim() || "",
        country: form.country?.trim() || "",
      },
    };

    try {
      setBusy(true);
      const res = await createVenue({ payload, accessToken, apiKey });
      setMsg("🎉 Venue created!");
      // Navigate to dashboard or the new venue
      // nav(`/venue/${res?.data?.id}`);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message || "Failed to create venue");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6">Checking manager access…</div>;
  if (!isManager) {
    return (
      <div className="p-6 text-red-500">
        You must be a venue manager to create venues.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a venue</h1>
      {msg && <div className="mb-3 text-green-400">{msg}</div>}
      {err && <div className="mb-3 text-red-400">{err}</div>}

      <form
        onSubmit={onSubmit}
        className="space-y-4 border border-white/10 rounded bg-white/5 p-4"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Name *</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Price *</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Max guests *</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.maxGuests}
              onChange={(e) => update("maxGuests", e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-sm">Description</span>
            <textarea
              rows={4}
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>
        </div>

        {/* Media */}
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Image URL</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.mediaUrl}
              onChange={(e) => update("mediaUrl", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Image alt</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.mediaAlt}
              onChange={(e) => update("mediaAlt", e.target.value)}
            />
          </label>
        </div>

        {/* Amenities */}
        <fieldset className="grid sm:grid-cols-4 gap-3">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.wifi}
              onChange={(e) => update("wifi", e.target.checked)}
            />
            <span>Wi-Fi</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.parking}
              onChange={(e) => update("parking", e.target.checked)}
            />
            <span>Parking</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.breakfast}
              onChange={(e) => update("breakfast", e.target.checked)}
            />
            <span>Breakfast</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.pets}
              onChange={(e) => update("pets", e.target.checked)}
            />
            <span>Pets</span>
          </label>
        </fieldset>

        {/* Location */}
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm">Address</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">City</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">ZIP</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm">Country</span>
            <input
              className="mt-1 w-full border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </label>
        </div>

        <button
          disabled={busy}
          className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create venue"}
        </button>
      </form>
    </div>
  );
}
