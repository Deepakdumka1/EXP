"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Camera, ArrowRight, Loader2, Check } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { ApiError } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase", met: /[A-Z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
  ];

  const allChecksMet = passwordChecks.every((c) => c.met);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecksMet) return;
    setError("");
    setIsLoading(true);

    try {
      await register(email, password, name);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("An account with this email already exists. Try signing in instead.");
        } else if (err.status === 422) {
          setError("Please enter a valid email address.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } else {
        setError("Unable to connect to the server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--color-royal-purple)] via-[var(--color-electric-blue)] to-[var(--color-teal)]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-32 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-16 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">LensVault</span>
          </div>

          <div className="space-y-8 max-w-md">
            <h1 className="text-4xl font-bold leading-tight">
              Start your<br />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                photo journey.
              </span>
            </h1>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { title: "Self-Hosted Storage", desc: "Your data lives on your own server" },
                { title: "AI Face Recognition", desc: "Auto-group photos by the people in them" },
                { title: "Interactive Map", desc: "Browse memories by where they happened" },
                { title: "Complete Privacy", desc: "No cloud, no third parties — just you" },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{feature.title}</p>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-sm">
            Upload from anywhere, access anytime
          </p>
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[var(--bg-primary)]">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 bg-[var(--color-electric-blue)] rounded-xl flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">LensVault</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">Create your account</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Your photos, your server, fully private</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-[fadeIn_0.2s_ease-out]">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)] focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)] focus:border-transparent transition-all duration-200 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1 animate-[fadeIn_0.2s_ease-out]">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${check.met ? "bg-green-500" : "bg-[var(--bg-tertiary)]"}`}>
                        {check.met && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={check.met ? "text-green-500" : "text-[var(--text-tertiary)]"}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !allChecksMet}
              className="w-full py-3 px-4 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/90 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[var(--color-electric-blue)]/25"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-[var(--text-tertiary)] text-center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-electric-blue)] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
