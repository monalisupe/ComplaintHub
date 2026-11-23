import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Check,
  X,
} from "lucide-react";
import api from "../services/api";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password criteria computation
  const criteria = {
    hasLength: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const strengthScore = Object.values(criteria).filter(Boolean).length;

  const getStrengthTier = () => {
    if (password.length === 0) return { label: "None", color: "bg-slate-200", text: "text-slate-400", percent: 0 };
    if (strengthScore <= 2) return { label: "Weak", color: "bg-rose-500", text: "text-rose-600", percent: 25 };
    if (strengthScore === 3) return { label: "Fair", color: "bg-amber-500", text: "text-amber-600", percent: 50 };
    if (strengthScore === 4) return { label: "Good", color: "bg-blue-600", text: "text-blue-600", percent: 75 };
    return { label: "Strong & Secure", color: "bg-emerald-600", text: "text-emerald-600", percent: 100 };
  };

  const strength = getStrengthTier();
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  // Autofill random test citizen
  const fillSampleData = () => {
    const randomId = Math.floor(Math.random() * 900 + 100);
    setName(`Citizen User ${randomId}`);
    setEmail(`citizen${randomId}@example.com`);
    setPassword("SecurePass@123");
    setConfirmPassword("SecurePass@123");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    if (strengthScore < 2) {
      setError("Please choose a stronger password (at least 8 characters).");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the Citizen Terms & Privacy Guidelines to proceed.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      setSuccess("Account registered successfully! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message ||
          "Registration failed. Server may be offline or user already registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-md">
        
        {/* Main Clean White Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 p-7 sm:p-8 transition-all">
          
          {/* Header Brand Section */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-3 hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Join ComplaintHub to track civic resolutions
            </p>
          </div>

          {/* Dual Navigation Switcher Tabs */}
          <div className="flex p-1 mb-4 rounded-xl bg-slate-100 border border-slate-200">
            <Link
              to="/login"
              className="flex-1 py-2 text-sm font-medium text-center text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-lg transition-all"
            >
              Sign In
            </Link>
            <button
              type="button"
              className="flex-1 py-2 text-sm font-semibold rounded-lg bg-white text-blue-600 shadow-sm transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Quick Sample Data Fill Option */}
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-xs text-slate-500">Quick Testing:</span>
            <button
              type="button"
              onClick={fillSampleData}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 transition-colors hover:underline cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-fill Sample User
            </button>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Sharma"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="pt-1.5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Strength:</span>
                    <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${strength.color}`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                  {/* Password Checklist Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        criteria.hasLength
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {criteria.hasLength ? <Check className="w-3 h-3 text-emerald-600" /> : "•"} 8+ chars
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        criteria.hasUpper
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {criteria.hasUpper ? <Check className="w-3 h-3 text-emerald-600" /> : "•"} Uppercase
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        criteria.hasNumber
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {criteria.hasNumber ? <Check className="w-3 h-3 text-emerald-600" /> : "•"} Number
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                        criteria.hasSpecial
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-400 border-slate-200"
                      }`}
                    >
                      {criteria.hasSpecial ? <Check className="w-3 h-3 text-emerald-600" /> : "•"} Symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-sm placeholder-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition-all outline-none ${
                    passwordsMismatch ? "border-rose-400 focus:border-rose-600 focus:ring-rose-100" : "border-slate-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Match Feedback */}
              {passwordsMatch && (
                <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold pt-0.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
              {passwordsMismatch && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold pt-0.5">
                  <X className="w-3.5 h-3.5" /> Passwords do not match
                </p>
              )}
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I agree to the{" "}
                  <span className="text-blue-600 hover:underline">Civic Grievance Terms of Service</span>{" "}
                  and{" "}
                  <span className="text-blue-600 hover:underline">Citizen Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-sm sm:text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Sign In instead
              </Link>
            </p>
          </form>

          {/* Security Badge */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-slate-400" /> End-to-End Encrypted
            </span>
            <span className="text-slate-500">Official Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
}
