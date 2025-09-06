// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getVenues } from "../lib/venues.js";

const PAGE_SIZE = 24;

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [busyMore, setBusyMore] = useState(false);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(1);
  const [raw, setRaw] = useState([]); // accumulated pages
  const [hasMore, setHasMore] = useState(true);

  // URL params (single source of truth)
  const q = params.get("q") || "";
  const maxPrice = Number(params.get("max") || "") || 0;
  const guests = Number(params.get("guests") || "") || 0;

  const wifi = params.get("wifi") === "1";
  const parking = params.get("parking") === "1";
  const breakfast = params.get("breakfast") === "1";
  const pets = params.get("pets") === "1";

  const sort = params.get("sort") || "created"; // created | price | rating

  // Fetch on first load and when q or sort change
  useEffect(() => {
    let cancel = false;

    (async () => {
      try {
        setErr("");
        setLoading(true);
        setHasMore(true);
        setPage(1);

        // Server-side search + sort to reduce payload;
        // we'll still filter/sort client-side for correctness.
        const res = await getVenues({
          page: 1,
          limit: PAGE_SIZE,
          q: q || undefined,
          sort,
          // server order is fixed; client-side sort will ensure final order
          sortOrder: sort === "price" ? "asc" : "desc",
        });

        if (cancel) return;
        const rows = res?.data || [];
        setRaw(rows);
        setHasMore(rows.length === PAGE_SIZE);
      } catch (e) {
        if (!cancel) setErr(e.message || "Failed to load venues");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [q, sort]);

  // Load more pages
  async function loadMore() {
    try {
      setBusyMore(true);
      const nextPage = page + 1;
      const res = await getVenues({
        page: nextPage,
        limit: PAGE_SIZE,
        q: q || undefined,
        sort,
        sortOrder: sort === "price" ? "asc" : "desc",
      });
      const rows = res?.data || [];
      setRaw((prev) => [...prev, ...rows]);
      setPage(nextPage);
      setHasMore(rows.length === PAGE_SIZE);
    } catch (e) {
      setErr(e.message || "Failed to load more");
    } finally {
      setBusyMore(false);
    }
  }

  // Client-side filters (including search fallback)
  const filtered = useMemo(() => {
    let list = raw.slice();

    // robust search (fallback to client-side match)
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((v) => {
        const name = (v.name || "").toLowerCase();
        const desc = (v.description || "").toLowerCase();
        const city = (v.location?.city || "").toLowerCase();
        const country = (v.location?.country || "").toLowerCase();
        return (
          name.includes(needle) ||
          desc.includes(needle) ||
          city.includes(needle) ||
          country.includes(needle)
        );
      });
    }

    // price / guests
    if (maxPrice) list = list.filter((v) => (v.price ?? 0) <= maxPrice);
    if (guests) list = list.filter((v) => (v.maxGuests ?? 0) >= guests);

    // amenities
    if (wifi) list = list.filter((v) => v.meta?.wifi);
    if (parking) list = list.filter((v) => v.meta?.parking);
    if (breakfast) list = list.filter((v) => v.meta?.breakfast);
    if (pets) list = list.filter((v) => v.meta?.pets);

    // final client-side sort for deterministic order
    const byCreatedDesc = (a, b) => new Date(b.created) - new Date(a.created);
    const byPriceAsc = (a, b) => (a.price ?? 0) - (b.price ?? 0);
    const byRatingDesc = (a, b) => (b.rating ?? 0) - (a.rating ?? 0);

    if (sort === "price") list.sort(byPriceAsc);
    else if (sort === "rating") list.sort(byRatingDesc);
    else list.sort(byCreatedDesc);

    return list;
  }, [raw, q, maxPrice, guests, wifi, parking, breakfast, pets, sort]);

  // Helpers to mutate URL params
  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (value === "" || value === 0 || value === null || value === false) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setParams(next, { replace: true });
  }

  function clearFilters() {
    const keep = new URLSearchParams();
    // keep q & sort; wipe others
    if (q) keep.set("q", q);
    if (sort) keep.set("sort", sort);
    setParams(keep, { replace: true });
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Filter + Sort bar */}
      <section className="rounded-2xl bg-white border border-black/10 p-4">
        <form className="grid gap-3 md:grid-cols-12 items-end">
          {/* Search */}
          <label className="block md:col-span-5 text-black">
            <span className="text-sm">Search</span>
            <input
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              placeholder="Search by name, city, country…"
              value={q}
              onChange={(e) => updateParam("q", e.target.value)}
            />
          </label>

          {/* Max price */}
          <label className="block md:col-span-2 text-black">
            <span className="text-sm">Max price</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={maxPrice || ""}
              onChange={(e) => updateParam("max", Number(e.target.value || 0))}
            />
          </label>

          {/* Guests */}
          <label className="block md:col-span-2 text-black">
            <span className="text-sm">Guests</span>
            <input
              type="number"
              min={0}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
              value={guests || ""}
              onChange={(e) =>
                updateParam("guests", Number(e.target.value || 0))
              }
            />
          </label>

          {/* Sort (fixed order based on option) */}
          <label className="block md:col-span-3 text-black">
            <span className="text-sm">Sort</span>
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
            >
              <option value="created">Newest</option>
              <option value="price">Price (low → high)</option>
              <option value="rating">Rating (high → low)</option>
            </select>
          </label>

          {/* Amenities */}
          <fieldset className="md:col-span-12 grid grid-cols-2 sm:grid-cols-5 gap-2 text-black pt-2">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) =>
                  updateParam("wifi", e.target.checked ? "1" : "")
                }
              />
              <span>Wi-Fi</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) =>
                  updateParam("parking", e.target.checked ? "1" : "")
                }
              />
              <span>Parking</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) =>
                  updateParam("breakfast", e.target.checked ? "1" : "")
                }
              />
              <span>Breakfast</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) =>
                  updateParam("pets", e.target.checked ? "1" : "")
                }
              />
              <span>Pets</span>
            </label>

            <div className="flex justify-end md:col-span-1">
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 rounded border border-black/20 text-black"
                title="Clear filters (keeps search & sort)"
              >
                Clear
              </button>
            </div>
          </fieldset>
        </form>
      </section>

      {/* Results */}
      <section className="space-y-3">
        {loading && <div className="text-black">Loading venues…</div>}
        {err && <div className="text-red-600">{err}</div>}

        {!loading && !err && filtered.length === 0 && (
          <div className="rounded-2xl bg-white border border-black/10 p-6 text-black">
            No venues matched your filters.
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VenueCard key={v.id} v={v} />
          ))}
        </div>

        {/* Load more */}
        {!loading && hasMore && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={busyMore}
              className="px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold shadow-sm
               hover:bg-yellow-300 hover:shadow-md
               transition-all duration-200
               disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {busyMore ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function VenueCard({ v }) {
  const hero = v.media?.[0]?.url || "https://placehold.co/600x400?text=Venue";
  return (
    <Link
      to={`/venue/${v.id}`}
      className="rounded-2xl overflow-hidden border border-black/10 bg-white hover:shadow transition block"
    >
      <img
        src={hero}
        alt={v.media?.[0]?.alt || v.name}
        className="w-full aspect-video object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-black line-clamp-1">{v.name}</h3>
          {typeof v.rating === "number" && (
            <span className="text-xs px-2 py-1 rounded bg-black text-white">
              {v.rating.toFixed(1)}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm text-black/70">
          Guests: {v.maxGuests} • Price: {v.price}
        </div>
        <div className="mt-2 flex flex-wrap gap-1 text-xs text-black/80">
          {v.meta?.wifi && (
            <span className="px-2 py-0.5 rounded bg-black/5 border border-black/10">
              Wi-Fi
            </span>
          )}
          {v.meta?.parking && (
            <span className="px-2 py-0.5 rounded bg-black/5 border border-black/10">
              Parking
            </span>
          )}
          {v.meta?.breakfast && (
            <span className="px-2 py-0.5 rounded bg-black/5 border border-black/10">
              Breakfast
            </span>
          )}
          {v.meta?.pets && (
            <span className="px-2 py-0.5 rounded bg-black/5 border border-black/10">
              Pets
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
