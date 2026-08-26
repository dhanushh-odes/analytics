import { useState } from "react";
import { User, Shield, SlidersHorizontal } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import FormField from "../../components/ui/FormField";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-indigo-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@example.com",
    role: "Administrator",
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklySummary: false,
    productUpdates: true,
  });

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, security, and preferences"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon size={16} strokeWidth={2} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Profile
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Update your personal details
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
                  {profile.name.charAt(0)}
                </div>
                <Button variant="secondary" size="sm">
                  Change Photo
                </Button>
              </div>

              <div className="max-w-md">
                <FormField
                  label="Full name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
                <FormField
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
                <FormField label="Role" value={profile.role} disabled />
              </div>

              <Button className="mt-2">Save Changes</Button>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Security
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Update your password to keep your account secure
              </p>

              <div className="max-w-md">
                <FormField
                  label="Current password"
                  type="password"
                  placeholder="••••••••"
                />
                <FormField
                  label="New password"
                  type="password"
                  placeholder="••••••••"
                />
                <FormField
                  label="Confirm new password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>

              <Button className="mt-2">Update Password</Button>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-1">
                Preferences
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                Choose how you want to be notified
              </p>

              <div className="max-w-md divide-y divide-gray-100">
                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Email notifications
                    </p>
                    <p className="text-sm text-gray-500">
                      Get notified about new sales and orders
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.emailNotifications}
                    onChange={(v) =>
                      setPreferences({ ...preferences, emailNotifications: v })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Weekly summary
                    </p>
                    <p className="text-sm text-gray-500">
                      Receive a weekly recap of workspace activity
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.weeklySummary}
                    onChange={(v) =>
                      setPreferences({ ...preferences, weeklySummary: v })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Product updates
                    </p>
                    <p className="text-sm text-gray-500">
                      Occasional news about new features
                    </p>
                  </div>
                  <Toggle
                    checked={preferences.productUpdates}
                    onChange={(v) =>
                      setPreferences({ ...preferences, productUpdates: v })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
