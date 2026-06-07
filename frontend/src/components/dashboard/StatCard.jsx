export default function StatCard({ value, label }) {
  return (
    <div className="border-2 border-ink p-5 text-center bg-bg">
      <div className="font-mono text-2xl md:text-3xl font-bold text-ink mb-1">
        {value}
      </div>
      <div className="font-sans text-[10px] uppercase tracking-widest text-neutral-500">
        {label}
      </div>
    </div>
  );
}
