"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera, Shield, MapPin, Users, Sparkles, Upload, FolderHeart,
  Search, ArrowRight, ChevronDown, Star, Zap, Lock, Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: FolderHeart,
    title: "Smart Albums",
    description: "Auto-organized by date, location, people, and content type. Create custom albums or let AI do the work.",
    color: "var(--color-electric-blue)",
  },
  {
    icon: Users,
    title: "Face Recognition",
    description: "Automatically detect and group photos by the people in them. Name them once, find them forever.",
    color: "var(--color-royal-purple)",
  },
  {
    icon: MapPin,
    title: "Interactive Map",
    description: "Browse your entire library on a world map. See photo clusters and relive trips visually.",
    color: "var(--color-teal)",
  },
  {
    icon: Search,
    title: "Instant Search",
    description: "Find any photo by person, place, tag, or date. Lightning-fast with Cmd+K shortcut.",
    color: "var(--color-amber)",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your photos are stored safely. Access them anytime from any device, anywhere.",
    color: "var(--color-rose)",
  },
  {
    icon: Upload,
    title: "Drag & Drop Upload",
    description: "Upload photos and videos with real-time progress tracking. EXIF data extracted automatically.",
    color: "var(--color-indigo)",
  },
];

const STATS = [
  { value: "∞", label: "Your storage" },
  { value: "50+", label: "File formats" },
  { value: "< 100ms", label: "Search speed" },
  { value: "100%", label: "Privacy" },
];

const GALLERY_IMAGES = [10, 11, 14, 15, 17, 20, 22, 24, 27, 29, 31, 33];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("[data-animate]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-x-hidden">
      {/* ── Navigation ─────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] shadow-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--color-electric-blue)] to-[var(--color-royal-purple)] rounded-xl flex items-center justify-center">
              <Camera className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">LensVault</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#stats" className="hover:text-[var(--text-primary)] transition-colors">Stats</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-semibold text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/90 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-[var(--color-electric-blue)]/25">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[600px] h-[600px] bg-[var(--color-electric-blue)]/15 rounded-full blur-[120px]"
            style={{ top: "10%", left: "20%", transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute w-[500px] h-[500px] bg-[var(--color-royal-purple)]/10 rounded-full blur-[100px]"
            style={{ top: "40%", right: "10%", transform: `translateY(${scrollY * 0.15}px)` }}
          />
          <div
            className="absolute w-[400px] h-[400px] bg-[var(--color-teal)]/10 rounded-full blur-[80px]"
            style={{ bottom: "10%", left: "40%", transform: `translateY(${scrollY * -0.05}px)` }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-electric-blue)]/10 border border-[var(--color-electric-blue)]/20 rounded-full text-sm text-[var(--color-electric-blue)] animate-[fadeIn_0.6s_ease-out]">
            <Sparkles className="w-4 h-4" />
            Your photos & videos, accessible anywhere 24/7
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight animate-[slideUp_0.8s_ease-out]">
            Your photos deserve<br />
            <span className="bg-gradient-to-r from-[var(--color-electric-blue)] via-[var(--color-royal-purple)] to-[var(--color-teal)] bg-clip-text text-transparent">
              a better home
            </span>
          </h1>

          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-[slideUp_0.8s_ease-out_0.1s_both]">
            Upload, organize, and access your photos and videos from anywhere, 24/7.
            Smart albums, face recognition, and an interactive map — all in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[slideUp_0.8s_ease-out_0.2s_both]">
            <Link
              href="/register"
              className="px-8 py-3.5 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 shadow-xl shadow-[var(--color-electric-blue)]/30 text-lg"
            >
              Start for free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 border border-[var(--border-primary)] text-[var(--text-primary)] font-medium rounded-xl hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2"
            >
              See features
              <ChevronDown className="w-4 h-4" />
            </a>
          </div>

          {/* Hero image mockup */}
          <div className="relative mt-16 animate-[slideUp_1s_ease-out_0.3s_both]">
            <div className="relative rounded-2xl overflow-hidden border border-[var(--border-primary)] shadow-2xl bg-[var(--bg-secondary)]">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-tertiary)] border-b border-[var(--border-primary)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-[var(--bg-secondary)] rounded-lg text-xs text-[var(--text-tertiary)] flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    localhost:3000
                  </div>
                </div>
              </div>
              {/* Mock gallery grid */}
              <div className="p-4 grid grid-cols-4 sm:grid-cols-6 gap-2">
                {GALLERY_IMAGES.map((id, i) => (
                  <div key={id} className="aspect-square rounded-lg overflow-hidden relative" style={{ animationDelay: `${i * 0.05}s` }}>
                    <Image
                      src={`https://picsum.photos/id/${id}/300/300`}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Glow effect behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--color-electric-blue)]/20 via-[var(--color-royal-purple)]/20 to-[var(--color-teal)]/20 rounded-3xl blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────── */}
      <section id="stats" data-animate className="py-20 border-y border-[var(--border-primary)]">
        <div className={`max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${isVisible("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center space-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[var(--color-electric-blue)] to-[var(--color-royal-purple)] bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="features" data-animate className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center space-y-4 mb-16 transition-all duration-700 ${isVisible("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-royal-purple)]/10 border border-[var(--color-royal-purple)]/20 rounded-full text-xs text-[var(--color-royal-purple)] font-medium">
              <Zap className="w-3 h-3" />
              FEATURES
            </div>
            <h2 className="text-4xl font-bold">Everything you need</h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              Powerful tools to organize, search, and relive your photo memories — without compromising privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group p-6 rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-[var(--border-secondary)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${isVisible("features") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 100 + 200}ms` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────── */}
      <section data-animate id="cta" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-[var(--color-electric-blue)]/10 rounded-full blur-[120px] top-0 left-1/4" />
          <div className="absolute w-[400px] h-[400px] bg-[var(--color-royal-purple)]/10 rounded-full blur-[100px] bottom-0 right-1/4" />
        </div>

        <div className={`relative z-10 max-w-3xl mx-auto text-center space-y-8 transition-all duration-700 ${isVisible("cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            Ready to take control of<br />
            <span className="bg-gradient-to-r from-[var(--color-electric-blue)] to-[var(--color-teal)] bg-clip-text text-transparent">
              your photo library?
            </span>
          </h2>
          <p className="text-lg text-[var(--text-secondary)]">
            Start organizing your memories today. Upload from anywhere, access anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-10 py-4 bg-[var(--color-electric-blue)] hover:bg-[var(--color-electric-blue)]/90 text-white font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center gap-2 shadow-xl shadow-[var(--color-electric-blue)]/30 text-lg"
            >
              Get started free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Access anywhere</span>
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> Secure</span>
            <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> 24/7 available</span>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-[var(--border-primary)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-tertiary)]">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="font-medium text-[var(--text-secondary)]">LensVault</span>
          </div>
          <p>Upload and access your photos & videos from anywhere, 24/7.</p>
        </div>
      </footer>
    </div>
  );
}
