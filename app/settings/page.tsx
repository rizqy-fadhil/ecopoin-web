"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Cog,
  Pencil,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/auth-helpers-nextjs";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function AccountSettingsPage() {
  const router = useRouter();

  // State for profile form
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    location: "",
  });

  const [profileId, setProfileId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Profile loading/processing state
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password Section
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [changingPw, setChangingPw] = useState(false);

  // Toast message state
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Fetch profile & email on mount
  useEffect(() => {
    let ignore = false;
    async function fetchProfileAndAuth() {
      setLoadingProfile(true);
      // 1. Get user from supabase.auth
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setLoadingProfile(false);
        setToast({
          type: "error",
          message: "Cannot get user. Please login again."
        });
        return;
      }
      setUserId(user.id);

      // 2. Fetch profile by user.id from "profiles"
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id,full_name,phone_number,location")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        setFormData({
          full_name: profile?.full_name || "",
          phone_number: profile?.phone_number || "",
          location: profile?.location || "",
          email: user.email || "",
        });
        setProfileId(profile?.id ?? null);
        setLoadingProfile(false);
      }
    }
    fetchProfileAndAuth();
    return () => {
      ignore = true;
    };
  }, []);

  // Toast auto-hide after 2.5s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Handle form change
  function handleChangeForm(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((fv) => ({
      ...fv,
      [name]: value,
    }));
  }

  // Profile INFO update
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    try {
      // Update profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          location: formData.location,
        })
        .eq("id", userId);

      if (error) throw error;
      setToast({ type: "success", message: "Profile updated!" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: "Failed to update profile: " + (err?.message || err),
      });
    } finally {
      setSaving(false);
    }
  }

  // --- Password logic
  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswords((pw) => ({ ...pw, [name]: value }));
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChangingPw(true);
    if (passwords.new_password.length < 6) {
      setToast({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      setChangingPw(false);
      return;
    }
    if (passwords.new_password !== passwords.confirm_password) {
      setToast({
        type: "error",
        message: "Passwords do not match.",
      });
      setChangingPw(false);
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new_password,
      });
      if (error) throw error;
      setToast({
        type: "success",
        message: "Password updated successfully.",
      });
      setPasswords({ new_password: "", confirm_password: "" });
    } catch (err: any) {
      setToast({
        type: "error",
        message: "Failed to update password: " + (err?.message || err),
      });
    } finally {
      setChangingPw(false);
    }
  }

  // --- Logout logic
  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      router.push("/login");
    } catch (err: any) {
      setToast({
        type: "error",
        message: "Failed to log out. Please try again.",
      });
    }
  }

  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-3 left-1/2 -translate-x-1/2 z-40 rounded-lg px-6 py-3 shadow-lg text-base transition
          ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-500 text-white"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="mb-10 flex items-center gap-4">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
          <Cog className="w-7 h-7 text-green-600" />
        </span>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Account Settings
          </h1>
          <p className="text-green-700 mt-2 max-w-2xl">
            Manage your profile details, security preferences, and notifications.
          </p>
        </div>
      </div>

      {/* Profile Information Card */}
      <form
        className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        onSubmit={handleUpdateProfile}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
              <User className="w-6 h-6 text-green-600" />
            </span>
            <span className="font-bold text-gray-900 text-lg">Profile Information</span>
          </div>
          <button
            type="submit"
            disabled={saving || loadingProfile}
            className={`text-green-700 font-semibold hover:underline focus:outline-none px-4 transition
              ${saving || loadingProfile ? "opacity-60 pointer-events-none" : ""}`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                name="full_name"
                type="text"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-400 text-gray-900 font-medium placeholder-gray-400 transition"
                value={formData.full_name}
                onChange={handleChangeForm}
                placeholder="Full Name"
                autoComplete="off"
                disabled={loadingProfile}
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
          {/* Email */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 text-gray-900 font-medium placeholder-gray-400 transition focus:ring-green-200 focus:border-green-300 cursor-not-allowed bg-gray-100"
                value={formData.email}
                placeholder="Email Address"
                autoComplete="off"
                disabled
                readOnly
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              {/* Email note: cannot edit here */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                Read Only
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-1 select-none">
              Email can only be changed through account settings & email verification.
            </div>
          </div>
          {/* Phone Number */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                name="phone_number"
                type="tel"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-400 text-gray-900 font-medium placeholder-gray-400 transition"
                value={formData.phone_number}
                onChange={handleChangeForm}
                placeholder="Phone Number"
                autoComplete="off"
                disabled={loadingProfile}
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
          {/* Location */}
          <div>
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Location
            </label>
            <div className="relative">
              <input
                name="location"
                type="text"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-400 text-gray-900 font-medium placeholder-gray-400 transition"
                value={formData.location}
                onChange={handleChangeForm}
                placeholder="Location"
                autoComplete="off"
                disabled={loadingProfile}
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </form>

      {/* Security Card */}
      <form
        className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        onSubmit={handleChangePassword}
        autoComplete="off"
      >
        {/* Card Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50">
            <Lock className="w-6 h-6 text-green-600" />
          </span>
          <span className="font-bold text-gray-900 text-lg">Security</span>
        </div>
        <div className="font-semibold text-gray-900 mb-2">Change Password</div>
        <div className="text-green-700 text-sm mb-5">
          Update your password regularly to keep your account secure.
        </div>
        {/* New & Confirm Password */}
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
          {/* New Password */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="new_password"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-400 text-gray-900 font-medium placeholder-gray-400 transition"
                placeholder="********"
                autoComplete="new-password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                minLength={6}
                required
                disabled={changingPw || loadingProfile}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
          {/* Confirm Password */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="confirm_password"
                className="w-full px-4 pl-10 py-3 pr-10 rounded-xl bg-gray-50/50 border border-gray-200 focus:ring-green-200 focus:border-green-400 text-gray-900 font-medium placeholder-gray-400 transition"
                placeholder="********"
                autoComplete="new-password"
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
                minLength={6}
                required
                disabled={changingPw || loadingProfile}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="mt-7 flex justify-end">
          <button
            type="submit"
            className={`bg-gray-100 hover:bg-green-100 text-green-700 font-semibold px-7 py-2 rounded-full border border-green-200 transition
              ${changingPw || loadingProfile ? "opacity-60 pointer-events-none" : ""}`}
            disabled={changingPw || loadingProfile}
          >
            {changingPw ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      {/* Danger Zone / Logout Card */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 flex justify-end mt-9">
        <button
          type="button"
          onClick={handleLogout}
          className="border border-red-300 text-red-600 hover:bg-red-50 px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
        >
          <LogOut className="w-5 h-5 mr-1" />
          Logout Account
        </button>
      </div>
    </main>
  );
}