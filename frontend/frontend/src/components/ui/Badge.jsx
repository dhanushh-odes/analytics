const STYLES = {
  success: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  neutral: "bg-gray-100 text-gray-600 ring-1 ring-inset ring-gray-200",
  info: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200",
};

export default function Badge({ tone = "neutral", children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[tone]}`}
    >
      {children}
    </span>
  );
}
