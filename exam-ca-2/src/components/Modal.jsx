/**
 * @file Modal component — a reusable dialog with backdrop, title, content, and actions.
 */

/**
 * Modal component.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {() => void} props.onClose - Callback when the backdrop is clicked.
 * @param {string} props.title - Title text displayed at the top of the modal.
 * @param {React.ReactNode} props.children - Modal body content.
 * @param {React.ReactNode} props.actions - Action buttons displayed in the footer.
 * @returns {JSX.Element|null} A modal dialog if `open` is true, otherwise `null`.
 */

export default function Modal({ open, onClose, title, children, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

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
