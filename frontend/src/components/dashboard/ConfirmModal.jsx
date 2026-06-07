export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60">
      <div className="relative w-full max-w-md mx-4 bg-bg border-4 border-ink p-8">
        <div className="font-mono text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Confirm Action
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
        <p className="font-body text-sm text-neutral-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 font-sans text-xs uppercase tracking-widest font-semibold border border-ink bg-bg text-ink hover:bg-neutral-100 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 font-sans text-xs uppercase tracking-widest font-semibold bg-accent text-bg hover:bg-white hover:text-accent hover:border hover:border-accent transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
