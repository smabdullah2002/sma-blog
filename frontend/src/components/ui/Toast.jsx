import { useState, useEffect } from "react";

export default function Toast({ message, onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 bg-ink text-bg px-5 py-3 font-sans text-xs uppercase tracking-widest font-semibold shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-neutral-400 hover:text-bg transition-colors duration-200 cursor-pointer"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
