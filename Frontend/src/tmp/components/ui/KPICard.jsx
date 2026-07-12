export default function KPICard({ title, value, borderTopColor = 'border-transparent' }) {
  return (
    <div className={`bg-panel p-4 rounded-md border border-border border-t-4 ${borderTopColor} shadow-sm flex flex-col justify-between`}>
      <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
        {title}
      </h3>
      <p className="text-white text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}