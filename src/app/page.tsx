"use client";

import { useEffect, useState } from "react";
import { getSiteContent, c, type ContentMap } from "@/lib/supabase";

const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ChevronRight = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
);
const StarFilled = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="#F59E0B"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
);
const LinkedInIcon  = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>);
const InstagramIcon = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>);
const FacebookIcon  = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>);
const TwitterIcon   = () => (<svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>);

const PARTNERS = ["BCG","DailyPay","Tweewieler","PFALZWERKE","airbnb","actionCOACH","Allstate","brave","zepto","binocs","Credova","FlySafair","Jeven","Allbridge","Consodata"];

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar({ cm }: { cm: ContentMap }) {
  const [open, setOpen] = useState(false);
  const links = ["Home","About","Services","Success Stories","Blog"];
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-bold text-[17px] text-gray-900 tracking-tight">{c(cm,"navbar","brand_name","BrandElevate")}</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-[13px] font-medium text-gray-600 hover:text-[#7C3AED] transition-colors">{l}</a>)}
        </div>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0F] hover:bg-gray-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors">
          {c(cm,"navbar","cta_text","Book a Consultation")}
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 flex flex-col gap-1.5">
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open?"rotate-45 translate-y-2":""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${open?"opacity-0":""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open?"-rotate-45 -translate-y-2":""}`}/>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700 hover:text-[#7C3AED]">{l}</a>)}
          <a href="#contact" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 bg-[#0A0A0F] text-white text-sm font-semibold px-5 py-2.5 rounded-full w-fit mt-2">{c(cm,"navbar","cta_text","Book a Consultation")}</a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero({ cm }: { cm: ContentMap }) {
  const stats = [
    { num: c(cm,"hero","stat1_value","200+"), label: c(cm,"hero","stat1_label","Successful Members"), icon: "👥" },
    { num: c(cm,"hero","stat2_value","6M+"),  label: c(cm,"hero","stat2_label","Followers Generated"), icon: "📈" },
    { num: c(cm,"hero","stat3_value","3k+"),  label: c(cm,"hero","stat3_label","Satisfied Clients"),   icon: "🎯" },
    { num: c(cm,"hero","stat4_value","500+"), label: c(cm,"hero","stat4_label","Branding Projects"),   icon: "🏆" },
  ];
  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[#0A0A10]"/>
      <div className="absolute inset-0" style={{ backgroundImage:`url('${c(cm,"hero","bg_image","https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=1600&q=85")}')`, backgroundSize:"cover", backgroundPosition:"center top", opacity:0.38 }}/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/85"/>
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center pt-32 pb-10">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-[64px] lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            {c(cm,"hero","headline_line1","You're More Than a Brand.")}<br/>
            {c(cm,"hero","headline_line2","You're a Movement.")}
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-sm">{c(cm,"hero","subtext","Helping you turn connections into opportunities through authentic branding.")}</p>
          <a href="#contact" className="inline-flex items-center gap-2.5 border border-white/50 hover:border-white hover:bg-white/10 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all">
            {c(cm,"hero","cta_text","Request a Call")}
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight size={14}/></span>
          </a>
        </div>
      </div>
      <div className="relative z-10 w-full bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s,i) => (
              <div key={s.label} className={`py-7 px-6 flex items-center gap-3 ${i<3?"border-r border-white/10":""}`}>
                <span className="text-xl">{s.icon}</span>
                <div><p className="text-2xl md:text-3xl font-extrabold text-white leading-none">{s.num}</p><p className="text-gray-400 text-xs mt-0.5">{s.label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Partners Marquee ───────────────────────────────────── */
function Partners() {
  const doubled = [...PARTNERS,...PARTNERS];
  return (
    <section className="py-14 bg-white border-b border-gray-100 overflow-hidden">
      <p className="text-center text-[#7C3AED] font-bold text-base tracking-widest uppercase mb-10">Partners and Clients</p>
      <div className="overflow-hidden">
        <div className="marquee-inner">
          {doubled.map((p,i) => <span key={i} className="mx-10 text-gray-400 hover:text-gray-700 font-semibold text-xs tracking-[0.2em] uppercase transition-colors cursor-default whitespace-nowrap">{p}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── About ──────────────────────────────────────────────── */
function About({ cm }: { cm: ContentMap }) {
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">About me</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">Meet {c(cm,"about","name","Jasmeet Singh")}</h2>
            <h2 className="text-[40px] md:text-5xl font-extrabold leading-tight mb-6">Your Personal <span className="text-[#7C3AED]">{c(cm,"about","title","Branding Coach")}</span></h2>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-4 max-w-md">{c(cm,"about","bio_1","")}</p>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-10 max-w-md">{c(cm,"about","bio_2","")}</p>
            <a href="#contact" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              {c(cm,"about","cta_text","Request a Call")}<span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1"><ArrowRight size={13}/></span>
            </a>
          </div>
          <div className="relative h-[560px]">
            <div className="absolute left-0 top-0 w-[260px] h-[380px] rounded-2xl overflow-hidden shadow-xl">
              <img src={c(cm,"about","photo_1","https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=600&q=80")} alt="Jasmeet" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-0 bottom-0 w-[220px] h-[300px] rounded-2xl overflow-hidden shadow-xl">
              <img src={c(cm,"about","photo_2","https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80")} alt="Coaching" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-2 top-8 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-10">
              <div className="flex items-center gap-1.5 mb-2"><span className="text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full">🌐 World wide</span></div>
              <p className="font-extrabold text-gray-900 text-sm mb-1">{c(cm,"about","badge_text","Bestselling Author")}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Techniques and principles different from what you might find in most leadership books</p>
            </div>
            <div className="absolute right-0 top-[340px] flex flex-col gap-1.5">
              <div className="w-2 h-6 bg-[#7C3AED] rounded-full"/><div className="w-2 h-2 bg-gray-200 rounded-full"/><div className="w-2 h-2 bg-gray-200 rounded-full"/>
            </div>
            <div className="absolute left-0 bottom-10 bg-[#7C3AED] rounded-2xl p-4 shadow-xl text-white">
              <p className="text-2xl font-extrabold leading-none">{c(cm,"about","experience_years","10+")}</p>
              <p className="text-[11px] text-purple-200 mt-0.5">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Services ───────────────────────────────────────────── */
function Services({ cm }: { cm: ContentMap }) {
  const cards = [1,2,3,4].map(n => ({
    date:  c(cm,"services",`card${n}_date`,""),
    title: c(cm,"services",`card${n}_title`,""),
    desc:  c(cm,"services",`card${n}_desc`,""),
    img:   c(cm,"services",`card${n}_img`,""),
    dark:  n === 1,
  }));
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Our Services</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight">Personal <span className="text-[#7C3AED]">Branding Services</span><br/>Tailored for You</h2>
          </div>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">{c(cm,"services","subtext","")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {cards.map(s => (
            <div key={s.title} className={`rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1.5 cursor-pointer shadow-sm hover:shadow-xl ${s.dark?"bg-[#1A0A3E]":"bg-white border border-gray-200"}`}>
              <div className="h-44 overflow-hidden relative">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover"/>
                {s.dark && <div className="absolute inset-0 bg-[#1A0A3E]/40"/>}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-[11px] font-mono mb-3 block ${s.dark?"text-purple-300":"text-gray-400"}`}>{s.date}</span>
                <h3 className={`font-bold text-sm leading-snug mb-2 ${s.dark?"text-white":"text-gray-900"}`}>{s.title}</h3>
                <p className={`text-xs leading-relaxed flex-1 ${s.dark?"text-purple-200/80":"text-gray-500"}`}>{s.desc}</p>
                <div className="mt-5 flex justify-end">
                  <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${s.dark?"bg-[#7C3AED] hover:bg-[#6D28D9] text-white":"bg-gray-100 hover:bg-[#7C3AED] hover:text-white text-gray-600"}`}><ArrowRight size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a href="#contact" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors">
            {c(cm,"services","cta_text","Book a Call")} <ArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Coaching Process ───────────────────────────────────── */
function Process({ cm }: { cm: ContentMap }) {
  const [active, setActive] = useState(2);
  const steps = [
    { title: c(cm,"process","step1","Understand your goals, values & uniqueness"), body: "" },
    { title: c(cm,"process","step2","Craft your positioning and messaging"),        body: "" },
    { title: c(cm,"process","step3_title","Develop"),                               body: c(cm,"process","step3_body","") },
    { title: c(cm,"process","step4","Launch your authentic personal brand"),        body: "" },
  ];
  return (
    <section className="py-28 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 leading-tight">{c(cm,"process","heading","My Coaching Process, Simplified")}</h2>
              <a href="#contact" className="hidden sm:inline-flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">Learn More <ArrowRight size={12}/></a>
            </div>
            <div className="flex flex-col gap-0">
              {steps.map((s,i) => (
                <div key={i} onClick={() => setActive(i)} className={`cursor-pointer border-b border-gray-200 ${i===0?"border-t":""}`}>
                  <div className="flex items-center justify-between py-4 px-1">
                    <h3 className={`font-semibold text-[15px] ${active===i?"text-gray-900":"text-gray-500"}`}>{s.title}</h3>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-colors ${active===i?"bg-[#7C3AED] text-white rotate-90":"bg-white text-gray-400"}`}><ChevronRight/></div>
                  </div>
                  {active===i && s.body && <div className="pb-5 px-1"><p className="text-gray-600 text-sm leading-[1.75]">{s.body}</p></div>}
                  {active===i && !s.body && <div className="pb-3 px-1"><div className="h-1 w-12 bg-[#7C3AED] rounded-full"/></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
            <img src={c(cm,"process","photo","https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80")} alt="Process" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Video Section (embed URL, no upload) ───────────────── */
function VideoSection({ cm }: { cm: ContentMap }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const embedUrl = c(cm,"video","youtube_url","");
  const caption  = c(cm,"video","caption","Watch my all activities");
  return (
    <section className="py-0 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-28">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[420px] md:h-[520px]">
          {showEmbed && embedUrl ? (
            <iframe src={`${embedUrl}?autoplay=1`} title="Video" allow="autoplay; fullscreen" allowFullScreen className="w-full h-full border-0"/>
          ) : (
            <>
              <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1400&q=80" alt="Video" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"/>
              <div className="absolute inset-0 flex items-center justify-center">
                <button onClick={() => embedUrl ? setShowEmbed(true) : undefined}
                  className="w-[72px] h-[72px] bg-[#7C3AED]/90 hover:bg-[#7C3AED] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-bold text-xl md:text-2xl">{caption}</p>
                <p className="text-gray-300 text-sm mt-1">Live sessions, keynotes, podcasts &amp; workshops</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Blog ───────────────────────────────────────────────── */
function Blog({ cm }: { cm: ContentMap }) {
  const posts = [1,2,3].map(n => ({
    date:    c(cm,"blog",`post${n}_date`,""),
    title:   c(cm,"blog",`post${n}_title`,""),
    excerpt: c(cm,"blog",`post${n}_excerpt`,""),
    img:     c(cm,"blog",`post${n}_img`,""),
  }));
  return (
    <section id="blog" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Our Blog</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight max-w-lg">
              {c(cm,"blog","heading","Insights & Strategies for Building Your Personal Brand")}
            </h2>
          </div>
          <div className="max-w-xs flex flex-col justify-end">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">{c(cm,"blog","subtext","")}</p>
            <a href="#" className="inline-flex items-center gap-2.5 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors w-fit">See All Articles <ArrowRight size={13}/></a>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.title} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer bg-white">
              <div className="h-52 overflow-hidden"><img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
              <div className="p-6">
                <p className="text-[11px] text-gray-400 font-medium mb-3">{p.date}</p>
                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-5">{p.excerpt}</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-[#7C3AED] text-sm font-semibold hover:gap-3 transition-all">Read more <ArrowRight size={13}/></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────── */
function Testimonials({ cm }: { cm: ContentMap }) {
  const [active, setActive] = useState(1);
  const testimonials = [1,2,3].map(n => ({
    quote:  c(cm,"testimonials",`t${n}_quote`,""),
    name:   c(cm,"testimonials",`t${n}_name`,""),
    role:   c(cm,"testimonials",`t${n}_role`,""),
    avatar: c(cm,"testimonials",`t${n}_avatar`,""),
  }));
  return (
    <section id="success-stories" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Testimonials</span><span className="w-8 h-px bg-gray-400 block"/></div>
          <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 mb-4">What <span className="text-[#7C3AED]">My Clients</span> Are Saying</h2>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto leading-relaxed">{c(cm,"testimonials","subtext","")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t,i) => (
            <div key={i} onClick={() => setActive(i)} className={`rounded-2xl p-7 cursor-pointer transition-all border ${active===i?"bg-white border-gray-200 shadow-xl":"bg-white border-gray-100 shadow-sm hover:shadow-md"}`}>
              <div className="text-[64px] leading-none text-gray-200 font-serif mb-2 -mt-3 -ml-1">&ldquo;</div>
              <p className="text-gray-700 text-sm leading-[1.75] mb-6 -mt-4">{t.quote}</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"/>
                <div className="flex-1"><p className="font-bold text-gray-900 text-sm">{t.name}</p><p className="text-gray-500 text-xs">{t.role}</p></div>
                <div className="flex gap-0.5">{[...Array(5)].map((_,si) => <StarFilled key={si}/>)}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setActive(a => Math.max(0,a-1))} className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6" strokeLinecap="round"/></svg>
          </button>
          {testimonials.map((_,i) => <button key={i} onClick={() => setActive(i)} className={`rounded-full transition-all ${active===i?"w-6 h-2.5 bg-[#7C3AED]":"w-2.5 h-2.5 bg-gray-200 hover:bg-gray-300"}`}/>)}
          <button onClick={() => setActive(a => Math.min(testimonials.length-1,a+1))} className="w-7 h-7 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] flex items-center justify-center text-white">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── Contact Form (submits to /api/submit-form) ─────────── */
function Contact({ cm }: { cm: ContentMap }) {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_name:"contact", ...form, source_url: window.location.href }),
      });
      if (res.ok) { setStatus("success"); setForm({ name:"", email:"", message:"" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="py-28 bg-[#0A0A10]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-5"><span className="w-8 h-px bg-gray-700 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Get In Touch</span><span className="w-8 h-px bg-gray-700 block"/></div>
        <h2 className="text-[40px] md:text-5xl font-extrabold text-white leading-tight mb-5">
          Ready to Build Your<br/><span className="text-[#8B5CF6]">{c(cm,"contact","heading","Powerful Personal Brand?")}</span>
        </h2>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-12 max-w-lg mx-auto">{c(cm,"contact","subtext","")}</p>

        {status === "success" ? (
          <div className="max-w-md mx-auto bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-white font-bold text-lg mb-2">Message Received!</p>
            <p className="text-gray-400 text-sm">Thank you for reaching out. Jasmeet will be in touch within 24 hours.</p>
            <button onClick={() => setStatus("idle")} className="mt-6 text-[#8B5CF6] text-sm font-semibold hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4 max-w-md mx-auto text-left">
            <input required value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="Your full name"
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors"/>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} placeholder="Your email address"
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors"/>
            <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))} placeholder="Tell me about your goals..."
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors resize-none"/>
            {status === "error" && <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status==="loading"}
              className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-xl transition-colors mt-2 disabled:opacity-60">
              {status==="loading" ? "Sending…" : <>{c(cm,"contact","cta_text","Book Your Free Call")} <ArrowRight/></>}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer({ cm }: { cm: ContentMap }) {
  const quickLinks = ["Home","About","Services","Success Stories","Blog"];
  const dynamicServices = [1,2,3,4].map(n => c(cm,"services",`card${n}_title`,"")).filter(Boolean);
  const services = dynamicServices.length ? dynamicServices : ["Personal Branding Strategy","1:1 Executive Coaching","Content & Visibility","Workshops & Keynotes"];
  const socials = [
    { icon:<LinkedInIcon/>,  href:c(cm,"footer","linkedin_url","#"),  label:"LinkedIn"  },
    { icon:<InstagramIcon/>, href:c(cm,"footer","instagram_url","#"), label:"Instagram" },
    { icon:<FacebookIcon/>,  href:c(cm,"footer","facebook_url","#"),  label:"Facebook"  },
    { icon:<TwitterIcon/>,   href:c(cm,"footer","twitter_url","#"),   label:"Twitter"   },
  ];

  return (
    <footer className="bg-[#0A0A10] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="py-20 grid sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-x-8 gap-y-12">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <a href="#home" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span className="font-bold text-[17px] text-white tracking-tight">{c(cm,"about","name","Jasmeet Singh")}</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {c(cm,"footer","tagline","Helping ambitious professionals build authentic personal brands that turn connections into opportunities.")}
            </p>
            <div className="flex gap-2">
              {socials.map((s,i) => (
                <a key={i} href={s.href} aria-label={s.label} className="w-9 h-9 rounded-full border border-white/10 hover:border-[#7C3AED] hover:bg-[#7C3AED] flex items-center justify-center text-gray-400 hover:text-white transition-colors">{s.icon}</a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">Quick Links</h4>
            <ul className="flex flex-col gap-3.5">
              {quickLinks.map(l => (
                <li key={l}><a href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-gray-400 hover:text-white text-sm transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">Services</h4>
            <ul className="flex flex-col gap-3.5">
              {services.map(s => (
                <li key={s}><a href="#services" className="text-gray-400 hover:text-white text-sm transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5">Get In Touch</h4>
            <ul className="flex flex-col gap-4 mb-6">
              <li>
                <a href={`mailto:${c(cm,"footer","email","info@jasmeetsingh.com")}`} className="text-gray-400 hover:text-white text-sm transition-colors flex items-start gap-2.5">
                  <span className="mt-0.5 text-[#8B5CF6]">✉</span>{c(cm,"footer","email","info@jasmeetsingh.com")}
                </a>
              </li>
              <li>
                <a href={`tel:${c(cm,"footer","phone","+15551234567").replace(/[^+\d]/g,"")}`} className="text-gray-400 hover:text-white text-sm transition-colors flex items-start gap-2.5">
                  <span className="mt-0.5 text-[#8B5CF6]">☎</span>{c(cm,"footer","phone","+1 (555) 123-4567")}
                </a>
              </li>
              <li className="text-gray-400 text-sm flex items-start gap-2.5">
                <span className="mt-0.5 text-[#8B5CF6]">📍</span>{c(cm,"footer","location","New York, NY")}
              </li>
            </ul>
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors">
              Book a Call <ArrowRight size={12}/>
            </a>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">{c(cm,"footer","copyright","© 2025 Jasmeet Singh. All rights reserved.")}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden h-16 md:h-24 flex items-end pointer-events-none select-none" aria-hidden="true">
        <p className="text-[70px] md:text-[130px] font-extrabold leading-none whitespace-nowrap px-4 -mb-3 bg-gradient-to-b from-white/[0.07] to-white/0 bg-clip-text text-transparent">
          {c(cm,"footer","watermark","Jasmeet Singh")}
        </p>
      </div>
    </footer>
  );
}

/* ── Root Page ──────────────────────────────────────────── */
export default function Page() {
  const [cm, setCm] = useState<ContentMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSiteContent().then(map => { setCm(map); setReady(true); });
  }, []);

  if (!ready) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0A0A10]">
      <div className="w-10 h-10 border-4 border-[#7C3AED] border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <>
      <Navbar cm={cm}/>
      <Hero cm={cm}/>
      <Partners/>
      <About cm={cm}/>
      <Services cm={cm}/>
      <Process cm={cm}/>
      <VideoSection cm={cm}/>
      <Blog cm={cm}/>
      <Testimonials cm={cm}/>
      <Contact cm={cm}/>
      <Footer cm={cm}/>
    </>
  );
}
