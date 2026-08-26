export default function FormField({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </span>
      <input
        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:bg-gray-50 disabled:text-gray-500"
        {...props}
      />
    </label>
  );
}
