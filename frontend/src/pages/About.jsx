import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '⚡', title: 'Real-Time Bidding',   desc: 'Live auction updates via Socket.io — every bid reflects instantly for all participants.' },
  { icon: '🔒', title: 'Secure Payments',     desc: 'Card validation and a transparent ₹2 site fee. No hidden charges, ever.' },
  { icon: '❤️', title: 'Wishlist',            desc: 'Save items you love. Auto-cleaned when auctions close or items sell.' },
  { icon: '📦', title: '15 Categories',       desc: 'From kicks and grails to studio gear and kitchen finds — everything has a home.' },
  { icon: '🔔', title: 'Smart Notifications', desc: 'Get alerted when you\'re outbid, win an auction, or a watched item closes.' },
  { icon: '📊', title: 'Admin Analytics',     desc: 'Full click tracking, sales reports, and profit dashboards for platform admins.' },
];

/* Realistic SVG gavel */
const GavelSVG = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="gavel-svg">
    <defs>
      <linearGradient id="headTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b0b8c1"/>
        <stop offset="40%" stopColor="#78909c"/>
        <stop offset="100%" stopColor="#37474f"/>
      </linearGradient>
      <linearGradient id="headSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#546e7a"/>
        <stop offset="50%" stopColor="#90a4ae"/>
        <stop offset="100%" stopColor="#37474f"/>
      </linearGradient>
      <linearGradient id="handle" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5d3a1a"/>
        <stop offset="40%" stopColor="#a0522d"/>
        <stop offset="70%" stopColor="#cd853f"/>
        <stop offset="100%" stopColor="#8b4513"/>
      </linearGradient>
      <linearGradient id="band" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1a1a1a"/>
        <stop offset="50%" stopColor="#444"/>
        <stop offset="100%" stopColor="#1a1a1a"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="4" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
      </filter>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Handle */}
    <rect x="95" y="90" width="18" height="88" rx="5" fill="url(#handle)" filter="url(#shadow)"/>
    {/* Handle grain lines */}
    <line x1="99" y1="95" x2="99" y2="175" stroke="#7a3b10" strokeWidth="1" opacity="0.4"/>
    <line x1="107" y1="95" x2="107" y2="175" stroke="#c8722a" strokeWidth="0.8" opacity="0.3"/>
    {/* Rubber grip band */}
    <rect x="94" y="155" width="20" height="14" rx="3" fill="url(#band)"/>
    <rect x="94" y="158" width="20" height="2" rx="1" fill="#666" opacity="0.5"/>
    <rect x="94" y="163" width="20" height="2" rx="1" fill="#666" opacity="0.5"/>
    {/* Head — face (front) */}
    <rect x="52" y="52" width="104" height="52" rx="6" fill="url(#headSide)" filter="url(#shadow)"/>
    {/* Head — top bevel */}
    <rect x="55" y="52" width="98" height="10" rx="4" fill="url(#headTop)" opacity="0.9"/>
    {/* Head — bottom bevel */}
    <rect x="55" y="88" width="98" height="10" rx="4" fill="#263238" opacity="0.6"/>
    {/* Strike face highlight */}
    <rect x="52" y="56" width="12" height="44" rx="3" fill="#b0bec5" opacity="0.7"/>
    <rect x="144" y="56" width="12" height="44" rx="3" fill="#263238" opacity="0.5"/>
    {/* Engraved line */}
    <rect x="52" y="76" width="104" height="3" rx="1" fill="#263238" opacity="0.35"/>
    {/* Shine streak */}
    <rect x="70" y="57" width="4" height="38" rx="2" fill="white" opacity="0.18"/>
  </svg>
);

const About = () => {
  const [phase, setPhase] = useState('swing'); // swing | impact | reveal

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('impact'), 900);
    const t2 = setTimeout(() => setPhase('reveal'), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const showContent = phase === 'reveal';

  return (
    <div className="about-page">

      {/* Full-screen overlay with gavel */}
      {phase !== 'reveal' && (
        <div className={`gavel-screen gavel-screen--${phase}`}>
          <div className="gavel-stage">
            <div className={`gavel-arm gavel-arm--${phase}`}>
              <GavelSVG />
            </div>
            {phase === 'impact' && (
              <>
                <div className="gavel-block" />
                <div className="gavel-dust" />
                <div className="gavel-ring gavel-ring--1" />
                <div className="gavel-ring gavel-ring--2" />
                <div className="gavel-ring gavel-ring--3" />
                <div className="gavel-sparks">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="gavel-spark" style={{
                      '--angle': `${-160 + i * 26}deg`,
                      '--dist': `${50 + Math.random() * 50}px`,
                      animationDelay: `${Math.random() * .08}s`
                    }} />
                  ))}
                </div>
                <div className="gavel-crack" />
              </>
            )}
          </div>
          <div className="gavel-text">
            <span style={{ color: '#dc2626' }}>b</span>id.
          </div>
        </div>
      )}

      {/* Content fades in after hammer */}
      <div className={`about-content${showContent ? ' about-content--visible' : ''}`}>

        {/* Hero */}
        <div className="about-hero">
          <h1><span style={{ color: 'var(--danger)' }}>b</span>id.</h1>
          <p className="about-tagline">the essential move you didn't know you needed.</p>
          <p className="about-sub">
            A real-time auction platform where every second counts and every bid matters.
            Place your bid, track live updates, and walk away with the W.
          </p>
        </div>

        {/* Mission */}
        <div className="about-section">
          <h2 className="about-section-title">Our Mission</h2>
          <p className="about-section-text">
            bid. was built to make competitive auctions accessible, transparent, and thrilling.
            Whether you're hunting rare sneakers, vintage gear, or everyday essentials —
            we give every buyer a fair shot and every seller a real audience.
            No bots. No inflated reserves. Just honest bidding.
          </p>
        </div>

        {/* How it works */}
        <div className="about-section">
          <h2 className="about-section-title">How It Works</h2>
          <div className="about-steps">
            {[
              { n: '01', t: 'Browse',  d: 'Explore 15 categories of live auctions.' },
              { n: '02', t: 'Bid',     d: 'Place a bid higher than the current price.' },
              { n: '03', t: 'Win',     d: 'Highest bid when the timer ends wins.' },
              { n: '04', t: 'Pay',     d: 'Complete payment securely in one click.' },
            ].map((s, i) => (
              <div key={i} className="about-step" style={{ animationDelay: `${1.2 + i * .12}s` }}>
                <span className="about-step-num">{s.n}</span>
                <strong>{s.t}</strong>
                <span>{s.d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="about-section">
          <h2 className="about-section-title">Features</h2>
          <div className="about-features">
            {features.map((f, i) => (
              <div key={i} className="about-feature-card" style={{ animationDelay: `${1.3 + i * .1}s` }}>
                <span className="about-feature-icon">{f.icon}</span>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="about-section about-contact">
          <h2 className="about-section-title">Contact Us</h2>
          <p className="about-section-text">Have questions, feedback, or partnership inquiries?</p>
          <a className="about-email" href="mailto:bhuvishasripriyaprithveeswar@gmail.com">
            ✉️ bhuvishasripriyaprithveeswar@gmail.com
          </a>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <Link to="/" className="btn btn-primary" style={{ fontSize: '1rem', padding: '.75rem 2rem' }}>
            Start Bidding →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default About;
