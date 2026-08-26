import { ArrowRight } from "lucide-react";

export default function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
            <Icon size={16} className="text-indigo-600" strokeWidth={2} />
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-3">{value}</h2>

      <p className="text-sm text-gray-500 mt-1">{description}</p>

      <button
        onClick={onClick}
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        See More
        <ArrowRight size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}
