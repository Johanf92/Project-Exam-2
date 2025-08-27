export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl border border-black/10">
        <div className="px-5 py-4 border-b border-black/10">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
        </div>
        <div className="px-5 py-4">{children}</div>
        <div className="px-5 py-3 border-t border-black/10 flex justify-end gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}
