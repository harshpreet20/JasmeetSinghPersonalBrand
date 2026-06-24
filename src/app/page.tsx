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
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
);

/* ── Navbar ─────────────────────────────────────────────── */
function Navbar({ cm }: { cm: ContentMap }) {
  const [open, setOpen] = useState(false);
  const links = ["Home","About","How It Works","Success Stories"];
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2.5">
          <img src="/jc.png" alt="Jasmeet Singh" className="h-16 w-auto object-contain"/>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-[13px] font-medium text-gray-600 hover:text-[#7C3AED] transition-colors">{l}</a>
          ))}
        </div>
        <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 bg-[#0A0A0F] hover:bg-gray-800 text-white text-[13px] font-semibold px-5 py-2.5 rounded-full transition-colors">
          {c(cm,"navbar","cta_text","Book a Free Call")}
        </a>
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 flex flex-col gap-1.5" aria-label="Toggle menu">
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open?"rotate-45 translate-y-2":""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all ${open?"opacity-0":""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-800 transition-all origin-center ${open?"-rotate-45 -translate-y-2":""}`}/>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-700 hover:text-[#7C3AED]">{l}</a>
          ))}
          <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 bg-[#0A0A0F] text-white text-sm font-semibold px-5 py-2.5 rounded-full w-fit mt-2">
            {c(cm,"navbar","cta_text","Book a Free Call")}
          </a>
        </div>
      )}
    </nav>
  );
}

/* ── Hero ───────────────────────────────────────────────── */
function Hero({ cm }: { cm: ContentMap }) {
  const stats = [
    { num: c(cm,"hero","stat1_value","800+"),  label: c(cm,"hero","stat1_label","Families Helped"), icon: "🏠" },
    { num: c(cm,"hero","stat2_value","Class 8-12"), label: c(cm,"hero","stat2_label","Students Served"), icon: "🌏" },
    { num: c(cm,"hero","stat3_value","Certified"),      label: c(cm,"hero","stat3_label","Psychometric Tools"), icon: "✅" },
    { num: c(cm,"hero","stat4_value","Both"),           label: c(cm,"hero","stat4_label","Parent & Child Attend"), icon: "💜" },
  ];
  return (
    <section id="home" className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[#0A0A10]"/>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${c(cm,"hero","bg_image","/Z24A9117.jpg")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.32,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-black/90"/>
      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col justify-center pt-32 pb-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/20 border border-[#7C3AED]/40 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"/>
            <span className="text-[#A78BFA] text-xs font-semibold tracking-wide uppercase">
              {c(cm,"hero","badge","Certified Career Counsellor & Family Alignment Coach")}
            </span>
          </div>
          <h1 className="text-5xl md:text-[62px] lg:text-[70px] font-extrabold text-white leading-[1.06] tracking-tight mb-6">
            {c(cm,"hero","headline_line1","Your child wants one thing.")}<br/>
            <span className="text-[#A78BFA]">{c(cm,"hero","headline_line2","You want something safe. Let's end the fight.")}</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            {c(cm,"hero","subtext","Jasmeet Singh helps Indian families turn career confusion into a plan everyone agrees on, using certified tools, not opinions.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-7 py-3.5 rounded-full transition-all shadow-lg shadow-purple-900/40">
              {c(cm,"hero","cta_primary","Book a Free Clarity Call")}
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"><ArrowRight size={14}/></span>
            </a>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-2.5 border border-white/30 hover:border-white/60 hover:bg-white/5 text-white text-sm font-semibold px-7 py-3.5 rounded-full transition-all">
              {c(cm,"hero","cta_secondary","See how it works")}
            </a>
          </div>
        </div>
      </div>
      <div className="relative z-10 w-full bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-7 px-6 flex items-center gap-3 ${i < 3 ? "border-r border-white/10" : ""}`}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white leading-none">{s.num}</p>
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

/* ── Problem Section ─────────────────────────────────────── */
function Problem({ cm }: { cm: ContentMap }) {
  const problems = [
    {
      who: "For the Parent",
      icon: "👨‍👩‍👧",
      title: c(cm,"problem","p1_title","You want security. They say you don't understand them."),
      desc: c(cm,"problem","p1_desc","You've seen what happens when people follow passion without a plan. You're not the villain, you're the one who has to pay the fees. But they won't hear it."),
    },
    {
      who: "For the Teenager",
      icon: "🧑‍🎓",
      title: c(cm,"problem","p2_title","They know what they feel. They can't make you trust it."),
      desc: c(cm,"problem","p2_desc","Your child doesn't want to be forced into something they'll hate for 40 years. But they can't explain why to you without it turning into a fight. So they go quiet."),
    },
    {
      who: "For the Family",
      icon: "🔄",
      title: c(cm,"problem","p3_title","So nothing gets decided. And the deadline gets closer."),
      desc: c(cm,"problem","p3_desc","Class 10 results come. Class 12 comes. And you're still arguing. That's not a career problem, it's a communication problem with a career-shaped hole in the middle."),
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
            {c(cm,"problem","heading","The same argument. Every day. No resolution.")}
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed">
            {c(cm,"problem","subtext","It's not a failure of love. It's the absence of a shared framework, and that's exactly what I provide.")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {problems.map(p => (
            <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-[#7C3AED]/40 transition-colors">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{p.icon}</span>
                <span className="text-xs font-bold text-[#A78BFA] uppercase tracking-widest">{p.who}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3 leading-snug">{p.title}</h3>
              <p className="text-gray-400 text-sm leading-[1.75]">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <p className="text-[#A78BFA] font-semibold text-lg mb-6">
            {c(cm,"problem","pivot","This doesn't have to be how your family makes this decision.")}
          </p>
          <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold px-8 py-3.5 rounded-full transition-colors shadow-lg shadow-purple-900/40">
            {c(cm,"problem","cta","Book a Family Session")} <ArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── About (Guide) ──────────────────────────────────────── */
function About({ cm }: { cm: ContentMap }) {
  const credentials = [
    c(cm,"about","cred1","Certified Career Counsellor"),
    c(cm,"about","cred2","Certified Family Alignment Coach"),
    c(cm,"about","cred3","Psychometric Assessment Practitioner"),
    c(cm,"about","cred4","Deep expertise in Indian family dynamics & career frameworks"),
    c(cm,"about","cred5","Works with families in India and globally"),
  ];
  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block"/>
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Your Guide</span>
            </div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight mb-2">
              Meet {c(cm,"about","name","Jasmeet Singh")}
            </h2>
            <h2 className="text-[36px] md:text-[44px] font-extrabold leading-tight mb-6">
              <span className="text-[#7C3AED]">{c(cm,"about","title","Career Counsellor & Family Alignment Coach")}</span>
            </h2>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-4 max-w-md">
              {c(cm,"about","bio_1","Over years of working with ambitious Indian families, at home and across the globe, I kept seeing the same pattern: bright children, caring parents, and a conversation that kept going in circles. Not because anyone was wrong. But because no one had given the family a common language for this decision.")}
            </p>
            <p className="text-gray-600 text-[15px] leading-[1.8] mb-8 max-w-md">
              {c(cm,"about","bio_2","That gap, between what a child wants and what a family can trust, is exactly where I work. I combine certified psychometric tools, structured career frameworks, and deep experience with Indian family dynamics to guide sessions that are not just about which career to choose, but about how a family makes that choice together, without losing each other in the process.")}
            </p>
            <div className="flex flex-col gap-3 mb-10">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5"><CheckIcon/></span>
                  <span className="text-gray-700 text-sm">{cred}</span>
                </div>
              ))}
            </div>
            <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              {c(cm,"about","cta_text","Work With Jasmeet")}
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center ml-1"><ArrowRight size={13}/></span>
            </a>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            {/* Decorative background shape */}
            <div className="absolute -top-6 -right-6 w-72 h-[520px] rounded-3xl bg-[#F3EFFF]"/>
            {/* Main portrait */}
            <div className="relative w-72 h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={c(cm,"about","photo_1","/Z24A9117.jpg")}
                alt="Jasmeet Singh"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Credential badge, bottom left */}
            <div className="absolute bottom-6 -left-4 bg-[#7C3AED] rounded-2xl px-5 py-4 shadow-xl text-white z-10">
              <p className="text-3xl font-extrabold leading-none">{c(cm,"about","experience_years","800+")}</p>
              <p className="text-[11px] text-purple-200 mt-1 font-medium">Families Guided</p>
            </div>
            {/* Philosophy badge, top right */}
            <div className="absolute top-6 -right-4 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-10">
              <span className="text-xs font-semibold text-[#7C3AED] bg-[#7C3AED]/10 px-2.5 py-0.5 rounded-full inline-block mb-2">🌏 India & Global</span>
              <p className="font-extrabold text-gray-900 text-sm mb-1">{c(cm,"about","badge_text","Roots & Wings")}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Security of family support. Freedom to fly toward a life genuinely their own.</p>
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
      tag:   c(cm,"services","card1_date","Most Requested"),
      title: c(cm,"services","card1_title","Family Alignment Session"),
      desc:  c(cm,"services","card1_desc","90 minutes. Both parent and child in the room. You leave with a shortlist of careers you both agree on, backed by data, not guessing."),
      img:   c(cm,"services","card1_img","/Z24A9117.jpg"),
      dark:  true,
    },
    {
      tag:   c(cm,"services","card2_date","For Teenagers"),
      title: c(cm,"services","card2_title","Career Clarity Programme"),
      desc:  c(cm,"services","card2_desc","4 sessions for your child alone. Psychometric assessments, aptitude mapping, interest profiling. They discover what they're actually good at, including options most families never considered."),
      img:   c(cm,"services","card2_img","https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"),
      dark:  false,
    },
    {
      tag:   c(cm,"services","card3_date","For Parents"),
      title: c(cm,"services","card3_title","Parent Coaching Session"),
      desc:  c(cm,"services","card3_desc","60 minutes for you alone. Learn how to have this conversation without it becoming a fight. Understand your child's signals. Stop accidentally making it worse."),
      img:   c(cm,"services","card3_img","https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80"),
      dark:  false,
    },
    {
      tag:   c(cm,"services","card4_date","Ongoing"),
      title: c(cm,"services","card4_title","Continued Guidance"),
      desc:  c(cm,"services","card4_desc","Monthly support as things evolve. Stream selection after Class 10, college applications, peer pressure, entrance strategy. Stay aligned as the stakes get higher."),
      img:   c(cm,"services","card4_img","https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=600&q=80"),
      dark:  false,
    },
  ];
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block"/>
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">How I Work With You</span>
            </div>
            <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 leading-tight">
              Sessions Designed<br/><span className="text-[#7C3AED]">for the Whole Family</span>
            </h2>
          </div>
          <p className="text-gray-600 text-[15px] leading-relaxed max-w-xs">
            {c(cm,"services","subtext","Every session is built around your family's actual situation, not a generic checklist.")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {cards.map(s => (
            <div key={s.title} className={`rounded-2xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1.5 cursor-pointer shadow-sm hover:shadow-xl ${s.dark ? "bg-[#1A0A3E]" : "bg-white border border-gray-200"}`}>
              <div className="h-44 overflow-hidden relative">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover object-top"/>
                {s.dark && <div className="absolute inset-0 bg-[#1A0A3E]/40"/>}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className={`text-[11px] font-mono mb-3 block ${s.dark ? "text-purple-300" : "text-gray-400"}`}>{s.tag}</span>
                <h3 className={`font-bold text-sm leading-snug mb-2 ${s.dark ? "text-white" : "text-gray-900"}`}>{s.title}</h3>
                <p className={`text-xs leading-relaxed flex-1 ${s.dark ? "text-purple-200/80" : "text-gray-500"}`}>{s.desc}</p>
                <div className="mt-5 flex justify-end">
                  <button className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${s.dark ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white" : "bg-gray-100 hover:bg-[#7C3AED] hover:text-white text-gray-600"}`}><ArrowRight size={14}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold px-8 py-3.5 rounded-full transition-colors">
            {c(cm,"services","cta_text","Book a Free Clarity Call")} <ArrowRight size={14}/>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Process (The Plan) ─────────────────────────────────── */
function Process({ cm }: { cm: ContentMap }) {
  const [active, setActive] = useState(0);
  const steps = [
    {
      title: c(cm,"process","step1_title","Step 1: Listen. First session is entirely about hearing what both sides actually want, without judgment."),
      body:  c(cm,"process","step1_body","Before any advice is given, every voice in the family is heard. I create a structured space where the teenager feels safe to speak honestly, and the parents feel respected, not sidelined. Often, this alone shifts something."),
    },
    {
      title: c(cm,"process","step2_title","Step 2: Illuminate. Psychometric tools reveal what the child is genuinely suited for. Not what they said under pressure."),
      body:  c(cm,"process","step2_body","We use validated psychometric assessments to surface the teenager's natural strengths, personality, interests, and values. This gives the family objective data to build on, not just opinions and feelings."),
    },
    {
      title: c(cm,"process","step3_title","Step 3: Align. Structured facilitation brings parent and child to a common language and a shared decision."),
      body:  c(cm,"process","step3_body","With clarity on the table, we map real-world career pathways through the lens of both the child's strengths and the family's genuine concerns. We find the intersection, not the compromise."),
    },
    {
      title: c(cm,"process","step4_title","Step 4: Move. Concrete next steps. Which streams. Which colleges. Which entrance exams. A real plan."),
      body:  c(cm,"process","step4_body","Every family leaves with a concrete next step: a shortlist of aligned career directions, a preparation roadmap, and the shared language to continue the conversation without it becoming a conflict."),
    },
  ];
  return (
    <section id="how-it-works" className="py-28 bg-[#F3EFFF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-[36px] md:text-[44px] font-extrabold text-gray-900 leading-tight">
                {c(cm,"process","heading","Four steps. Zero guesswork.")}
              </h2>
              <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap">
                Get Started <ArrowRight size={12}/>
              </a>
            </div>
            <div className="flex flex-col gap-0">
              {steps.map((s, i) => (
                <div key={i} onClick={() => setActive(i)} className={`cursor-pointer border-b border-gray-200 ${i === 0 ? "border-t" : ""}`}>
                  <div className="flex items-center justify-between py-4 px-1">
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${active === i ? "bg-[#7C3AED] text-white" : "bg-gray-200 text-gray-500"}`}>{i + 1}</span>
                      <h3 className={`font-semibold text-[15px] ${active === i ? "text-gray-900" : "text-gray-500"}`}>{s.title}</h3>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all ${active === i ? "bg-[#7C3AED] text-white rotate-90" : "bg-white text-gray-400"}`}><ChevronRight/></div>
                  </div>
                  {active === i && (
                    <div className="pb-5 px-1 pl-10">
                      <p className="text-gray-600 text-sm leading-[1.75]">{s.body}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[480px]">
            <img src={c(cm,"process","photo","/Z24A8994 copy.jpg")} alt="Family coaching session" className="w-full h-full object-cover object-top"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent"/>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white font-bold text-lg leading-snug">
                {c(cm,"process","photo_caption","The goal isn't the perfect career answer. It's the ability to find it, as a family.")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Vision (Success & Stakes) ──────────────────────────── */
function Vision({ cm }: { cm: ContentMap }) {
  const successes = [
    { icon: "🤝", text: c(cm,"vision","s1","Your child wakes up knowing their direction, not paralysed by options.") },
    { icon: "🧭", text: c(cm,"vision","s2","You stop second-guessing the fees you are about to pay.") },
    { icon: "💬", text: c(cm,"vision","s3","The dinner table stops being a war zone.") },
    { icon: "🛡️", text: c(cm,"vision","s4","You find out there are careers you never knew existed that actually fit your child.") },
    { icon: "🌱", text: c(cm,"vision","s5","Your child stops hiding their interests from you.") },
    { icon: "✈️", text: c(cm,"vision","s6","You both stop dreading: 'So what are you going to do after school?'") },
  ];
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-gray-400 block"/>
              <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">What Success Looks Like</span>
            </div>
            <h2 className="text-[36px] md:text-[48px] font-extrabold text-gray-900 leading-tight mb-6">
              {c(cm,"vision","heading","What life looks like when the confusion ends.")}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {successes.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-[#F3EFFF] border border-[#7C3AED]/10">
                  <span className="text-2xl flex-shrink-0">{s.icon}</span>
                  <p className="text-gray-800 text-sm font-medium">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl overflow-hidden h-64 shadow-xl">
              <img
                src={c(cm,"vision","photo","https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80")}
                alt="Family aligned and happy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-[#0A0A10] rounded-2xl p-8 text-white">
              <p className="text-[#A78BFA] text-sm font-semibold mb-3 uppercase tracking-wide">
                {c(cm,"vision","warning_label","The cost of not having this conversation")}
              </p>
              <p className="text-gray-300 text-[15px] leading-[1.8]">
                {c(cm,"vision","warning_text","Every year in the wrong stream is a year of lost confidence, wasted coaching fees, and a child who learns to stop trusting themselves. The families who make this decision without a shared framework: someone always loses. It doesn't have to be that way.")}
              </p>
              <a href="https://forms.gle/y86zr3dJxsgLQZC89" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 text-[#A78BFA] font-bold text-sm hover:text-white transition-colors">
                Start the right conversation <ArrowRight size={14}/>
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
  const caption  = c(cm,"video","caption","See What Happens When Families Find Their Common Language");
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
                <button
                  onClick={() => embedUrl ? setShowEmbed(true) : undefined}
                  className="w-[72px] h-[72px] bg-[#7C3AED]/90 hover:bg-[#7C3AED] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                >
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="white"><path d="M5 3l14 9-14 9V3z"/></svg>
                </button>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-bold text-xl md:text-2xl">{caption}</p>
                <p className="text-gray-300 text-sm mt-1">Live sessions, keynotes, family stories &amp; insights</p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}


/* ── Testimonials ───────────────────────────────────────── */
function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border-2 border-white shadow-sm ${color}`}>
      {initials}
    </div>
  );
}

function Testimonials({ cm }: { cm: ContentMap }) {
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState(0);

  const testimonials = [
    {
      quote: "My experience with Mr. Jasmeet Singh Chandok has been very positive and insightful. His guidance helped me gain a better understanding of my interests, strengths, and future possibilities. He encouraged me to think critically, explore different options, and make conscious and informed decisions about my future. I especially appreciated his patient and thoughtful approach. Through his guidance, I have developed greater clarity about my academic and career interests.",
      initials: "J",
      color: "bg-purple-500",
      name: "J., Student",
      role: "Class 12, Punjab",
      screenshot: "/reviews/review-1.jpg",
    },
    {
      quote: "I was extremely confused about my career path and couldn't decide which field to pursue. Through sir's guidance, I could gain clarity about my interests and goals which made my decision making process much easier. The test helped me understand various dimensions of my personality which is very insightful. Sir was extremely professional, polite and approachable. He was genuinely invested in helping me.",
      initials: "S",
      color: "bg-rose-500",
      name: "S., Student",
      role: "NEET Aspirant",
      screenshot: "/reviews/review-2.jpg",
    },
    {
      quote: "I must say you are truly an expert! The in-depth and detailed info you have forwarded takes a lot of time, efforts and experience to understand. This I can say out of my own experience. Kudos!",
      initials: "R",
      color: "bg-amber-500",
      name: "R., Parent",
      role: "Workshop Attendee",
      screenshot: "/reviews/review-3.jpg",
    },
    {
      quote: "Jasmeet ji, it was a wonderful workshop with insider secrets, useful tips and strategies for success. The mindset part was the icing on the cake. I was highly motivated and inspired by your workshop and signing up for your mentorship program was a no brainer. You rock!!! Looking forward to great results under your able guidance.",
      initials: "RW",
      color: "bg-teal-500",
      name: "R.W.",
      role: "Workshop Attendee",
      screenshot: "/reviews/review-3.jpg",
    },
    {
      quote: "Thank you for taking out the time to speak with me today. Our conversation was really helpful and cleared many of the doubts I had regarding my career. I appreciate how you explained the importance of combining a B.Com degree with high-demand skills. Thank you sir.",
      initials: "A",
      color: "bg-blue-500",
      name: "A., Student",
      role: "B.Com Aspirant",
      screenshot: "/reviews/review-4.jpg",
    },
    {
      quote: "Sir it was a great experience to have you as a mentor. Thank you sir.",
      initials: "G",
      color: "bg-green-500",
      name: "G., Student",
      role: "Career Clarity Session",
      screenshot: "/reviews/review-3.jpg",
    },
  ];

  const screenshots = [
    { src: "/reviews/review-1.jpg", label: "Japleen's review" },
    { src: "/reviews/review-2.jpg", label: "Seerat's review" },
    { src: "/reviews/review-3.jpg", label: "Workshop reviews" },
    { src: "/reviews/review-4.jpg", label: "Career call review" },
  ];

  return (
    <section id="success-stories" className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-gray-400 block"/>
            <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Real Stories</span>
            <span className="w-8 h-px bg-gray-400 block"/>
          </div>
          <h2 className="text-[40px] md:text-5xl font-extrabold text-gray-900 mb-4">
            Students Who Found <span className="text-[#7C3AED]">Their Direction.</span>
          </h2>
          <p className="text-gray-500 text-[15px] max-w-sm mx-auto leading-relaxed">
            Real messages from students and families, shared with permission. Names withheld for privacy.
          </p>
        </div>

        {/* Testimonial grid — first 3 visible */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={i} className="rounded-2xl p-7 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-[64px] leading-none text-gray-200 font-serif mb-2 -mt-3 -ml-1">&ldquo;</div>
              <p className="text-gray-700 text-sm leading-[1.75] mb-6 -mt-4">{t.quote}</p>
              <div className="flex items-center gap-3">
                <Avatar initials={t.initials} color={t.color} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, si) => <StarFilled key={si}/>)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row — last 3 visible */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {testimonials.slice(3).map((t, i) => (
            <div key={i} className="rounded-2xl p-7 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-[64px] leading-none text-gray-200 font-serif mb-2 -mt-3 -ml-1">&ldquo;</div>
              <p className="text-gray-700 text-sm leading-[1.75] mb-6 -mt-4">{t.quote}</p>
              <div className="flex items-center gap-3">
                <Avatar initials={t.initials} color={t.color} />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, si) => <StarFilled key={si}/>)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Screenshots button */}
        <div className="text-center">
          <button
            onClick={() => { setModalImg(0); setShowModal(true); }}
            className="inline-flex items-center gap-2.5 border-2 border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            View Original Messages
          </button>
        </div>
      </div>

      {/* Screenshot lightbox modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">Verified Reviews</p>
                <p className="text-xs text-gray-500">Names & numbers hidden for privacy</p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Screenshot */}
            <div className="relative bg-gray-50 flex items-center justify-center" style={{ minHeight: 420 }}>
              <img
                src={screenshots[modalImg].src}
                alt={screenshots[modalImg].label}
                className="w-full object-contain max-h-[60vh]"
                style={{ filter: "blur(0px)" }}
              />
              {/* Privacy overlay — blurs top area with phone numbers */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md flex items-center justify-center">
                <span className="text-xs text-gray-400 font-medium tracking-wide">Contact details hidden</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setModalImg(i => Math.max(0, i - 1))}
                disabled={modalImg === 0}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#7C3AED] disabled:opacity-30 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                Previous
              </button>
              <div className="flex gap-1.5">
                {screenshots.map((_, i) => (
                  <button key={i} onClick={() => setModalImg(i)} className={`rounded-full transition-all ${modalImg === i ? "w-5 h-2 bg-[#7C3AED]" : "w-2 h-2 bg-gray-200 hover:bg-gray-300"}`}/>
                ))}
              </div>
              <button
                onClick={() => setModalImg(i => Math.min(screenshots.length - 1, i + 1))}
                disabled={modalImg === screenshots.length - 1}
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-[#7C3AED] disabled:opacity-30 transition-colors"
              >
                Next
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Contact ─────────────────────────────────────────────── */
function Contact({ cm }: { cm: ContentMap }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [submittedName, setSubmittedName] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "clarity_call",
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          source_url: window.location.href,
        }),
      });
      if (res.ok) {
        setSubmittedName(form.name.split(" ")[0]);
        setStatus("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch { setStatus("error"); }
  };

  return (
    <section id="contact" className="py-28 bg-[#0A0A10] relative overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-3xl"/>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="w-8 h-px bg-gray-700 block"/>
            <span className="text-xs font-semibold text-gray-500 tracking-[0.2em] uppercase">Start the Conversation</span>
            <span className="w-8 h-px bg-gray-700 block"/>
          </div>
          <h2 className="text-[40px] md:text-5xl font-extrabold text-white leading-tight mb-5">
            Ready to <span className="text-[#8B5CF6]">Find Your Family&apos;s Direction?</span>
          </h2>
          <p className="text-gray-400 text-[15px] leading-relaxed max-w-lg mx-auto">
            Book a free 30-minute clarity call. No pressure. Just an honest conversation about where your family is right now.
          </p>
        </div>

        {status === "success" ? (
          /* ─── Thank You State ─── */
          <div className="max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center shadow-2xl">
              {/* Animated checkmark */}
              <div className="w-20 h-20 rounded-full bg-[#7C3AED]/20 border-2 border-[#7C3AED]/40 flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-2">
                Thank you, {submittedName || "friend"}!
              </h3>
              <p className="text-[#A78BFA] font-semibold text-sm mb-6">Your message has been received.</p>

              <div className="bg-white/5 rounded-2xl p-5 mb-7 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#A78BFA] text-xs font-bold">1</span>
                  <p className="text-gray-300 text-sm leading-relaxed">Jasmeet personally reviews every enquiry and will reach out within <strong className="text-white">24 hours</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#A78BFA] text-xs font-bold">2</span>
                  <p className="text-gray-300 text-sm leading-relaxed">You will receive a calendar link to pick a time that works for you.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#A78BFA] text-xs font-bold">3</span>
                  <p className="text-gray-300 text-sm leading-relaxed">The first call is completely free. No commitment, no pressure.</p>
                </div>
              </div>

              <p className="text-gray-500 text-xs mb-7">
                In the meantime, feel free to check out Jasmeet&apos;s work on LinkedIn or Instagram.
              </p>

              <div className="flex items-center justify-center gap-3 mb-7">
                <a href="https://www.linkedin.com/in/jasmeetchandhok" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-[#0077B5]/20 border border-white/10 hover:border-[#0077B5]/40 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
                  <LinkedInIcon/> LinkedIn
                </a>
                <a href="https://www.instagram.com/jasmeetchandhok.ai" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/30 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all">
                  <InstagramIcon/> Instagram
                </a>
              </div>

              <button onClick={() => setStatus("idle")} className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                Send another message
              </button>
            </div>
          </div>
        ) : (
          /* ─── Form ─── */
          <div className="max-w-lg mx-auto">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                      placeholder="Priya Sharma"
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"/>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Phone / WhatsApp</label>
                    <input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                      placeholder="+91 98765 43210"
                      className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder="priya@example.com"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">What&apos;s the situation?</label>
                  <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                    placeholder="Which class is your child in, and what's the disagreement or confusion about their career?"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#7C3AED] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"/>
                </div>
                {status === "error" && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    Something went wrong. Please try again or WhatsApp us directly.
                  </p>
                )}
                <button type="submit" disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-4 rounded-xl transition-colors mt-1 disabled:opacity-60 shadow-lg shadow-purple-900/30">
                  {status === "loading"
                    ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Sending...</span>
                    : <><ArrowRight size={16}/>Request My Free Clarity Call</>
                  }
                </button>
                <p className="text-center text-gray-600 text-xs pt-1">
                  Free call. No obligation. Jasmeet reads every message personally.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────── */
function Footer({ cm }: { cm: ContentMap }) {
  const links = ["Home","About","How It Works","Success Stories"];
  return (
    <footer className="bg-white relative overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-gray-100">
          <div className="flex flex-col gap-5">
            <a href="#home"><img src="/jc.png" alt="Jasmeet Singh" className="h-10 w-auto object-contain"/></a>
            <div className="flex flex-wrap gap-6">
              {links.map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(/ /g,"-")}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${c(cm,"footer","email","hello@jasmeetchandhok.com")}`} className="text-sm text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1.5">
              ✉ {c(cm,"footer","email","hello@jasmeetchandhok.com")}
            </a>
            <div className="flex gap-2">
              {[
                { icon: <LinkedInIcon/>,  href: c(cm,"footer","linkedin_url","https://www.linkedin.com/in/jasmeetchandhok") },
                { icon: <InstagramIcon/>, href: c(cm,"footer","instagram_url","https://www.instagram.com/jasmeetchandhok.ai") },
                { icon: <FacebookIcon/>,  href: c(cm,"footer","facebook_url","#") },
                { icon: <TwitterIcon/>,   href: c(cm,"footer","twitter_url","#") },
              ].map((s, i) => (
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

/* ── WhatsApp Widget ────────────────────────────────────── */
const WA_NUMBER = "919818244818";

function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "WhatsApp Widget",
          name: form.name,
          email: form.email,
          message: form.message,
          notify_email: "support@jasmeetchandhok.com",
          source_url: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      setStatus("done");
      const text = encodeURIComponent(
        `Hi Jasmeet! I'm ${form.name}.\n\n${form.message}`
      );
      setTimeout(() => {
        window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
      }, 800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup card */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#25D366] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.286a.75.75 0 00.921.921l5.437-1.475A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 01-4.952-1.356l-.355-.212-3.676.997.977-3.566-.232-.367A9.715 9.715 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Chat with Jasmeet</p>
                <p className="text-white/80 text-[11px]">Typically replies within a few hours</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors text-lg leading-none">✕</button>
          </div>

          {/* Body */}
          <div className="p-4">
            {status === "done" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">Message sent!</p>
                <p className="text-gray-500 text-xs">Opening WhatsApp now...</p>
              </div>
            ) : (
              <>
                <p className="text-gray-500 text-xs mb-3">Leave your details and we'll open WhatsApp for you.</p>
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  <input
                    required
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#25D366] transition-colors placeholder-gray-400"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#25D366] transition-colors placeholder-gray-400"
                  />
                  <textarea
                    required
                    rows={3}
                    placeholder="What would you like to discuss?"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#25D366] transition-colors placeholder-gray-400 resize-none"
                  />
                  {status === "error" && (
                    <p className="text-red-500 text-xs">Something went wrong. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.286a.75.75 0 00.921.921l5.437-1.475A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 01-4.952-1.356l-.355-.212-3.676.997.977-3.566-.232-.367A9.715 9.715 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg> Send & Open WhatsApp</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.286a.75.75 0 00.921.921l5.437-1.475A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 01-4.952-1.356l-.355-.212-3.676.997.977-3.566-.232-.367A9.715 9.715 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
        </svg>
      </button>
    </div>
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
      <Problem cm={cm}/>
      <About cm={cm}/>
      <Services cm={cm}/>
      <Process cm={cm}/>
      <Vision cm={cm}/>
      <VideoSection cm={cm}/>
      <Testimonials cm={cm}/>
      <Contact cm={cm}/>
      <Footer cm={cm}/>
      <WhatsAppWidget/>
    </>
  );
}
