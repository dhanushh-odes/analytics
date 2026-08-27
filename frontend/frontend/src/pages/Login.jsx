import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart3,
  Check,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import axios from "axios";

const FEATURES = [
  "Track sales",
  "Manage products",
  "Customer management",
  "Category management",
  "Reports",
];

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ identifier: "", password: "", remember: false });

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setError("");
    console.log(form.identifier, form.password);

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        identifier: form.identifier,
        password: form.password,
      }
    );
    localStorage.setItem("token", response.data.token);

    console.log(response.data);
    navigate("/dashboard");

  } catch (error) {
    console.error(error);

    if (error.response) {
      // Backend responded with error (400, 401, 500)
      setError(error.response.data.message);

    } else if (error.request) {
      // Request sent but no response
      setError("Server is not responding");

    } else {
      // Other errors
      setError("Something went wrong");
    }
  }
};
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-50/60 border-r border-gray-200 flex-col justify-center px-16">
        <div className="max-w-md">
          <div className="w-11 h-11 rounded-lg bg-indigo-600 flex items-center justify-center mb-8">
            <BarChart3 size={22} className="text-white" strokeWidth={2.25} />
          </div>

          <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
            Sales Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-4 text-base leading-relaxed">
            Manage products, customers, categories and sales from one
            workspace.
          </p>

          <ul className="mt-8 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-indigo-600" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BarChart3 size={18} className="text-white" strokeWidth={2.25} />
            </div>
            <span className="text-base font-semibold text-gray-900">
              Sales Workspace
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">Log in</h2>
          <p className="text-sm text-gray-500 mt-1.5 mb-8">
            Welcome back. Enter your details to continue.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </span>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  placeholder="Username or email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </label>

            <label className="block mb-2">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </span>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between mt-3 mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) =>
                    setForm({ ...form, remember: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>
            {error && (
  <p className="text-sm text-red-600 mt-2">
    {error}
  </p>
)}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Log in
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
