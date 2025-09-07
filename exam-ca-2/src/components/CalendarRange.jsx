import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

/**
 * @file CalendarRange component for selecting a date range.
 * Integrates with `react-day-picker` and disables booked ranges and past dates.
 */

/**
 * CalendarRange component.
 *
 * @component
 * @param {Object} props
 * @param {{from?: Date, to?: Date}} props.selected - Currently selected date range.
 * @param {(range: {from?: Date, to?: Date}) => void} props.onSelect - Callback when range changes.
 * @param {Array<{dateFrom: string|Date, dateTo: string|Date}>} [props.bookings=[]] - List of booked date ranges to disable.
 * @returns {JSX.Element} A styled date range picker.
 */

export default function CalendarRange({ selected, onSelect, bookings = [] }) {
  const disabled = useMemo(() => {
    const ranges = bookings.map((b) => {
      const from = new Date(b.dateFrom);
      const to = new Date(b.dateTo);
      const adjTo = new Date(to);
      adjTo.setDate(adjTo.getDate() - 1);
      return { from, to: adjTo };
    });
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
          day_selected: { backgroundColor: "#FACC15", color: "black" },
          day_disabled: { color: "#9CA3AF", textDecoration: "line-through" },
        }}
      />
    </div>
  );
}
