import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById, updateVenue } from "../lib/venues.js";
import { getAccessToken, getApiKey } from "../lib/session.js";
import { getProfile } from "../lib/profiles.js";
import MediaList from "../components/MediaList.jsx";

export default function EditVenue() {
  const { id } = useParams();
  const nav = useNavigate();
  const accessToken = getAccessToken();
  const apiKey = getApiKey();
  const nameFromLS = localStorage.getItem("profileName");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [isManager, setIsManager] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    maxGuests: "",
    media: [{ url: "", alt: "" }],
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  function update(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const prof = await getProfile({
          name: nameFromLS,
          accessToken,
          apiKey,
        });
        if (!cancel) setIsManager(!!prof?.data?.venueManager);

        const res = await getVenueById({ id, accessToken, apiKey });
        const v = res?.data;
        if (v && !cancel) {
          setForm({
            name: v.name || "",
            description: v.description || "",
            price: String(v.price ?? ""),
            maxGuests: String(v.maxGuests ?? ""),
            media:
              v.media && v.media.length
                ? v.media.map((m) => ({
                    url: m.url || "",
                    alt: m.alt || v.name || "",
                  }))
                : [{ url: "", alt: "" }],
            wifi: !!v.meta?.wifi,
            parking: !!v.meta?.parking,
            breakfast: !!v.meta?.breakfast,
            pets: !!v.meta?.pets,
            address: v.location?.address || "",
            city: v.location?.city || "",
            zip: v.location?.zip || "",
            country: v.location?.country || "",
          });
        }
      } catch (e) {
        if (!cancel) setErr(e.message);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [id, nameFromLS, accessToken, apiKey]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!isManager) {
      setErr("You must be a venue manager to edit venues.");
      return;
    }
    if (!form.name?.trim()) return setErr("Name is required");
    if (!form.price || Number(form.price) < 0)
      return setErr("Price must be ≥ 0");
    if (!form.maxGuests || Number(form.maxGuests) < 1)
      return setErr("Max guests must be ≥ 1");

    const media = (form.media || [])
      .map((m) => ({ url: m.url?.trim(), alt: (m.alt || form.name).trim() }))
      .filter((m) => !!m.url)
      .slice(0, 8);

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      media,
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
      await updateVenue({ id, payload, accessToken, apiKey });
      nav(`/venue/${id}`);
    } catch (e) {
      setErr(e.message || "Failed to update venue");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6 text-black">Loading venue…</div>;
  if (err && !form.name) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-black mb-4">Edit venue</h1>
      {err && <div className="mb-3 text-red-600">{err}</div>}

      <form
        onSubmit={onSubmit}
        className="space-y-5 border border-black/10 rounded bg-white p-4"
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block text-black">
            <span className="text-sm">Name *</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>
          <label className="block text-black">
            <span className="text-sm">Price *</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
            />
          </label>
          <label className="block text-black">
            <span className="text-sm">Max guests *</span>
            <input
              type="number"
              min={1}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.maxGuests}
              onChange={(e) => update("maxGuests", e.target.value)}
            />
          </label>
          <label className="block text-black sm:col-span-2">
            <span className="text-sm">Description</span>
            <textarea
              rows={4}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </label>
        </div>

        {/* Multiple images */}
        <div>
          <h2 className="font-semibold text-black mb-2">Images</h2>
          <MediaList
            items={form.media}
            onChange={(val) => update("media", val)}
          />
        </div>

        <fieldset className="grid sm:grid-cols-4 gap-3 text-black">
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

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block text-black">
            <span className="text-sm">Address</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
          <label className="block text-black">
            <span className="text-sm">City</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </label>
          <label className="block text-black">
            <span className="text-sm">ZIP</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.zip}
              onChange={(e) => update("zip", e.target.value)}
            />
          </label>
          <label className="block text-black">
            <span className="text-sm">Country</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
            />
          </label>
        </div>

        <button
          disabled={busy}
          className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
