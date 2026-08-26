import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart3, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role:"user",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    setError("");

    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }
    );

    console.log(response.data);
    navigate("/dashboard");

  } catch (error) {
    console.error(error);

    if (error.response) {
      // Backend returned an error
      setError(error.response.data.message);

    } else if (error.request) {
      // Request sent but no response received
      setError("Server is not responding. Try again later.");

    } else {
      // Something else happened
      setError("Something went wrong. Please try again.");
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
            Create your workspace account
          </h1>
          <p className="text-gray-600 mt-4 text-base leading-relaxed">
            Manage your business from one place — products, customers,
            categories and sales, all in a single workspace.
          </p>
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

          <h2 className="text-2xl font-semibold text-gray-900">
            Create account
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 mb-8">
            Get started with your free workspace.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                Full name
              </span>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </label>

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
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </label>
            <label className="block mb-4">
  <span className="block text-sm font-medium text-gray-700 mb-1.5">
    Role
  </span>

  <select
    value={form.role}
    onChange={(e) =>
      setForm({
        ...form,
        role: e.target.value,
      })
    }
    className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    <option value="manager">Manager</option>
    <option value="employee">Employee</option>
  </select>
</label>

            <label className="block mb-4">
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

            <label className="block mb-2">
              <span className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </span>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </label>

            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm mt-4"
            >
              Create account
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-700"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
