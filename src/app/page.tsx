"use client";

import { useState } from "react";

/* ── Icons ─────────────────────────────────────────────── */
const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
const PlayIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="white">
    <path d="M5 3l14 9-14 9V3z" />
  </svg>
);
const StarFilled = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
);
const LinkedInIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
);
const InstagramIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
);
const FacebookIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
);
const TwitterIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
);

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = ["Home", "About", "Services", "Success Stories", "Blog"];
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-bold text-[17px] text-gray-900 tracking-tight">BrandElevate</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
              className="text-[13px] font-medium text-gray-600 hover:text-[#7C3AED] transition-colors">
              {l}
            </a>
          ))}
        </div>

        <a href="#contact"
          className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0F] hover:bg-gray-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors">
          Book a Consultation
        </a>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 flex flex-col gap-1.5">
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`} onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-[#7C3AED]">{l}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 bg-[#0A0A0F] text-white text-sm font-semibold px-5 py-2.5 rounded-full w-fit mt-2">
            Book a Consultation
          </a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      {/* BG */}
      <div className="absolute inset-0 bg-[#0A0A10]" />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=85')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.38,
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85" />

      {/* Content */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center pt-32 pb-10">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-[64px] lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            You&apos;re More Than a Brand.<br />You&apos;re a Movement.
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-sm">
            Helping you turn connections into opportunities through authentic branding.
          </p>

          <div className="flex items-center gap-4">
            <a href="#contact"
              className="inline-flex items-center gap-2.5 border border-white/50 hover:border-white hover:bg-white/10 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all">
              Request a Call
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ArrowRight size={14} />
              </span>
            </a>
            <p className="text-gray-400 text-sm hidden sm:block">Helping you turn connections into<br/>opportunities through authentic branding.</p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative z-10 w-full bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { num: "200+", label: "Successful Members", icon: "👥" },
              { num: "6M+",  label: "Followers Generated", icon: "📈" },
              { num: "3k+",  label: "Satisfied Clients",   icon: "🎯" },
              { num: "500+", label: "Branding Projects",   icon: "🏆" },
            ].map((s, i) => (
              <div key={s.label} className={`py-7 px-6 flex items-center gap-3 ${i < 3 ? "border-r border-white/10" : ""}`}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-2xl md:text-3xl font-extrabold text-white leading-none">{s.num}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Partners Marquee ───────────────────────────────────── */
const PARTNERS = [
  "BCG", "DailyPay", "Tweewieler", "PFALZWERKE", "airbnb",
  "actionCOACH", "Allstate", "brave", "zepto", "binocs",
  "Credova", "FlySafair", "Jeven", "Allbridge", "Consodata",
];

function Partners() {
  const doubled = [...PARTNERS, ...PARTNERS];
  return (
    <section className="py-14 bg-white border-b border-gray-100 overflow-hidden">
      <p className="text-center text-[#7C3AED] font-bold text-base tracking-widest uppercase mb-10">
        Partners and Clients
      </p>
      <div className="overflow-hidden">
        <div className="marquee-inner">
          {doubled.map((p, i) => (
            <span key={i}
              className="mx-10 text-gray-400 hover:text-gray-700 font-semibold text-xs tracking-[0.2em] uppercase transition-colors cursor-default whitespace-nowrap">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── About ──────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left text */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block" />
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">About me</span>
            </div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              Meet Jasmeet Singh
            </h2>
            <h2 className="text-[40px] md:text-5xl font-extrabold leading-tight mb-6">
              Your Personal{" "}
              <span className="text-[#7C3AED]">Branding Coach</span>
            </h2>

            <p className="text-gray-600 text-[15px] leading-[1.8] mb-4 max-w-md">
              With over 10 years helping professionals stand out in competitive markets, I specialize in crafting authentic personal brands that align with your career goals, values, and personality.
            </p>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-10 max-w-md">
              Whether you&apos;re a corporate executive, creative, entrepreneur, or thought leader—I&apos;ll guide you to discover your unique voice and communicate it with confidence.
            </p>

            <div className="flex items-center gap-4 mb-6">
              <a href="#contact"
                className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
                Request a Call
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight size={13} />
                </span>
              </a>
            </div>

            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
              With over 10 years helping professionals stand out in competitive markets.
            </p>
          </div>

          {/* Right – photo collage */}
          <div className="relative h-[560px]">
            {/* Main big photo */}
            <div className="absolute left-0 top-0 w-[260px] h-[380px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600&q=80"
                alt="Jasmeet presenting"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Smaller photo bottom right */}
            <div className="absolute right-0 bottom-0 w-[220px] h-[300px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80"
                alt="Coaching session"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bestselling Author card */}
            <div className="absolute right-2 top-8 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full">🌐 World wide</span>
              </div>
              <p className="font-extrabold text-gray-900 text-sm mb-1">Bestselling Author</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                Techniques and principles different from what you might find in most leadership books
              </p>
            </div>

            {/* Dot indicator */}
            <div className="absolute right-0 top-[340px] flex flex-col gap-1.5">
              <div className="w-2 h-6 bg-[#7C3AED] rounded-full" />
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
            </div>

            {/* Experience chip */}
            <div className="absolute left-0 bottom-10 bg-[#7C3AED] rounded-2xl p-4 shadow-xl text-white">
              <p className="text-2xl font-extrabold leading-none">10+</p>
              <p className="text-[11px] text-purple-200 mt-0.5">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ───────────────────────────────────────────── */
const SERVICES = [
  {
    date: "15/08/2024",
    title: "Brand Discovery Session",
    desc: "Gain clarity on your strengths, values, and brand positioning.",
    img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
    dark: true,
  },
  {
    date: "19/12/2024",
    title: "Brand Coaching Program",
    desc: "A deep-dive program to shape your story, image, and online presence.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    dark: false,
  },
  {
    date: "30/12/2024",
    title: "LinkedIn & Social Profile Makeover",
    desc: "Optimize your digital footprint for visibility and impact.",
    img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80",
    dark: false,
  },
  {
    date: "27/04/2025",
    title: "Content Strategy & Visibility Coaching",
    desc: "Create content that builds authority and trust in your niche.",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    dark: false,
  },
];

function Services() {
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block" />
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Our Services</span>
            </div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight">
              Personal{" "}
              <span className="text-[#7C3AED]">Branding Services</span>
              <br />Tailored for You
            </h2>
          </div>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">
            A range of 1:1 and group coaching packages to help you{" "}
            <em className="not-italic font-semibold text-gray-800">elevate</em> your personal brand.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className={`rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1.5 cursor-pointer shadow-sm hover:shadow-xl ${
                s.dark ? "bg-[#1A0A3E]" : "bg-white border border-gray-200"
              }`}
            >
              {/* Photo */}
              <div className="h-44 overflow-hidden relative">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                {s.dark && <div className="absolute inset-0 bg-[#1A0A3E]/40" />}
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-[11px] font-mono mb-3 block ${s.dark ? "text-purple-300" : "text-gray-400"}`}>
                  {s.date}
                </span>
                <h3 className={`font-bold text-sm leading-snug mb-2 ${s.dark ? "text-white" : "text-gray-900"}`}>
                  {s.title}
                </h3>
                <p className={`text-xs leading-relaxed flex-1 ${s.dark ? "text-purple-200/80" : "text-gray-500"}`}>
                  {s.desc}
                </p>
                <div className="mt-5 flex justify-end">
                  <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    s.dark
                      ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                      : "bg-gray-100 hover:bg-[#7C3AED] hover:text-white text-gray-600"
                  }`}>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a href="#contact"
            className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors">
            Book a Call <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Coaching Process ───────────────────────────────────── */
const STEPS = [
  {
    title: "Understand your goals, values & uniqueness",
    body: "",
  },
  {
    title: "Craft your positioning and messaging",
    body: "",
  },
  {
    title: "Develop",
    body: "We help you create authentic content, optimize your social and professional profiles, and establish a powerful online presence that reflects your values, voice, and vision—consistently.",
  },
  {
    title: "Launch your authentic personal brand",
    body: "",
  },
];

function Process() {
  const [active, setActive] = useState(2);
  return (
    <section className="py-28 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 leading-tight">
                My Coaching Process,<br />Simplified
              </h2>
              <a href="#contact"
                className="hidden sm:inline-flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                Learn More <ArrowRight size={12} />
              </a>
            </div>

            <div className="flex flex-col gap-0">
              {STEPS.map((s, i) => (
                <div key={i}
                  onClick={() => setActive(i)}
                  className={`cursor-pointer border-b border-gray-200 transition-all ${i === 0 ? "border-t" : ""}`}>
                  <div className={`flex items-center justify-between py-4 px-1 ${active === i ? "" : "hover:opacity-75"}`}>
                    <h3 className={`font-semibold text-[15px] transition-colors ${
                      active === i ? "text-gray-900" : "text-gray-500"
                    }`}>
                      {s.title}
                    </h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${
                      active === i ? "bg-[#7C3AED] text-white rotate-90" : "bg-white text-gray-400"
                    }`}>
                      <ChevronRight />
                    </div>
                  </div>
                  {active === i && s.body && (
                    <div className="pb-5 px-1">
                      <p className="text-gray-600 text-sm leading-[1.75]">{s.body}</p>
                    </div>
                  )}
                  {active === i && !s.body && (
                    <div className="pb-3 px-1">
                      <div className="h-1 w-12 bg-[#7C3AED] rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right – photo */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
              alt="Coaching session"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Video / Activity ───────────────────────────────────── */
function VideoSection() {
  return (
    <section className="py-0 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-28">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer h-[420px] md:h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1400&q=80"
            alt="Watch activities"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Play button center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-18 h-18 w-[72px] h-[72px] bg-[#7C3AED]/90 hover:bg-[#7C3AED] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <PlayIcon />
            </div>
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 left-6 right-6">
            <p className="text-white font-bold text-xl md:text-2xl">Watch my all activities</p>
            <p className="text-gray-300 text-sm mt-1">Live sessions, keynotes, podcasts & workshops</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Blog ───────────────────────────────────────────────── */
const POSTS = [
  {
    date: "June 26, 2025",
    title: "Insights & Strategies for Building Your Personal Brand",
    excerpt: "Learn how to create content that reflects your brand and builds your audience.",
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
  },
  {
    date: "June 28, 2025",
    title: "Optimizing Your LinkedIn Profile in 2025",
    excerpt: "Your profile is your first impression — here's how to make it powerful, professional, and searchable.",
    img: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600&q=80",
  },
  {
    date: "July 3, 2025",
    title: "Why Content is the Currency of Personal Branding",
    excerpt: "Discover how valuable, authentic content can position you as an authority in your field.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  },
];

function Blog() {
  return (
    <section id="blog" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block" />
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Our Blog</span>
            </div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight max-w-lg">
              Insights &amp; Strategies for Building Your{" "}
              <span className="text-[#7C3AED]">Personal Brand</span>
            </h2>
          </div>
          <div className="max-w-xs flex flex-col justify-end">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
              Actionable tips, expert advice, and real-life lessons to help you grow your influence, authority, and visibility—one post at a time.
            </p>
            <a href="#"
              className="inline-flex items-center gap-2.5 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors w-fit">
              See All Articles <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {POSTS.map((p) => (
            <article key={p.title}
              className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer bg-white">
              <div className="h-52 overflow-hidden">
                <img src={p.img} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <p className="text-[11px] text-gray-400 font-medium mb-3">{p.date}</p>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">{p.excerpt}</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-[#7C3AED] text-sm font-semibold hover:gap-3 transition-all">
                  Read more <ArrowRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Before working with Jasmeet, I doubted what made me unique. Now my personal brand gives me confidence—more than before I enter the room.",
    name: "David B.",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
  {
    quote: "Thanks to your coaching, I finally have a LinkedIn profile and personal brand website that reflect who I am. I've already received two job offers within weeks!",
    name: "Nadia S.",
    role: "UX Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80",
  },
  {
    quote: "I used to feel invisible in my industry. Now I get invited to podcasts, panels, and conferences—just by showing up as my authentic self. Your process works.",
    name: "James T.",
    role: "Tech Consultant",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
];

function Testimonials() {
  const [active, setActive] = useState(1);
  return (
    <section id="success-stories" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-gray-400 block" />
            <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Testimonials</span>
            <span className="w-8 h-px bg-gray-400 block" />
          </div>
          <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 mb-4">
            What <span className="text-[#7C3AED]">My Clients</span> Are Saying
          </h2>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto leading-relaxed">
            Hear from professionals who&apos;ve transformed their careers and confidence through personal branding.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} onClick={() => setActive(i)}
              className={`rounded-2xl p-7 cursor-pointer transition-all border ${
                active === i
                  ? "bg-white border-gray-200 shadow-xl"
                  : "bg-white border-gray-100 shadow-sm hover:shadow-md"
              }`}>
              {/* Big quote mark */}
              <div className="text-[64px] leading-none text-gray-200 font-serif mb-2 -mt-3 -ml-1">&ldquo;</div>
              <p className="text-gray-700 text-sm leading-[1.75] mb-6 -mt-4">{t.quote}</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-100" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => <StarFilled key={si} />)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Nav dots */}
        <div className="flex items-center justify-center gap-2">
          <button className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            onClick={() => setActive(a => Math.max(0, a - 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
          </button>
          {TESTIMONIALS.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`rounded-full transition-all ${active === i ? "w-6 h-2.5 bg-[#7C3AED]" : "w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`} />
          ))}
          <button className="w-7 h-7 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center justify-center transition-colors text-white"
            onClick={() => setActive(a => Math.min(TESTIMONIALS.length - 1, a + 1))}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Contact Form ───────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-28 bg-[#0A0A10]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-5">
          <span className="w-8 h-px bg-gray-700 block" />
          <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Get In Touch</span>
          <span className="w-8 h-px bg-gray-700 block" />
        </div>
        <h2 className="text-[40px] md:text-5xl font-extrabold text-white leading-tight mb-5">
          Ready to Build Your<br />
          <span className="text-[#8B5CF6]">Powerful Personal Brand?</span>
        </h2>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">
          Schedule a free 30-minute discovery call and let&apos;s explore how to position you as the go-to expert in your field.
        </p>

        <form className="flex flex-col gap-4 max-w-md mx-auto text-left">
          {[
            { type: "text",  placeholder: "Your full name" },
            { type: "email", placeholder: "Your email address" },
          ].map((f) => (
            <input key={f.placeholder} type={f.type} placeholder={f.placeholder}
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors" />
          ))}
          <textarea rows={4} placeholder="Tell me about your goals..."
            className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors resize-none" />
          <button type="submit"
            className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-xl transition-colors mt-2">
            Book Your Free Call <ArrowRight />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer() {
  const links = ["Home", "About", "Services", "Success Stories", "Blog"];
  return (
    <footer className="bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Top row */}
        <div className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-gray-100">
          {/* Nav */}
          <div className="flex flex-wrap gap-6">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
            ))}
          </div>
          {/* Email + socials */}
          <div className="flex items-center gap-6">
            <a href="mailto:info@jasmeetsingh.com"
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5">
              ✉ info@jasmeetsingh.com
            </a>
            <div className="flex gap-2">
              {[
                { icon: <LinkedInIcon />,   href: "#" },
                { icon: <InstagramIcon />, href: "#" },
                { icon: <FacebookIcon />,  href: "#" },
                { icon: <TwitterIcon />,   href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED] flex items-center justify-center text-gray-500 transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="py-5 flex items-center justify-between">
          <p className="text-xs text-gray-400">© copyright 2025 &nbsp;·&nbsp; Privacy Policy</p>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms &amp; Condition &nbsp;·&nbsp; All rights reserved.</a>
        </div>
      </div>

      {/* Giant watermark */}
      <div className="relative overflow-hidden h-28 flex items-end">
        <p className="text-[120px] md:text-[160px] font-extrabold text-gray-900 leading-none whitespace-nowrap select-none pointer-events-none px-4 -mb-4">
          Jasmeet Singh
        </p>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────── */
export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <Partners />
      <About />
      <Services />
      <Process />
      <VideoSection />
      <Blog />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
}
