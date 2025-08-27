// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAccessToken, getApiKey } from "../lib/session.js";
import { getProfile, updateAvatar, updateProfile } from "../lib/profiles.js";
import Modal from "../components/Modal.jsx";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // Avatar modal state
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  // Confirm disable-manager modal
  const [confirmOffOpen, setConfirmOffOpen] = useState(false);

  const accessToken = getAccessToken();
  const apiKey = getApiKey();
  const name = localStorage.getItem("profileName");

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

  async function onAvatarSave() {
    try {
      setBusy(true);
      await updateAvatar({
        name,
        avatar: { url: avatarUrl, alt: `${name}'s avatar` },
        accessToken,
        apiKey,
      });
      const res = await getProfile({
        name,
        accessToken,
        apiKey,
        _bookings: true,
        _venues: true,
      });
      setProfile(res?.data);
      setAvatarOpen(false);
    } catch (e) {
      alert(e.message || "Avatar update failed");
    } finally {
      setBusy(false);
    }
  }

  async function enableManager() {
    try {
      setBusy(true);
      await updateProfile({
        name,
        payload: { venueManager: true },
        accessToken,
        apiKey,
      });
      const res = await getProfile({
        name,
        accessToken,
        apiKey,
        _bookings: true,
        _venues: true,
      });
      setProfile(res?.data);
    } catch (e) {
      alert(e.message || "Failed to enable manager role");
    } finally {
      setBusy(false);
    }
  }

  async function disableManager() {
    try {
      setBusy(true);
      await updateProfile({
        name,
        payload: { venueManager: false },
        accessToken,
        apiKey,
      });
      const res = await getProfile({
        name,
        accessToken,
        apiKey,
        _bookings: true,
        _venues: true,
      });
      setProfile(res?.data);
      setConfirmOffOpen(false);
    } catch (e) {
      alert(e.message || "Failed to disable manager role");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="p-6 text-black">Loading dashboard…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!profile) return <div className="p-6 text-black">No profile</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Profile header + manager controls */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-white border border-black/10 p-4">
        <div className="flex items-center gap-4">
          <img
            src={
              profile.avatar?.url || "https://placehold.co/80x80?text=Avatar"
            }
            alt={profile.avatar?.alt || profile.name}
            className="w-16 h-16 rounded-full border border-black/10 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-black">{profile.name}</h1>
            <div className="text-black/70 text-sm">
              {profile.venueManager ? "Venue manager" : "Customer"}
            </div>
            <button
              onClick={() => setAvatarOpen(true)}
              className="mt-2 inline-block px-3 py-1.5 rounded bg-black text-white text-sm"
            >
              Update avatar
            </button>
          </div>
        </div>

        {/* Manager toggle + create button (if enabled) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-black/70 text-sm">Venue manager:</span>
            <button
              type="button"
              onClick={() => {
                if (profile.venueManager) {
                  setConfirmOffOpen(true);
                } else {
                  enableManager();
                }
              }}
              disabled={busy}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                profile.venueManager ? "bg-black" : "bg-black/30"
              } ${busy ? "opacity-60" : ""}`}
              aria-pressed={profile.venueManager}
              aria-label="Toggle venue manager role"
              title={
                profile.venueManager
                  ? "Disable manager role"
                  : "Enable manager role"
              }
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  profile.venueManager ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {profile.venueManager && (
            <Link
              to="/venues/new"
              className="px-3 py-2 rounded bg-yellow-400 text-black font-semibold"
            >
              + Create venue
            </Link>
          )}
        </div>
      </section>

      {/* Upcoming bookings */}
      <section className="rounded-2xl bg-white border border-black/10 p-4">
        <h2 className="font-semibold mb-2 text-black">Upcoming bookings</h2>
        {!upcoming.length && (
          <div className="text-black/70">No upcoming bookings.</div>
        )}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {upcoming.map((b) => (
            <article
              key={b.id}
              className="border border-black/10 rounded-2xl p-3 bg-white"
            >
              <div className="text-sm text-black/70">
                {new Date(b.dateFrom).toISOString().slice(0, 10)} →{" "}
                {new Date(b.dateTo).toISOString().slice(0, 10)}
              </div>
              {b.venue && (
                <div className="mt-1">
                  <div className="font-semibold text-black">{b.venue.name}</div>
                  <img
                    src={
                      b.venue.media?.[0]?.url ||
                      "https://placehold.co/600x400?text=Venue"
                    }
                    alt={b.venue.media?.[0]?.alt || b.venue.name}
                    className="w-full rounded-xl mt-2 aspect-video object-cover border border-black/10"
                  />
                </div>
              )}
              <div className="mt-2 text-sm text-black">Guests: {b.guests}</div>
            </article>
          ))}
        </div>
      </section>

      {/* My venues (visible if manager) */}
      {profile.venueManager && (
        <section className="rounded-2xl bg-white border border-black/10 p-4">
          <div className="mb-3">
            <h2 className="font-semibold text-black">My venues</h2>
          </div>

          {!profile.venues?.length && (
            <div className="text-black/70">You have no venues yet.</div>
          )}
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {profile.venues?.map((v) => (
              <article
                key={v.id}
                className="border border-black/10 rounded-2xl p-3 bg-white"
              >
                <img
                  src={
                    v.media?.[0]?.url ||
                    "https://placehold.co/600x400?text=Venue"
                  }
                  alt={v.media?.[0]?.alt || v.name}
                  className="w-full rounded-xl mb-2 aspect-video object-cover border border-black/10"
                />
                <div className="font-semibold text-black">{v.name}</div>
                <div className="text-sm text-black/70">
                  Guests: {v.maxGuests} • Price: {v.price}
                </div>
                {/* TODO: Edit/Delete buttons here */}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Avatar Modal */}
      <Modal
        open={avatarOpen}
        onClose={() => setAvatarOpen(false)}
        title="Update avatar"
        actions={
          <>
            <button
              className="px-3 py-2 rounded border border-black/20 text-black"
              onClick={() => setAvatarOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="px-3 py-2 rounded bg-yellow-400 text-black font-semibold disabled:opacity-60"
              onClick={onAvatarSave}
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        <label className="block text-black">
          <span className="text-sm">Image URL</span>
          <input
            className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            placeholder="https://…"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
        </label>
      </Modal>

      {/* Confirm Disable Manager Modal */}
      <Modal
        open={confirmOffOpen}
        onClose={() => setConfirmOffOpen(false)}
        title="Disable manager role?"
        actions={
          <>
            <button
              className="px-3 py-2 rounded border border-black/20 text-black"
              onClick={() => setConfirmOffOpen(false)}
            >
              Cancel
            </button>
            <button
              disabled={busy}
              className="px-3 py-2 rounded bg-black text-white font-semibold disabled:opacity-60"
              onClick={disableManager}
            >
              {busy ? "Updating…" : "Disable"}
            </button>
          </>
        }
      >
        <p className="text-black">
          You’ll lose access to manager features (create/edit/delete venues).
          Your existing venues and bookings won’t be deleted. You can re-enable
          the manager role anytime.
        </p>
      </Modal>
    </div>
  );
}
