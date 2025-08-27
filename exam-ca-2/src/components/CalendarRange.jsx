import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

/**
 * CalendarRange
 * - selected: { from?: Date, to?: Date }
 * - onSelect: (range) => void
 * - bookings: [{ dateFrom, dateTo }]
 */
export default function CalendarRange({ selected, onSelect, bookings = [] }) {
  // Build disabled intervals from bookings (inclusive start, exclusive end)
  const disabled = useMemo(() => {
    const ranges = bookings.map(b => {
      const from = new Date(b.dateFrom);
      const to = new Date(b.dateTo);
      // react-day-picker treats 'to' as inclusive for disabled ranges; subtract a day
      const adjTo = new Date(to);
      adjTo.setDate(adjTo.getDate() - 1);
      return { from, to: adjTo };
    });
    // also disable past days
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return [{ to: yesterday }, ...ranges];
  }, [bookings]);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3">
      <DayPicker
        mode="range"
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        captionLayout="buttons"
        numberOfMonths={1}
        fromMonth={new Date()}
        styles={{
          caption: { color: "black" },
          head_cell: { color: "black" },
          day: { color: "black" },
          day_selected: { backgroundColor: "#FACC15", color: "black" }, // tailwind yellow-400
          day_disabled: { color: "#9CA3AF", textDecoration: "line-through" }, // gray-400
        }}
      />
    </div>
  );
}
