import { useId } from "react";

export default function MediaList({ items, onChange }) {
  const id = useId();

  function update(index, key, value) {
    const next = items.slice();
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  }

  function addRow() {
    onChange([...items, { url: "", alt: "" }]);
  }

  function removeRow(index) {
    const next = items.slice();
    next.splice(index, 1);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.map((m, i) => (
        <div
          key={`${id}-${i}`}
          className="grid sm:grid-cols-12 gap-3 items-start"
        >
          <div className="sm:col-span-7">
            <label className="block text-black">
              <span className="text-sm">Image URL</span>
              <input
                className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
                value={m.url}
                onChange={(e) => update(i, "url", e.target.value)}
                placeholder="https://images…"
              />
            </label>
          </div>
          <div className="sm:col-span-4">
            <label className="block text-black">
              <span className="text-sm">Alt text</span>
              <input
                className="mt-1 w-full border border-black/20 bg-white text-black px-3 py-2 rounded"
                value={m.alt}
                onChange={(e) => update(i, "alt", e.target.value)}
                placeholder="Lobby, bedroom, view…"
              />
            </label>
          </div>
          <div className="sm:col-span-1 flex gap-2">
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="mt-6 px-3 py-2 rounded border border-black/20 text-black"
              title="Remove image"
            >
              ✕
            </button>
          </div>

          {/* Preview */}
          {m.url ? (
            <div className="sm:col-span-12">
              <img
                src={m.url}
                alt={m.alt || "Preview"}
                className="w-full max-w-md rounded border border-black/10"
              />
            </div>
          ) : null}
        </div>
      ))}

      <div>
        <button
          type="button"
          onClick={addRow}
          className="px-3 py-2 rounded bg-black text-white text-sm"
        >
          + Add image
        </button>
      </div>
    </div>
  );
}
