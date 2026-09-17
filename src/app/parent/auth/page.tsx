"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Envelope,
  Lock,
  Eye,
  EyeSlash,
  Warning,
  CheckCircle,
  User,
  Phone,
  IdentificationCard,
} from "@phosphor-icons/react";

type AuthMode = "login" | "signup" | "forgot";

export default function ParentAuthPage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const generateRegNumber = useCallback(() => {
    const prefix = "DK";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }, []);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setGoogleLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/parent/dashboard`,
        },
      });
      if (error) {
        if (error.message.includes("provider is not enabled")) {
          setError("Google sign-in is not configured yet. Please use email sign-in, or ask the admin to enable Google OAuth in Supabase dashboard.");
        } else {
          throw error;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: existingProfile } = await supabase
            .from("child_profiles")
            .select("id")
            .eq("parent_id", user.id)
            .limit(1)
            .maybeSingle();

          if (!existingProfile) {
            await supabase.from("child_profiles").insert({
              parent_id: user.id,
              display_name: "My Child",
            });
          }
        }

        router.push("/parent/dashboard");
      } else if (mode === "signup") {
        const regNum = generateRegNumber();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              registration_number: regNum,
            },
            emailRedirectTo: `${window.location.origin}/parent/dashboard`,
          },
        });
        if (error) throw error;

        setRegistrationNumber(regNum);
        setSuccess(`Account created! Your Registration Number: ${regNum}. Check your email for confirmation.`);
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/parent/auth`,
        });
        if (error) throw error;
        setSuccess("Password reset link sent to your email.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" weight="bold" />
          Back to Draw Kao
        </Link>

        {/* Logo */}
        <div className="text-center mb-6">
          <Image src="/images/DrawKao_Logo.png" alt="Draw Kao" width={160} height={50} className="h-14 w-auto mx-auto" />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h1>
          <p className="text-gray-500 text-sm">
            {mode === "login" && "Sign in to view your child's progress"}
            {mode === "signup" && "Create an account to save your child's progress"}
            {mode === "forgot" && "Enter your email to reset password"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
              <Warning className="h-4 w-4 shrink-0" weight="fill" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" weight="fill" />
                {success}
              </div>
              {registrationNumber && (
                <div className="bg-white border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Your Registration Number</p>
                  <p className="text-lg font-extrabold text-green-700 font-mono tracking-wider">{registrationNumber}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Save this number for your records</p>
                </div>
              )}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all disabled:opacity-50 mb-4"
          >
            {googleLoading ? (
              <div className="h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
            {/* Full Name (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Johnson"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Phone (signup only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            {mode !== "forgot" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password */}
            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                  className="text-xs text-green-600 hover:text-green-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !supabase}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                <>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                </>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 text-center">
            {mode === "login" && (
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); setSuccess(""); }} className="text-green-600 font-semibold hover:text-green-700">
                  Sign Up
                </button>
              </p>
            )}
            {mode === "signup" && (
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-green-600 font-semibold hover:text-green-700">
                  Sign In
                </button>
              </p>
            )}
            {mode === "forgot" && (
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <button onClick={() => { setMode("login"); setError(""); setSuccess(""); }} className="text-green-600 font-semibold hover:text-green-700">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 bg-gray-100 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your account saves your child&apos;s progress to the cloud. Your child never needs to log in.
          </p>
        </div>
      </div>
    </div>
  );
}
