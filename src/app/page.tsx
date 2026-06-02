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

const CheckIcon = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);

const PARTNERS = ["BCG","DailyPay","Microsoft","Airbnb","ActionCOACH","Allstate","Zepto","Credova","FlySafair","Allbridge","Consodata","Tweewieler","PFALZWERKE","binocs","brave"];

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
          <span className="font-bold text-[17px] text-gray-900 tracking-tight">{c(cm,"navbar","brand_name","Jasmeet Singh")}</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-[13px] font-medium text-gray-600 hover:text-[#7C3AED] transition-colors">{l}</a>)}
        </div>
        <a href="#contact" className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0F] hover:bg-gray-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors">
          {c(cm,"navbar","cta_text","Book a Free Call")}
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
          <a href="#contact" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 bg-[#0A0A0F] text-white text-sm font-semibold px-5 py-2.5 rounded-full w-fit mt-2">{c(cm,"navbar","cta_text","Book a Free Call")}</a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero (Character + Desire) ──────────────────────────── */
function Hero({ cm }: { cm: ContentMap }) {
  const stats = [
    { num: c(cm,"hero","stat1_value","500+"),  label: c(cm,"hero","stat1_label","Careers Transformed"), icon: "🚀" },
    { num: c(cm,"hero","stat2_value","93%"),   label: c(cm,"hero","stat2_label","Land Their Dream Role"), icon: "🎯" },
    { num: c(cm,"hero","stat3_value","12+"),   label: c(cm,"hero","stat3_label","Years of Experience"), icon: "⭐" },
    { num: c(cm,"hero","stat4_value","30+"),   label: c(cm,"hero","stat4_label","Industries Coached"), icon: "🌐" },
  ];
  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[#0A0A10]"/>
      <div className="absolute inset-0" style={{ backgroundImage:`url('${c(cm,"hero","bg_image","/Z24A9117.jpg")}')`, backgroundSize:"cover", backgroundPosition:"center top", opacity:0.35 }}/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/90"/>
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center pt-32 pb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"/>
            <span className="text-[#A78BFA] text-xs font-semibold tracking-wide uppercase">{c(cm,"hero","badge","AI-Powered Career Coaching")}</span>
          </div>
          <h1 className="text-5xl md:text-[64px] lg:text-[72px] font-extrabold text-white leading-[1.05] tracking-tight mb-6">
            {c(cm,"hero","headline_line1","You Were Not Built")}<br/>
            <span className="text-[#A78BFA]">{c(cm,"hero","headline_line2","to Stay Stuck.")}</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-4 max-w-lg">
            {c(cm,"hero","subtext","Most professionals spend years in careers that drain them — talented, capable, yet invisible to the opportunities they deserve. It doesn't have to be this way.")}
          </p>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
            {c(cm,"hero","subtext2","I help ambitious professionals architect a future aligned with their strengths, using AI-driven clarity to land roles and build lives they're proud of.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="inline-flex items-center justify-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-purple-900/40">
              {c(cm,"hero","cta_primary","Book Your Free Strategy Call")}
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight size={14}/></span>
            </a>
            <a href="#about" className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all">
              {c(cm,"hero","cta_secondary","See How It Works")}
            </a>
          </div>
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
      <p className="text-center text-[#7C3AED] font-bold text-base tracking-widest uppercase mb-10">Clients & Partners From</p>
      <div className="overflow-hidden">
        <div className="marquee-inner">
          {doubled.map((p,i) => <span key={i} className="mx-10 text-gray-400 hover:text-gray-700 font-semibold text-xs tracking-[0.2em] uppercase transition-colors cursor-default whitespace-nowrap">{p}</span>)}
        </div>
      </div>
    </section>
  );
}

/* ── Problem Section ─────────────────────────────────────── */
function Problem({ cm }: { cm: ContentMap }) {
  const problems = [
    {
      icon: "😔",
      title: c(cm,"problem","p1_title","You're Talented — But Invisible"),
      desc:  c(cm,"problem","p1_desc","You've put in the work. You have the skills. Yet the promotions go to others, the dream roles never seem to land, and your career feels like it's on someone else's timeline."),
    },
    {
      icon: "🔁",
      title: c(cm,"problem","p2_title","You Feel Stuck in the Wrong Story"),
      desc:  c(cm,"problem","p2_desc","Every Sunday dread. Every performance review that doesn't reflect your real value. A creeping sense that you've outgrown your current path — but no clear roadmap for what's next."),
    },
    {
      icon: "🤖",
      title: c(cm,"problem","p3_title","AI Is Changing Everything — Fast"),
      desc:  c(cm,"problem","p3_desc","The rules of career success are being rewritten. Without a strategy that leverages AI and future-of-work insights, even exceptional professionals risk being left behind."),
    },
  ];
  return (
    <section className="py-28 bg-[#0A0A10]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-px bg-gray-700 block"/>
            <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Does This Sound Familiar?</span>
            <span className="w-8 h-px bg-gray-700 block"/>
          </div>
          <h2 className="text-[36px] md:text-[48px] font-extrabold text-white leading-tight mb-5">
            {c(cm,"problem","heading","Most Professionals Are Living Someone Else's Career Plan")}
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            {c(cm,"problem","subtext","It's not a talent problem. It's a clarity, strategy, and positioning problem — and it's costing you years of your one career.")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map(p => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#7C3AED]/40 transition-colors">
              <div className="text-4xl mb-5">{p.icon}</div>
              <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-[1.75]">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-[#A78BFA] font-semibold text-lg mb-6">
            {c(cm,"problem","pivot","There is a better way — and it starts with a single conversation.")}
          </p>
          <a href="#contact" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-purple-900/40">
            {c(cm,"problem","cta","Yes, I Want to Change This")} <ArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── About (Guide) ──────────────────────────────────────── */
function About({ cm }: { cm: ContentMap }) {
  const credentials = [
    c(cm,"about","cred1","12+ years in corporate strategy & leadership"),
    c(cm,"about","cred2","AI & Future of Work thought leader"),
    c(cm,"about","cred3","Coached professionals across 30+ industries"),
    c(cm,"about","cred4","Speaker at global leadership & innovation forums"),
  ];
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Your Guide</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">Meet {c(cm,"about","name","Jasmeet Singh")}</h2>
            <h2 className="text-[40px] md:text-5xl font-extrabold leading-tight mb-6">Your <span className="text-[#7C3AED]">{c(cm,"about","title","Future Architect")}</span></h2>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-4 max-w-md">
              {c(cm,"about","bio_1","I know what it feels like to be at a crossroads. After a decade navigating corporate leadership, strategy consulting, and the rapid rise of AI, I realized most high-performers lack one thing: a clear, confident vision for their future.")}
            </p>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-8 max-w-md">
              {c(cm,"about","bio_2","I built my coaching practice to solve exactly that. Together, we combine deep human insight with AI-powered career intelligence to design your next chapter — not just a job, but a career that compounds over time.")}
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center flex-shrink-0"><CheckIcon/></span>
                  <span className="text-gray-700 text-sm">{cred}</span>
                </div>
              ))}
            </div>
            <a href="#contact" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              {c(cm,"about","cta_text","Work With Jasmeet")}<span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1"><ArrowRight size={13}/></span>
            </a>
          </div>
          <div className="relative h-[560px]">
            <div className="absolute left-0 top-0 w-[260px] h-[380px] rounded-2xl overflow-hidden shadow-xl">
              <img src={c(cm,"about","photo_1","/Z24A9117.jpg")} alt="Jasmeet Singh" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-0 bottom-0 w-[220px] h-[300px] rounded-2xl overflow-hidden shadow-xl">
              <img src={c(cm,"about","photo_2","/Z24A8994 copy.jpg")} alt="Coaching session" className="w-full h-full object-cover"/>
            </div>
            <div className="absolute right-2 top-8 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-10">
              <div className="flex items-center gap-1.5 mb-2"><span className="text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full">🌐 Global Coach</span></div>
              <p className="font-extrabold text-gray-900 text-sm mb-1">{c(cm,"about","badge_text","AI + Human Intelligence")}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Combining AI tools with deep human coaching to give you an unfair career advantage</p>
            </div>
            <div className="absolute right-0 top-[340px] flex flex-col gap-1.5">
              <div className="w-2 h-6 bg-[#7C3AED] rounded-full"/><div className="w-2 h-2 bg-gray-200 rounded-full"/><div className="w-2 h-2 bg-gray-200 rounded-full"/>
            </div>
            <div className="absolute left-0 bottom-10 bg-[#7C3AED] rounded-2xl p-4 shadow-xl text-white">
              <p className="text-2xl font-extrabold leading-none">{c(cm,"about","experience_years","12+")}</p>
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
  const cards = [
    {
      date:  c(cm,"services","card1_date","Most Popular"),
      title: c(cm,"services","card1_title","1-on-1 Career Architecture Session"),
      desc:  c(cm,"services","card1_desc","A deep-dive private coaching engagement where we map your strengths, identify your highest-leverage opportunities, and build a 90-day career action plan powered by AI insights."),
      img:   c(cm,"services","card1_img","/Z24A9117.jpg"),
      dark:  true,
    },
    {
      date:  c(cm,"services","card2_date","Fast-Track"),
      title: c(cm,"services","card2_title","Career Clarity Intensive"),
      desc:  c(cm,"services","card2_desc","A focused half-day intensive to break through confusion and walk away with total clarity on your next career move, your personal positioning, and a concrete step-by-step plan."),
      img:   c(cm,"services","card2_img","https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"),
      dark:  false,
    },
    {
      date:  c(cm,"services","card3_date","Group Programme"),
      title: c(cm,"services","card3_title","Future Architects Mastermind"),
      desc:  c(cm,"services","card3_desc","Join a curated cohort of ambitious professionals. Weekly group coaching, AI career tools, accountability sprints, and a community of peers all architecting extraordinary careers."),
      img:   c(cm,"services","card3_img","https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"),
      dark:  false,
    },
    {
      date:  c(cm,"services","card4_date","Executive"),
      title: c(cm,"services","card4_title","LinkedIn & Personal Brand Overhaul"),
      desc:  c(cm,"services","card4_desc","Turn your LinkedIn profile and personal brand into a magnet for the right opportunities. We craft your narrative, optimize your presence, and create content that positions you as an industry authority."),
      img:   c(cm,"services","card4_img","https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80"),
      dark:  false,
    },
  ];
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">How I Help You</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight">Coaching Programmes <br/><span className="text-[#7C3AED]">Designed for Your Future</span></h2>
          </div>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">{c(cm,"services","subtext","Every programme is built around your unique strengths, goals, and the career landscape of tomorrow — not yesterday.")}</p>
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
            {c(cm,"services","cta_text","Book a Free Discovery Call")} <ArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Plan (The 3-Step Process) ──────────────────────────── */
function Process({ cm }: { cm: ContentMap }) {
  const [active, setActive] = useState(0);
  const steps = [
    {
      title: c(cm,"process","step1_title","Step 1: Gain Crystal-Clear Clarity"),
      body:  c(cm,"process","step1_body","In our first sessions, we use a proprietary AI-assisted assessment combined with deep coaching conversations to map your values, strengths, and hidden potential. You'll finally understand exactly who you are professionally and where you're meant to go."),
    },
    {
      title: c(cm,"process","step2_title","Step 2: Build Your Career Strategy"),
      body:  c(cm,"process","step2_body","Together we craft a precision career strategy: your positioning, your target roles, your personal brand narrative, and a roadmap for getting there. We use AI tools to benchmark market demand, salary data, and emerging opportunities aligned to your goals."),
    },
    {
      title: c(cm,"process","step3_title","Step 3: Execute & Launch with Confidence"),
      body:  c(cm,"process","step3_body","This is where transformation becomes real. We optimize your LinkedIn, refine your interview strategy, build your visibility, and surround you with accountability and momentum. Most clients see meaningful career movement within 90 days."),
    },
    {
      title: c(cm,"process","step4_title","Step 4: Sustain & Scale Your Growth"),
      body:  c(cm,"process","step4_body","A great career isn't built in a sprint — it's architected over time. We install habits, systems, and mindsets that compound your growth year after year, ensuring the career you build keeps getting better."),
    },
  ];
  return (
    <section className="py-28 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 leading-tight">{c(cm,"process","heading","A Simple Plan to Architect Your Future")}</h2>
              <a href="#contact" className="hidden sm:inline-flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">Get Started <ArrowRight size={12}/></a>
            </div>
            <div className="flex flex-col gap-0">
              {steps.map((s,i) => (
                <div key={i} onClick={() => setActive(i)} className={`cursor-pointer border-b border-gray-200 ${i===0?"border-t":""}`}>
                  <div className="flex items-center justify-between py-4 px-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${active===i?"bg-[#7C3AED] text-white":"bg-gray-200 text-gray-500"}`}>{i+1}</span>
                      <h3 className={`font-semibold text-[15px] ${active===i?"text-gray-900":"text-gray-500"}`}>{s.title}</h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all ${active===i?"bg-[#7C3AED] text-white rotate-90":"bg-white text-gray-400"}`}><ChevronRight/></div>
                  </div>
                  {active===i && <div className="pb-5 px-1 pl-10"><p className="text-gray-600 text-sm leading-[1.75]">{s.body}</p></div>}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
            <img src={c(cm,"process","photo","/Z24A8994 copy.jpg")} alt="Coaching in action" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-bold text-lg">{c(cm,"process","photo_caption","Your transformation begins with one honest conversation.")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Vision Section (Success & Stakes) ─────────────────── */
function Vision({ cm }: { cm: ContentMap }) {
  const successes = [
    { icon:"💼", text: c(cm,"vision","s1","Land a role that pays you what you're actually worth") },
    { icon:"📣", text: c(cm,"vision","s2","Build a personal brand that opens doors without you knocking") },
    { icon:"🧭", text: c(cm,"vision","s3","Have a career roadmap for the next 3–5 years") },
    { icon:"🤝", text: c(cm,"vision","s4","Walk into any room — or interview — with total confidence") },
    { icon:"⚡", text: c(cm,"vision","s5","Use AI tools to stay ahead of your industry, not behind it") },
    { icon:"🏆", text: c(cm,"vision","s6","Feel proud of the work you do every single day") },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Your Future Self</span></div>
            <h2 className="text-[36px] md:text-[48px] font-extrabold text-gray-900 leading-tight mb-6">
              {c(cm,"vision","heading","Imagine Waking Up Excited About Your Career — Every Day")}
            </h2>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-10">
              {c(cm,"vision","subtext","Working with hundreds of professionals has shown me this: when people have clarity, strategy, and the right support, extraordinary careers become inevitable. Here's what that looks like for you:")}
            </p>
            <div className="grid grid-cols-1 gap-4">
              {successes.map((s,i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F3EFFF] border border-[#7C3AED]/10">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="text-gray-800 text-sm font-medium">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden h-64 shadow-xl">
              <img src={c(cm,"vision","photo","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80")} alt="Future success" className="w-full h-full object-cover"/>
            </div>
            <div className="bg-[#0A0A10] rounded-2xl p-8 text-white">
              <p className="text-[#A78BFA] text-sm font-semibold mb-3 uppercase tracking-wide">{c(cm,"vision","warning_label","But the cost of staying stuck...")}</p>
              <p className="text-gray-300 text-[15px] leading-[1.8]">
                {c(cm,"vision","warning_text","Every year in the wrong role is a year of lost earnings, lost growth, and lost energy. The professionals who transform their careers are not the most talented — they're the ones who decided to stop waiting and start architecting.")}
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 mt-6 text-[#A78BFA] font-bold text-sm hover:text-white transition-colors">
                Don't wait another year <ArrowRight size={14}/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Video Section ──────────────────────────────────────── */
function VideoSection({ cm }: { cm: ContentMap }) {
  const [showEmbed, setShowEmbed] = useState(false);
  const embedUrl = c(cm,"video","youtube_url","");
  const caption  = c(cm,"video","caption","See What Career Transformation Really Looks Like");
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
                <p className="text-gray-300 text-sm mt-1">Keynotes, live coaching sessions, podcasts &amp; client stories</p>
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
  const posts = [
    {
      date:    c(cm,"blog","post1_date","Future of Work"),
      title:   c(cm,"blog","post1_title","How AI Is Reshaping Career Trajectories — And What to Do About It"),
      excerpt: c(cm,"blog","post1_excerpt","The professionals thriving in the AI era aren't the ones fearing automation — they're the ones who've learned to use AI as a career accelerator. Here's the playbook."),
      img:     c(cm,"blog","post1_img","https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80"),
    },
    {
      date:    c(cm,"blog","post2_date","Career Strategy"),
      title:   c(cm,"blog","post2_title","The Hidden Reason High-Performers Stay Stuck (And How to Break Free)"),
      excerpt: c(cm,"blog","post2_excerpt","Talent is never the bottleneck. After coaching 500+ professionals, I've found the real reason brilliant people stay in roles they've outgrown — and the simple shift that changes everything."),
      img:     c(cm,"blog","post2_img","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"),
    },
    {
      date:    c(cm,"blog","post3_date","Personal Brand"),
      title:   c(cm,"blog","post3_title","Your LinkedIn Is a Resume. It Should Be a Magnet."),
      excerpt: c(cm,"blog","post3_excerpt","Most LinkedIn profiles tell employers what you've done. The best ones make them feel like they'd be crazy not to reach out. Learn the 5 elements of a LinkedIn profile that actually generates inbound opportunities."),
      img:     c(cm,"blog","post3_img","https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80"),
    },
  ];
  return (
    <section id="blog" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-5"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Career Intelligence</span></div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight max-w-lg">
              {c(cm,"blog","heading","Insights to Architect a Career You're Proud Of")}
            </h2>
          </div>
          <div className="max-w-xs flex flex-col justify-end">
            <p className="text-gray-500 text-[15px] leading-relaxed mb-6">{c(cm,"blog","subtext","Practical, research-backed thinking on careers, AI, leadership, and personal branding — delivered straight from the coaching floor.")}</p>
            <a href="#" className="inline-flex items-center gap-2.5 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors w-fit">See All Articles <ArrowRight size={13}/></a>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(p => (
            <article key={p.title} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow group cursor-pointer bg-white">
              <div className="h-52 overflow-hidden"><img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/></div>
              <div className="p-6">
                <p className="text-[11px] text-[#7C3AED] font-semibold mb-3 uppercase tracking-wide">{p.date}</p>
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
  const [active, setActive] = useState(0);
  const testimonials = [
    {
      quote:  c(cm,"testimonials","t1_quote","Working with Jasmeet was a turning point. Within 3 months of our coaching, I landed a senior leadership role at a global tech company — a 40% salary jump. But more than the title and salary, I finally feel like I'm doing work that matters. He didn't just help me find a job. He helped me find my direction."),
      name:   c(cm,"testimonials","t1_name","Priya M."),
      role:   c(cm,"testimonials","t1_role","VP of Strategy, Global Tech Firm"),
      avatar: c(cm,"testimonials","t1_avatar","https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100&q=80"),
    },
    {
      quote:  c(cm,"testimonials","t2_quote","I had 15 years of experience and felt completely invisible to the market. Jasmeet rebuilt my LinkedIn, my pitch, and my confidence. Six weeks later I had three competing offers. I went with the one that paid double my previous salary. This is the best investment I've ever made in myself."),
      name:   c(cm,"testimonials","t2_name","Daniel R."),
      role:   c(cm,"testimonials","t2_role","Engineering Director, Fortune 500"),
      avatar: c(cm,"testimonials","t2_avatar","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"),
    },
    {
      quote:  c(cm,"testimonials","t3_quote","I was burned out, underpaid, and honestly afraid of AI replacing my role. Jasmeet completely reframed my relationship with AI — I now use it as my competitive edge. He helped me pivot into a new field I love and negotiate a package I wouldn't have dared ask for a year ago."),
      name:   c(cm,"testimonials","t3_name","Amara K."),
      role:   c(cm,"testimonials","t3_role","AI Strategy Lead, Consulting"),
      avatar: c(cm,"testimonials","t3_avatar","https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80"),
    },
  ];
  return (
    <section id="success-stories" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4"><span className="w-8 h-px bg-gray-400 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Success Stories</span><span className="w-8 h-px bg-gray-400 block"/></div>
          <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 mb-4">Real People. <span className="text-[#7C3AED]">Real Transformations.</span></h2>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto leading-relaxed">{c(cm,"testimonials","subtext","These aren't just career wins — they're lives changed. Here's what's possible when you commit to architecting your future.")}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t,i) => (
            <div key={i} onClick={() => setActive(i)} className={`rounded-2xl p-7 cursor-pointer transition-all border ${active===i?"bg-white border-[#7C3AED]/30 shadow-xl":"bg-white border-gray-100 shadow-sm hover:shadow-md"}`}>
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

/* ── Contact Form ────────────────────────────────────────── */
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
        <div className="flex items-center justify-center gap-3 mb-5"><span className="w-8 h-px bg-gray-700 block"/><span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Take the First Step</span><span className="w-8 h-px bg-gray-700 block"/></div>
        <h2 className="text-[40px] md:text-5xl font-extrabold text-white leading-tight mb-5">
          Ready to <span className="text-[#8B5CF6]">{c(cm,"contact","heading","Architect Your Future?")}</span>
        </h2>
        <p className="text-gray-400 text-[15px] leading-relaxed mb-4 max-w-lg mx-auto">
          {c(cm,"contact","subtext","Book a free 30-minute strategy call. We'll talk about where you are, where you want to be, and whether working together is the right next step. No pressure. Just clarity.")}
        </p>
        <p className="text-gray-600 text-sm mb-12">
          {c(cm,"contact","note","Most clients walk away from the discovery call with at least one actionable insight — regardless of what they decide.")}
        </p>

        {status === "success" ? (
          <div className="max-w-md mx-auto bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-white font-bold text-lg mb-2">You're One Step Closer!</p>
            <p className="text-gray-400 text-sm">Thank you for reaching out. Jasmeet will be in touch within 24 hours to schedule your strategy call.</p>
            <button onClick={() => setStatus("idle")} className="mt-6 text-[#8B5CF6] text-sm font-semibold hover:underline">Send another message</button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4 max-w-md mx-auto text-left">
            <input required value={form.name} onChange={e => setForm(f => ({...f,name:e.target.value}))} placeholder="Your full name"
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors"/>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({...f,email:e.target.value}))} placeholder="Your email address"
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors"/>
            <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({...f,message:e.target.value}))} placeholder="What's your biggest career challenge right now?"
              className="bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-5 py-3.5 text-sm outline-none transition-colors resize-none"/>
            {status === "error" && <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status==="loading"}
              className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-xl transition-colors mt-2 disabled:opacity-60">
              {status==="loading" ? "Sending…" : <>{c(cm,"contact","cta_text","Book My Free Strategy Call")} <ArrowRight/></>}
            </button>
            <p className="text-center text-gray-600 text-xs">{c(cm,"contact","guarantee","100% free. No sales pitch. Just an honest conversation about your future.")}</p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer({ cm }: { cm: ContentMap }) {
  const links = ["Home","About","Services","Success Stories","Blog"];
  return (
    <footer className="bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-gray-100">
          <div className="flex flex-wrap gap-6">
            {links.map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>)}
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${c(cm,"footer","email","hello@jasmeetchandhok.com")}`} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5">
              ✉ {c(cm,"footer","email","hello@jasmeetchandhok.com")}
            </a>
            <div className="flex gap-2">
              {[
                { icon:<LinkedInIcon/>,   href:c(cm,"footer","linkedin_url","https://www.linkedin.com/in/jasmeetchandhok") },
                { icon:<InstagramIcon/>,  href:c(cm,"footer","instagram_url","https://www.instagram.com/jasmeetchandhok.ai") },
                { icon:<FacebookIcon/>,   href:c(cm,"footer","facebook_url","#") },
                { icon:<TwitterIcon/>,    href:c(cm,"footer","twitter_url","#")  },
              ].map((s,i) => (
                <a key={i} href={s.href} className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#7C3AED] hover:text-[#7C3AED] flex items-center justify-center text-gray-500 transition-colors">{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="py-5 flex items-center justify-between">
          <p className="text-xs text-gray-400">{c(cm,"footer","copyright","© 2026 Jasmeet Singh")} · Privacy Policy</p>
          <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms &amp; Conditions · All rights reserved.</a>
        </div>
      </div>
      <div className="relative overflow-hidden h-28 flex items-end">
        <p className="text-[120px] md:text-[160px] font-extrabold text-gray-900 leading-none whitespace-nowrap select-none pointer-events-none px-4 -mb-4">
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
      <Problem cm={cm}/>
      <About cm={cm}/>
      <Services cm={cm}/>
      <Process cm={cm}/>
      <Vision cm={cm}/>
      <VideoSection cm={cm}/>
      <Blog cm={cm}/>
      <Testimonials cm={cm}/>
      <Contact cm={cm}/>
      <Footer cm={cm}/>
    </>
  );
}
