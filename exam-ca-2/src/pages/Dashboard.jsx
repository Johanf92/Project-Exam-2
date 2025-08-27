import { useEffect, useMemo, useState } from "react";
import { getAccessToken, getApiKey } from "../lib/session.js";
import { getProfile, updateAvatar } from "../lib/profiles.js";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const accessToken = getAccessToken();
  const apiKey = getApiKey();
  const name = localStorage.getItem("profileName"); // saved at login

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getProfile({
          name,
          accessToken,
          apiKey,
          _bookings: true,
          _venues: true,
        });
        if (!cancel) {
          setProfile(res?.data);
          setAvatarUrl(res?.data?.avatar?.url || "");
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
  }, [name, accessToken, apiKey]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return (profile?.bookings || [])
      .filter((b) => new Date(b.dateTo).getTime() >= now)
      .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }, [profile]);

  async function onAvatarSubmit(e) {
    e.preventDefault();
    try {
      setBusy(true);
      await updateAvatar({
        name,
        avatar: { url: avatarUrl, alt: `${name}'s avatar` },
        accessToken,
        apiKey,
      });
      // Refetch profile (or just patch state)
      const res = await getProfile({
        name,
        accessToken,
        apiKey,
        _bookings: true,
        _venues: true,
      });
      setProfile(res?.data);
    } catch (e) {
      alert(e.message || "Avatar update failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6">Loading dashboard…</div>;
  if (err) return <div className="p-6 text-red-500">{err}</div>;
  if (!profile) return <div className="p-6">No profile</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Profile header */}
      <section className="flex items-center gap-4">
        <img
          src={profile.avatar?.url || "https://placehold.co/80x80?text=Avatar"}
          alt={profile.avatar?.alt || profile.name}
          className="w-16 h-16 rounded-full border border-white/10 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <div className="text-white/70 text-sm">
            {profile.venueManager ? "Venue manager" : "Customer"}
          </div>
        </div>
      </section>

      {/* Avatar updater */}
      <section className="p-4 border border-white/10 rounded bg-white/5">
        <h2 className="font-semibold mb-2">Update avatar</h2>
        <form onSubmit={onAvatarSubmit} className="flex gap-2">
          <input
            className="flex-1 border border-white/20 bg-black/40 text-white px-3 py-2 rounded"
            placeholder="https://…"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <button
            disabled={busy}
            className="px-4 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </form>
      </section>

      {/* Upcoming bookings */}
      <section>
        <h2 className="font-semibold mb-2">Upcoming bookings</h2>
        {!upcoming.length && (
          <div className="text-white/70">No upcoming bookings.</div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {upcoming.map((b) => (
            <article
              key={b.id}
              className="border border-white/10 rounded p-3 bg-white/5"
            >
              <div className="text-sm text-white/70">
                {new Date(b.dateFrom).toISOString().slice(0, 10)} →{" "}
                {new Date(b.dateTo).toISOString().slice(0, 10)}
              </div>
              {b.venue && (
                <div className="mt-1">
                  <div className="font-semibold">{b.venue.name}</div>
                  <img
                    src={
                      b.venue.media?.[0]?.url ||
                      "https://placehold.co/600x400?text=Venue"
                    }
                    alt={b.venue.media?.[0]?.alt || b.venue.name}
                    className="w-full rounded mt-2 aspect-video object-cover"
                  />
                </div>
              )}
              <div className="mt-2 text-sm">Guests: {b.guests}</div>
            </article>
          ))}
        </div>
      </section>

      {/* Manager: my venues */}
      {profile.venueManager && (
        <section>
          <h2 className="font-semibold mb-2">My venues</h2>
          {!profile.venues?.length && (
            <div className="text-white/70">You have no venues yet.</div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {profile.venues?.map((v) => (
              <article
                key={v.id}
                className="border border-white/10 rounded p-3 bg-white/5"
              >
                <img
                  src={
                    v.media?.[0]?.url ||
                    "https://placehold.co/600x400?text=Venue"
                  }
                  alt={v.media?.[0]?.alt || v.name}
                  className="w-full rounded mb-2 aspect-video object-cover"
                />
                <div className="font-semibold">{v.name}</div>
                <div className="text-sm text-white/70">
                  Guests: {v.maxGuests} • Price: {v.price}
                </div>
                {/* Next steps: edit/delete buttons */}
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
