import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
  Activity, Clock, FileText, Smartphone, Users, Zap,
  ShieldCheck, Heart, Brain, Bone, Baby, Eye, Ear,
  ChevronRight, Star, Phone, Github, Linkedin, Mail,
  ArrowRight, CheckCircle, Stethoscope, Pill, Calendar,
  BarChart2, Lock, Wifi, AlertCircle, UserCheck, ClipboardList
} from 'lucide-react';

/* ─── Animated Counter ─── */
const Counter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── ECG/Heartbeat SVG ─── */
const ECGLine = () => (
  <svg viewBox="0 0 600 80" style={{ width: '100%', height: '80px', overflow: 'visible' }}>
    <defs>
      <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
        <stop offset="30%" stopColor="#6366f1" stopOpacity="1" />
        <stop offset="70%" stopColor="#06b6d4" stopOpacity="1" />
        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
      </linearGradient>
    </defs>
    <motion.path
      d="M0,40 L80,40 L100,40 L110,10 L120,70 L130,5 L140,75 L150,40 L180,40 L220,40 L240,40 L250,20 L260,60 L270,15 L280,65 L290,40 L320,40 L380,40 L400,40 L410,15 L420,65 L430,10 L440,70 L450,40 L480,40 L520,40 L600,40"
      fill="none"
      stroke="url(#ecgGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
);

/* ─── Floating Badge ─── */
const FloatingBadge = ({ icon: Icon, label, value, color, delay, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
    transition={{ delay, duration: 0.5, y: { repeat: Infinity, duration: 3, ease: 'easeInOut', delay } }}
    style={{
      background: 'rgba(15,23,42,0.9)',
      border: `1px solid ${color}40`,
      borderRadius: '14px',
      padding: '12px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: `0 8px 32px ${color}20`,
      backdropFilter: 'blur(12px)',
      position: 'absolute',
      zIndex: 10,
      ...style,
    }}
  >
    <div style={{ width: 36, height: 36, borderRadius: '10px', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: 0, fontSize: '15px', color: '#f1f5f9', fontWeight: 700 }}>{value}</p>
    </div>
  </motion.div>
);

const Landing = () => {
  useEffect(() => {
    document.title = 'MediQueue AI | Smart Hospital Management';
    const style = document.createElement('style');
    style.id = 'landing-css';
    style.textContent = `
      .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
      .dept-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 1rem; }
      .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
      .testimonials-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
      .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; text-align:center; }
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; }
      @media(max-width:1100px){
        .features-grid{grid-template-columns:repeat(2,1fr);}
        .dept-grid{grid-template-columns:repeat(3,1fr);}
        .footer-grid{grid-template-columns:1fr 1fr;}
        .stats-grid{grid-template-columns:repeat(2,1fr);}
        .testimonials-grid{grid-template-columns:repeat(2,1fr);}
        .steps-grid{grid-template-columns:1fr;}
      }
      @media(max-width:640px){
        .features-grid{grid-template-columns:1fr;}
        .dept-grid{grid-template-columns:repeat(2,1fr);}
        .footer-grid{grid-template-columns:1fr;}
        .stats-grid{grid-template-columns:repeat(2,1fr);}
        .testimonials-grid{grid-template-columns:1fr;}
      }
      .dept-card:hover { border-color: rgba(99,102,241,0.6) !important; transform: translateY(-4px); background: rgba(99,102,241,0.1) !important; }
      .dept-card { transition: all 0.25s ease; }
      .nav-link { color: #94a3b8; text-decoration:none; font-size:0.9rem; font-weight:500; transition:color 0.2s; }
      .nav-link:hover { color: #f1f5f9; }
      .footer-link { color: #64748b; text-decoration:none; font-size:0.875rem; transition:color 0.2s; display:flex; align-items:center; gap:6px; }
      .footer-link:hover { color: #a5b4fc; }
      .social-btn { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background:rgba(99,102,241,0.1); border:1px solid rgba(99,102,241,0.2); color:#a5b4fc; text-decoration:none; transition:all 0.2s; }
      .social-btn:hover { background:rgba(99,102,241,0.25); transform:translateY(-2px); }
      .pulse-dot { width:10px; height:10px; border-radius:50%; background:#10b981; display:inline-block; animation: pulseDot 2s infinite; }
      @keyframes pulseDot { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.5);} 50%{box-shadow:0 0 0 8px rgba(16,185,129,0);} }
      .step-connector { position:absolute; top:30px; left:calc(50% + 40px); width:calc(100% - 80px); height:2px; background:linear-gradient(90deg,#6366f1,#06b6d4); z-index:0; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('landing-css')?.remove();
  }, []);

  const features = [
    { icon: Clock,        title: 'Real-time OPD Queue',      desc: 'Live token tracking with estimated wait time. Patients know exactly when their turn comes.', color: '#6366f1' },
    { icon: Activity,     title: 'AI Symptom Triage',        desc: 'Gemini AI analyzes symptoms, assigns urgency level and routes patients to the right department.', color: '#06b6d4' },
    { icon: FileText,     title: 'Digital EMR System',       desc: 'Complete electronic medical records — prescriptions, lab reports, history — all in one place.', color: '#10b981' },
    { icon: Zap,          title: 'Auto Billing & GST',       desc: 'Instant itemized bill generation with GST compliance. Cash, card, UPI & insurance support.', color: '#f59e0b' },
    { icon: BarChart2,    title: 'Admin Analytics',          desc: 'Department-wise revenue, patient flow heatmaps, and doctor performance dashboards.', color: '#8b5cf6' },
    { icon: Lock,         title: 'HIPAA Grade Security',     desc: 'AES-256 encryption, JWT auth, role-based access. Your patient data is fully protected.', color: '#ef4444' },
  ];

  const departments = [
    { icon: Heart,       name: 'Cardiology',     color: '#ef4444' },
    { icon: Brain,       name: 'Neurology',      color: '#8b5cf6' },
    { icon: Bone,        name: 'Orthopedics',    color: '#f59e0b' },
    { icon: Baby,        name: 'Pediatrics',     color: '#06b6d4' },
    { icon: Eye,         name: 'Ophthalmology',  color: '#10b981' },
    { icon: Ear,         name: 'ENT',            color: '#6366f1' },
    { icon: Stethoscope, name: 'General OPD',    color: '#94a3b8' },
    { icon: Pill,        name: 'Dermatology',    color: '#f97316' },
    { icon: Users,       name: 'Gynecology',     color: '#ec4899' },
    { icon: Brain,       name: 'Psychiatry',     color: '#14b8a6' },
  ];

  const steps = [
    { step: '01', icon: UserCheck,    title: 'Register & Login',      desc: 'Patient creates an account in 60 seconds. Doctors are verified by the hospital admin before activation.' },
    { step: '02', icon: Calendar,     title: 'Book Appointment',      desc: 'Choose department → pick a doctor → select available slot → describe symptoms. AI assigns urgency.' },
    { step: '03', icon: ClipboardList,title: 'Consult & Get Rx',      desc: 'Doctor sees live queue, calls patient, writes digital prescription with AI assistance. Bill auto-generated.' },
  ];

  const testimonials = [
    { name: 'Dr. Priya Sharma', role: 'Cardiologist, AIIMS Delhi', rating: 5, text: 'MediQueue AI has completely transformed our OPD workflow. The AI prescription assistant saves me 15 minutes per patient. Absolutely game-changing.' },
    { name: 'Rajesh Kumar', role: 'Patient, Delhi', rating: 5, text: 'No more standing in line for 3 hours! I can see my exact token position on my phone and arrive just in time. My prescription is digital and always with me.' },
    { name: 'Dr. Arjun Mehta', role: 'Hospital Admin, Fortis', rating: 5, text: 'The analytics dashboard gives us real-time visibility into every department. Revenue tracking and doctor performance metrics are exactly what we needed.' },
  ];

  const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f172a' }}>

      {/* ── NAVBAR ── */}
      <nav className="glass" style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 200, borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={20} color="white" />
          </div>
          <span className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800 }}>MediQueue AI</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <a href="#features" className="nav-link">Features</a>
          <a href="#departments" className="nav-link">Departments</a>
          <a href="#how-it-works" className="nav-link">How It Works</a>
          <a href="#testimonials" className="nav-link">Reviews</a>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.6rem 1.4rem' }}>Login</Link>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem' }}>Get Started Free</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '6rem 3rem 4rem', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 60% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(6,182,212,0.08) 0%, transparent 50%)' }}>
        {/* grid dots bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(99,102,241,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px', zIndex: 0 }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <motion.div {...fadeUp}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '100px', padding: '6px 16px', marginBottom: '2rem' }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 600 }}>AI-Powered · Real-time · HIPAA Compliant</span>
            </div>

            <h1 style={{ fontSize: '3.6rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem' }}>
              India's Smartest<br />
              <span className="gradient-text">Hospital Management</span><br />
              Platform
            </h1>

            <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '520px' }}>
              Digitize your entire OPD workflow — from patient registration to prescription — with real-time queue tracking, Google Gemini AI triage, and one-click digital EMR.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                View Live Demo
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              {[{ label: 'Setup Time', value: '< 10 mins' }, { label: 'Uptime SLA', value: '99.9%' }, { label: 'Support', value: '24/7 AI' }].map((item, i) => (
                <div key={i}>
                  <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>{item.value}</p>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Dashboard Preview Card */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ position: 'relative' }}>
            {/* Floating badges */}
            <FloatingBadge icon={Activity} label="Live Heartrate" value="72 BPM" color="#ef4444" delay={0.5} style={{ top: '-20px', left: '-20px' }} />
            <FloatingBadge icon={Users}    label="Queue Today"  value="148 Patients" color="#6366f1" delay={0.8} style={{ bottom: '60px', right: '-24px' }} />
            <FloatingBadge icon={CheckCircle} label="AI Triage" value="Emergency ↑3" color="#10b981" delay={1.1} style={{ bottom: '-10px', left: '10px' }} />

            {/* Main card */}
            <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              {/* Card header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>OPD Live Dashboard</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>General Medicine — Dr. Sharma</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '100px', padding: '4px 12px' }}>
                  <span className="pulse-dot" style={{ width: 7, height: 7 }} />
                  <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>LIVE</span>
                </div>
              </div>

              {/* ECG Line */}
              <div style={{ background: 'rgba(6,182,212,0.04)', borderRadius: '12px', padding: '8px 12px', marginBottom: '1.2rem', border: '1px solid rgba(6,182,212,0.1)' }}>
                <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>PATIENT VITALS MONITOR</p>
                <ECGLine />
              </div>

              {/* Token queue preview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.2rem' }}>
                {[
                  { token: '#23', name: 'Arjun K.', dept: 'Cardiology', status: 'Calling', color: '#10b981' },
                  { token: '#24', name: 'Priya M.', dept: 'General',    status: 'Waiting', color: '#f59e0b' },
                  { token: '#25', name: 'Rahul S.', dept: 'Neurology',  status: 'Waiting', color: '#6366f1' },
                ].map((t, i) => (
                  <div key={i} style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '10px', padding: '0.75rem', border: `1px solid ${t.color}30` }}>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: t.color }}>{t.token}</p>
                    <p style={{ margin: '2px 0', fontSize: '11px', color: '#f1f5f9', fontWeight: 600 }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>{t.dept}</p>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: t.color }}>{t.status}</span>
                  </div>
                ))}
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                {[
                  { label: 'Avg Wait',    value: '8 min',  icon: Clock },
                  { label: 'Completed',  value: '47',     icon: CheckCircle },
                  { label: 'Revenue',    value: '₹18.4K', icon: Zap },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '10px', padding: '0.6rem 0.75rem', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#a5b4fc' }}>{s.value}</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#64748b' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ANIMATED STATS BAR ── */}
      <section style={{ background: 'rgba(99,102,241,0.06)', borderTop: '1px solid rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.15)', padding: '3rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="stats-grid">
            {[
              { value: 10000, suffix: '+', label: 'Patients Served',  sub: 'across all hospitals',  color: '#6366f1' },
              { value: 500,   suffix: '+', label: 'Expert Doctors',   sub: 'verified & approved',   color: '#06b6d4' },
              { value: 50,    suffix: '+', label: 'Partner Hospitals', sub: 'clinics & chains',      color: '#10b981' },
              { value: 99,    suffix: '.9%',label: 'System Uptime',   sub: 'guaranteed SLA',        color: '#f59e0b' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.12 }} style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '3rem', fontWeight: 900, background: `linear-gradient(135deg, ${s.color}, #f1f5f9)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </p>
                <p style={{ margin: '4px 0 2px', fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>{s.label}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '6rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '1rem' }}>
            <Wifi size={14} color="#06b6d4" />
            <span style={{ fontSize: '13px', color: '#06b6d4', fontWeight: 600 }}>Workflow</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>How MediQueue Works</h2>
          <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>From registration to prescription — everything in 3 seamless steps.</p>
        </motion.div>

        <div className="steps-grid" style={{ position: 'relative' }}>
          {steps.map((step, i) => (
            <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }} style={{ position: 'relative', zIndex: 1 }}>
              <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', height: '100%' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(6,182,212,0.2))', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <step.icon size={30} color="#a5b4fc" />
                </div>
                <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.75rem' }}>{step.step}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f1f5f9' }}>{step.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.65, fontSize: '0.9rem' }}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', top: '50px', right: '-2rem', zIndex: 2, display: 'flex', alignItems: 'center' }}>
                  <ChevronRight size={28} color="rgba(99,102,241,0.5)" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '6rem 3rem', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.05) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '1rem' }}>
              <Zap size={14} color="#6366f1" />
              <span style={{ fontSize: '13px', color: '#a5b4fc', fontWeight: 600 }}>Platform Features</span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Intelligent Features Built for Healthcare</h2>
            <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto' }}>Enterprise-grade tools that make your hospital smarter, faster, and patient-friendly.</p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.1 }} className="glass-card" whileHover={{ translateY: -8, boxShadow: `0 24px 48px ${f.color}18` }} style={{ padding: '2rem', cursor: 'default' }}>
                <div style={{ width: '54px', height: '54px', borderRadius: '14px', background: `${f.color}15`, border: `1px solid ${f.color}30`, color: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <f.icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f1f5f9' }}>{f.title}</h3>
                <p className="text-muted" style={{ lineHeight: 1.65, fontSize: '0.875rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section id="departments" style={{ padding: '5rem 3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>10 Specializations Covered</h2>
            <p className="text-muted">All major medical departments — one unified platform.</p>
          </motion.div>
          <div className="dept-grid">
            {departments.map((d, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.07 }} className="dept-card glass-card" style={{ padding: '1.5rem 1rem', textAlign: 'center', borderRadius: '16px', cursor: 'default' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${d.color}15`, border: `1px solid ${d.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                  <d.icon size={22} color={d.color} />
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>{d.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" style={{ padding: '6rem 3rem', background: 'rgba(99,102,241,0.04)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Trusted by Doctors & Patients</h2>
            <p className="text-muted">Real experiences from healthcare professionals and patients.</p>
          </motion.div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.15 }} className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.25rem' }}>
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#f1f5f9' }}>{t.name}</p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY CTA BANNER ── */}
      <section style={{ padding: '3rem', background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))', borderTop: '1px solid rgba(239,68,68,0.2)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulseDot 1.5s infinite' }}>
              <AlertCircle size={28} color="#ef4444" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f1f5f9' }}>Medical Emergency?</p>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>Use the AI Symptom Checker for instant triage — it routes you to the right emergency unit.</p>
            </div>
          </div>
          <Link to="/register" className="btn btn-danger" style={{ padding: '0.85rem 2rem', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} /> Use AI Triage Now
          </Link>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: '7rem 3rem', textAlign: 'center', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 65%)' }}>
        <motion.div {...fadeUp}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.25rem' }}>
            Ready to Transform Your <span className="gradient-text">Hospital?</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Join 50+ hospitals already using MediQueue AI. Free trial. No credit card needed. Setup in under 10 minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
              Start Free Trial <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.05rem' }}>
              View Live Demo
            </Link>
          </div>
          <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#475569' }}>
            ✓ No credit card &nbsp;·&nbsp; ✓ Free forever for small clinics &nbsp;·&nbsp; ✓ Cancel anytime
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#080e1a', borderTop: '1px solid rgba(99,102,241,0.15)', padding: '4rem 3rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ marginBottom: '3rem' }}>

            {/* Brand + Developer Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg,#6366f1,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart size={18} color="white" />
                </div>
                <span className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 800 }}>MediQueue AI</span>
              </div>
              <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '260px' }}>
                AI-powered hospital management system solving India's healthcare digitization challenge.
              </p>

              {/* Developer card */}
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 4px', fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Built by Developer</p>
                <p style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9' }}>Amardeep Dixit</p>
                <a href="tel:+916307879282" className="footer-link" style={{ marginBottom: '6px', display: 'flex' }}>
                  <Phone size={13} /> +91 63078 79282
                </a>
              </div>

              {/* Social links */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href="https://github.com/amardixit07" target="_blank" rel="noreferrer" className="social-btn" title="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://www.linkedin.com/in/amardeep-dixit-612669283/" target="_blank" rel="noreferrer" className="social-btn" title="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="mailto:amardixit07@gmail.com" className="social-btn" title="Email">
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Product links */}
            <div>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Product</p>
              {['Patient Portal', 'Doctor Portal', 'Admin Dashboard', 'AI Symptom Checker', 'Live Queue Tracker', 'Digital Prescriptions'].map(l => (
                <Link key={l} to="/login" className="footer-link" style={{ display: 'block', marginBottom: '0.75rem' }}>
                  <ChevronRight size={13} /> {l}
                </Link>
              ))}
            </div>

            {/* Departments */}
            <div>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Departments</p>
              {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General OPD'].map(d => (
                <p key={d} className="footer-link" style={{ marginBottom: '0.75rem', cursor: 'default', display: 'block' }}>
                  <ChevronRight size={13} /> {d}
                </p>
              ))}
            </div>

            {/* Trust & Security */}
            <div>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>Trust & Security</p>
              {[
                { icon: ShieldCheck, text: 'HIPAA Compliant' },
                { icon: Lock,        text: 'AES-256 Encryption' },
                { icon: Wifi,        text: '99.9% Uptime SLA' },
                { icon: CheckCircle, text: 'JWT Auth + RBAC' },
                { icon: Activity,    text: 'Gemini AI Powered' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.85rem' }}>
                  <item.icon size={15} color="#6366f1" />
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.85rem' }}>
              © 2026 MediQueue AI · Developed by <span style={{ color: '#a5b4fc', fontWeight: 600 }}>Amardeep Dixit</span> · All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {['Privacy Policy', 'Terms of Service', 'HIPAA Notice'].map(l => (
                <a key={l} href="#" style={{ color: '#334155', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                   onMouseOver={e => e.target.style.color = '#a5b4fc'}
                   onMouseOut={e => e.target.style.color = '#334155'}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
