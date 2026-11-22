import { Component, createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, MotionConfig, useInView, useScroll, useSpring } from 'motion/react';
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  Check,
  Code2,
  Command,
  Download,
  ExternalLink,
  Globe2,
  Menu,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Radio,
  Rocket,
  Sparkles,
  Sun,
  Terminal,
  Users,
  X,
  Zap,
  Crosshair,
  Layers3,
} from 'lucide-react';
import Orb from './components/react-bits/Orb/Orb';
import DecryptedText from './components/react-bits/DecryptedText/DecryptedText';
import SpotlightCard from './components/react-bits/SpotlightCard/SpotlightCard';
import Magnet from './components/react-bits/Magnet/Magnet';
import CountUp from './components/react-bits/CountUp/CountUp';
import ScrollVelocity from './components/react-bits/ScrollVelocity/ScrollVelocity';
import Registration from './components/Registration';
import { asset, faqs, missions, schedule } from './data';

const MotionPaused = createContext(false);
const themeAssets = {
  dark: { orb: ['#4F8CFF', '#36F1CD', '#173B8C'], logo: 'ieee-cs-white.png' },
  light: { orb: ['#295DCE', '#088C87', '#6150B6'], logo: 'ieee-cs-color.png' },
};
const themeQuery = '(prefers-color-scheme: light)';
const themeStorageKey = 'orbit-theme';
const entranceEase = [0.22, 1, 0.36, 1];
const nav = [
  ['mission', 'The mission'],
  ['tracks', 'The frontiers'],
  ['flight-plan', 'Flight plan'],
  ['faq', 'FAQs'],
];

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const hasPreference = useRef(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(themeStorageKey);
      hasPreference.current ||= saved === 'light' || saved === 'dark';
    } catch {
      // Keep following the system preference when storage is unavailable.
    }
    const system = window.matchMedia(themeQuery);
    const update = () => {
      if (!hasPreference.current) setTheme(system.matches ? 'light' : 'dark');
    };
    update();
    system.addEventListener('change', update);
    return () => system.removeEventListener('change', update);
  }, []);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(root)
      .getPropertyValue('--bg-primary')
      .trim();
  }, [theme]);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    hasPreference.current = true;
    setTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      // The current page can still use the selected theme.
    }
  }

  return [theme, toggleTheme];
}

class VisualBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Reveal({ children, className = '', delay = 0 }) {
  const paused = useContext(MotionPaused);
  return (
    <motion.div
      className={className}
      initial={paused ? false : { opacity: 0, y: 18 }}
      animate={paused ? { opacity: 1, y: 0 } : undefined}
      whileInView={paused ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: paused ? 0 : 0.62, delay: paused ? 0 : delay, ease: entranceEase }}
    >
      {children}
    </motion.div>
  );
}

function entrance(paused, delay = 0) {
  return {
    initial: paused ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: paused ? 0 : 0.64, delay: paused ? 0 : delay, ease: entranceEase },
  };
}

function SectionLabel({ number, children, right }) {
  return (
    <div className="section-label">
      <span>
        <i /> {number} / {children}
      </span>
      <span>{right}</span>
    </div>
  );
}

function OrbitalDiagram({ type = 'human', active = false }) {
  return (
    <div className={`diagram diagram-${type} ${active ? 'diagram-active' : ''}`} aria-hidden="true">
      <div className="diagram-grid" />
      {type === 'human' ? (
        <>
          <div className="core core-a" />
          <div className="core core-b" />
          <div className="core core-c" />
          <div className="core-center">
            <Command size={38} strokeWidth={1} />
          </div>
          <span className="diagram-dot dot-a" />
          <span className="diagram-dot dot-b" />
        </>
      ) : type === 'earth' ? (
        <>
          <div className="wire-globe">
            <i />
            <i />
            <i />
            <b />
            <b />
            <b />
          </div>
          <div className="globe-orbit" />
          <span className="diagram-dot dot-a" />
        </>
      ) : (
        <>
          <div className="cube cube-one" />
          <div className="cube cube-two" />
          <div className="cube cube-three" />
          <div className="core-center">
            <ArrowUpRight size={57} strokeWidth={0.8} />
          </div>
        </>
      )}
      <span className="diagram-corner">+</span>
      <span className="diagram-corner corner-right">+</span>
    </div>
  );
}

function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remaining = Math.max(0, new Date('2026-12-19T08:00:00+05:30').getTime() - now);
  const values = [
    Math.floor(remaining / 86400000),
    Math.floor(remaining / 3600000) % 24,
    Math.floor(remaining / 60000) % 60,
    Math.floor(remaining / 1000) % 60,
  ];
  return (
    <div className="countdown-panel">
      <div className="countdown-label">
        <span className="live-dot" />
        <span>{remaining ? 'NEXT LAUNCH IN' : 'DEMO LAUNCH WINDOW REACHED'}</span>
        <span className="countdown-year">T—026</span>
      </div>
      <div className="countdown" role="timer" aria-label="Time until the fictional build weekend">
        {values.map((value, index) => (
          <div key={index}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <small>{['DAYS', 'HOURS', 'MINUTES', 'SECONDS'][index]}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero({ openRegistration, motionOff, setMotionOff, reduce, theme }) {
  const [boost, setBoost] = useState(false);
  const heroRef = useRef(null);
  const visible = useInView(heroRef, { margin: '100px' });
  const off = motionOff || reduce;
  useEffect(() => {
    if (!boost) return;
    const timer = setTimeout(() => setBoost(false), 5000);
    return () => clearTimeout(timer);
  }, [boost]);

  return (
    <section
      className={`hero ${boost ? 'boosting' : ''}`}
      id="home"
      ref={heroRef}
      aria-labelledby="hero-title"
    >
      <div className="starfield" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline mono">
        <span>
          <Radio size={14} aria-hidden="true" />
          {off ? (
            'MISSION CONTROL'
          ) : (
            <DecryptedText text="MISSION CONTROL" animateOn="view" sequential speed={24} />
          )}
        </span>
        <span>6.9022° N &nbsp; 79.8611° E</span>
      </div>
      <motion.div className="hero-visual" aria-hidden="true" {...entrance(off, 0.12)}>
        <div className="orb-reticle" />
        <div className="orb-fallback" aria-hidden="true" />
        <VisualBoundary>
          <Orb
            colors={themeAssets[theme].orb}
            backgroundColor={theme === 'light' ? '#f5f8ff' : '#080d1e'}
            size={0.72}
            glow={1.18}
            bleed={1.08}
            wobble={0.98}
            trail={1.18}
            speed={boost ? 2.8 : 0.5}
            forceHoverState={boost}
            hoverIntensity={0.55}
            tiltX={10}
            tiltY={-13}
            paused={off || !visible}
            dpr={1.25}
            intro={false}
          />
        </VisualBoundary>
        <div className="orb-axis axis-one" />
        <div className="orb-axis axis-two" />
        <div className="orb-center">
          <span className="orb-cross">
            <Crosshair size={22} strokeWidth={1} />
          </span>
          <span className="mono">{boost ? 'WARP DRIVE' : 'PLASMA CORE'}</span>
          <strong>{boost ? 'ENGAGED' : 'O—26'}</strong>
        </div>
        <div className="orb-coordinate coordinate-a">
          <i />
          <span>
            DRIVE
            <br />
            <b>{boost ? 'WARP' : 'STANDBY'}</b>
          </span>
        </div>
        <div className="orb-coordinate coordinate-b">
          <span>SIGNAL STRENGTH</span>
          <div className="signal-bars">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ '--i': i }} />
            ))}
          </div>
          <b>
            {boost ? '∞' : '98.6'}
            <small>%</small>
          </b>
        </div>
        <div className="orb-caption mono">
          <span className="cross">+</span>{' '}
          <span className="orb-pointer-hint">MOVE TO DISTORT. CLICK TO PULSE.</span>
          <span className="orb-touch-hint">TAP TO PULSE.</span>
        </div>
      </motion.div>
      <div className="hero-content">
        <motion.div className="hero-brand" {...entrance(off)}>
          <span className="live-dot" /> ORBIT ’26 <i /> 36-HOUR STUDENT HACKATHON
        </motion.div>
        <motion.h1 id="hero-title" {...entrance(off, 0.08)}>
          <span>Beyond</span>
          <span>the possible.</span>
        </motion.h1>
        <motion.p className="hero-subtitle" {...entrance(off, 0.14)}>
          The future doesn’t build itself.
          <br />
          Find your people. Make something that matters.
        </motion.p>
        <div className="hero-buttons">
          <motion.div {...entrance(off, 0.2)}>
            <Magnet padding={35} magnetStrength={7} maxOffset={7} disabled={off}>
              <button className="button primary" onClick={openRegistration}>
                Join the mission <ArrowUpRight size={19} />
              </button>
            </Magnet>
          </motion.div>
          <motion.div {...entrance(off, 0.26)}>
            <button
              className={`button ghost ${boost ? 'engaged' : ''}`}
              onClick={() => setBoost((current) => !current)}
              aria-pressed={boost}
            >
              <span className="play-circle">
                {boost ? <Pause size={11} /> : <Play size={11} fill="currentColor" />}
              </span>
              Experience the orbit
            </button>
          </motion.div>
        </div>
        <div className="hero-event">
          <span>
            <i /> <time dateTime="2026-12-18">18—20 DEC 2026</time>
          </span>
          <span>
            <Globe2 size={13} />
            UCSC · COLOMBO, LK
          </span>
        </div>
      </div>
      <div className="hero-footer">
        <a href="#mission" className="discover">
          <ArrowDown size={15} /> SCROLL TO EXPLORE
        </a>
        <button
          className="motion-control"
          onClick={() => setMotionOff((value) => !value)}
          disabled={!!reduce}
          aria-pressed={!!off}
          aria-label={reduce ? 'Reduced motion enabled' : off ? 'Enable motion' : 'Pause motion'}
        >
          {off ? <Play size={12} /> : <Pause size={12} />}
          <span>{reduce ? 'REDUCED MOTION' : off ? 'MOTION OFF' : 'MOTION ON'}</span>
        </button>
      </div>
    </section>
  );
}

function MissionSection({ motionOff }) {
  return (
    <section className="mission-section section" id="mission" tabIndex={-1}>
      <SectionLabel number="01" right="IDEAS ARE ONLY THE BEGINNING">
        THE MISSION
      </SectionLabel>
      <div className="mission-layout">
        <Reveal>
          <span className="eyebrow">THIS IS YOUR LAUNCHPAD.</span>
          <h2>
            Some ideas
            <br />
            are too good
            <br />
            to stay <em>ideas.</em>
          </h2>
          <p className="intro-copy">
            For the “what if” thinkers. The midnight makers.
            <br />
            The ones who just have to try.
          </p>
        </Reveal>
        <Reveal className="mission-description" delay={0.15}>
          <div className="mission-quote">
            <span className="quote-star">✳</span>
            <p>
              36 hours to turn
              <br />
              <span>“imagine if”</span> into
              <br />
              <span>“look what we built.”</span>
            </p>
          </div>
          <p>
            ORBIT brings curious minds into one room with a shared mission: build something beyond what you
            thought possible. Find your crew, pick a challenge, and go from first spark to working prototype.
          </p>
          <p>
            No perfect résumés. No prescribed answers.
            <br />
            Just the space to experiment, together.
          </p>
          <span className="concept-label">
            <Radio size={12} /> A FICTIONAL IEEE CS UCSC RECRUITMENT CONCEPT
          </span>
        </Reveal>
      </div>
      <div className="stat-grid">
        {[
          { value: 36, unit: 'HOURS', label: 'One focused build sprint', Icon: Zap },
          { value: 3, unit: 'MISSIONS', label: 'Different paths. Shared ambition.', Icon: Crosshair },
          {
            value: 4,
            prefix: '2–',
            unit: 'CREW MEMBERS',
            label: 'Better ideas happen together',
            Icon: Users,
          },
          { value: 1, unit: 'GIANT LEAP', label: 'A new trajectory starts here', Icon: Rocket },
        ].map(({ value, unit, label, Icon, prefix }, i) => (
          <Reveal className="stat" key={unit} delay={i * 0.06}>
            <Icon size={17} />
            <div>
              <strong>
                {prefix}
                {motionOff ? value : <CountUp to={value} duration={1.5} />}
              </strong>
              <span>{unit}</span>
            </div>
            <p>{label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Tracks({ selected, setSelected, openRegistration, motionOff, theme }) {
  const current = missions.find((mission) => mission.id === selected);
  return (
    <section className="tracks-section section" id="tracks" tabIndex={-1}>
      <SectionLabel number="02" right="CHOOSE YOUR COORDINATES">
        THE FRONTIERS
      </SectionLabel>
      <Reveal className="section-heading">
        <h2>
          Different missions.
          <br />
          <span className="dim">The same restless spirit.</span>
        </h2>
        <p>
          Pick a problem that keeps you thinking.
          <br />
          Build the thing you wish existed.
        </p>
      </Reveal>
      <div className="track-grid">
        {missions.map((mission, index) => (
          <Reveal key={mission.id} delay={index * 0.08}>
            <SpotlightCard
              className={`track-card ${selected === mission.id ? 'selected' : ''}`}
              spotlightColor={mission.accent}
              theme={theme}
              paused={motionOff}
              intensity={0.1}
              borderGlow={0.7}
              style={{ '--track-color': mission.accent }}
            >
              <div className="track-card-layout">
                <div className="track-card-top mono">
                  <span>MISSION / {mission.number}</span>
                  <ArrowUpRight size={17} />
                </div>
                <OrbitalDiagram type={mission.id} active={!motionOff} />
                <span id={`mission-category-${mission.id}`} className="track-category mono">
                  {mission.category}
                </span>
                <h3 id={`mission-title-${mission.id}`}>{mission.name}</h3>
                <p id={`mission-tagline-${mission.id}`}>{mission.tagline}</p>
                <div className="track-select mono">
                  <span>{selected === mission.id ? 'MISSION SELECTED' : 'EXPLORE MISSION'}</span>
                  {selected === mission.id ? (
                    <span className="selected-dot">
                      <Check size={11} />
                    </span>
                  ) : (
                    <Plus size={16} />
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(mission.id)}
                aria-labelledby={`mission-title-${mission.id} mission-category-${mission.id}`}
                aria-describedby={`mission-tagline-${mission.id}`}
                aria-pressed={selected === mission.id}
                aria-controls="mission-brief"
              />
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      <div className="mission-brief" id="mission-brief" style={{ '--track-color': current.accent }}>
        <div className="brief-terminal">
          <div className="terminal-header">
            <span className="terminal-dots">
              <i />
              <i />
              <i />
            </span>
            <span>orbit / mission-{current.number}.brief</span>
            <Terminal size={13} />
          </div>
          <div aria-live="polite">
            <motion.div
              className="terminal-content"
              key={current.id}
              initial={motionOff ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: motionOff ? 0 : 0.24 }}
            >
              <p>
                <span className="terminal-command">$</span> initialize <span>--{current.id}</span>
              </p>
              <h3>{current.name}</h3>
              <p className="brief-copy">{current.brief}</p>
              <div className="brief-tags">
                {current.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <span className="terminal-ready">
                <i />
                MISSION BRIEF LOADED<span className="terminal-caret">▌</span>
              </span>
            </motion.div>
          </div>
        </div>
        <div className="brief-prompt">
          <span className="eyebrow">
            <Sparkles size={13} /> YOUR FIRST SPARK
          </span>
          <p>{current.prompt}</p>
          <button className="text-button" onClick={openRegistration}>
            This is my mission <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

function FlightPlan() {
  const paused = useContext(MotionPaused);
  const [day, setDay] = useState(0);
  const tabRefs = useRef([]);
  function moveTab(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % 3;
    if (event.key === 'ArrowLeft') next = (index + 2) % 3;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 2;
    if (next === undefined) return;
    event.preventDefault();
    setDay(next);
    tabRefs.current[next].focus();
  }
  return (
    <section className="flight-section section" id="flight-plan" tabIndex={-1}>
      <SectionLabel number="03" right="18—20 DECEMBER / ALL TIMES SLST">
        FLIGHT PLAN
      </SectionLabel>
      <div className="flight-layout">
        <Reveal className="flight-intro">
          <span className="eyebrow">FROM ZERO TO SOMETHING REAL.</span>
          <h2>
            A weekend.
            <br />A whole new
            <br />
            <em>trajectory.</em>
          </h2>
          <p>
            Great things don’t happen on autopilot.
            <br />
            Here’s your path from first hello to final demo.
          </p>
          <a className="text-button" href={asset('orbit-26.ics')} download>
            <Download size={15} /> Add build weekend to calendar <ArrowUpRight size={15} />
          </a>
          <div className="flight-orbit" aria-hidden="true">
            <div className="flight-path">
              <i />
              <i />
              <i />
            </div>
            <Rocket size={25} />
            <span>36H / NO SMALL IDEAS</span>
          </div>
        </Reveal>
        <Reveal className="schedule" delay={0.12}>
          <div className="schedule-tabs" role="tablist" aria-label="Event day">
            {schedule.map((item, index) => (
              <button
                key={item.date}
                role="tab"
                aria-selected={day === index}
                aria-controls="schedule-panel"
                id={`day-tab-${index}`}
                tabIndex={day === index ? 0 : -1}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onKeyDown={(event) => moveTab(event, index)}
                onClick={() => setDay(index)}
              >
                <span>
                  <strong>{item.date}</strong> DEC
                </span>
                <small>{item.label}</small>
                {day === index && <motion.i layoutId={paused ? undefined : 'schedule-indicator'} />}
              </button>
            ))}
          </div>
          <div role="tabpanel" id="schedule-panel" aria-labelledby={`day-tab-${day}`} tabIndex={0}>
            <motion.div
              key={day}
              initial={paused ? false : { opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: paused ? 0 : 0.28, ease: entranceEase }}
            >
              <div className="schedule-title">
                <span className="live-dot" />
                <h3>{schedule[day].title}</h3>
              </div>
              <div className="schedule-items">
                {schedule[day].items.map((item, index) => (
                  <article key={item.time}>
                    <div className="schedule-time">
                      <span>{item.time}</span>
                      <i />
                    </div>
                    <div>
                      <span className="schedule-tag">{item.tag}</span>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="schedule-index">0{index + 1}</span>
                  </article>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="schedule-foot">
            <Globe2 size={12} /> SRI LANKA STANDARD TIME · UTC+5:30<span>CONCEPT SCHEDULE</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Payload({ theme }) {
  const paused = useContext(MotionPaused);
  return (
    <section className="payload-section section">
      <SectionLabel number="04" right="MORE THAN A LINE ON YOUR RÉSUMÉ">
        THE REAL PAYLOAD
      </SectionLabel>
      <Reveal className="section-heading">
        <h2>
          Come for the build.
          <br />
          <span className="dim">Leave with momentum.</span>
        </h2>
      </Reveal>
      <div className="payload-grid">
        <Reveal className="payload-feature">
          <div className="code-window">
            <div>
              <span className="terminal-dots">
                <i />
                <i />
                <i />
              </span>
              <small>your-next-chapter.js</small>
              <Code2 size={15} />
            </div>
            <pre>
              <span className="code-purple">const</span> nextChapter = {'{'}
              <br /> idea: <span className="code-green">'something that matters'</span>,<br /> crew:{' '}
              <span className="code-green">'your kind of people'</span>,<br /> limits:{' '}
              <span className="code-purple">null</span>,<br /> status:{' '}
              <span className="code-green">'ready to ship'</span>
              <br />
              {'};'}
              <br />
              <br />
              <span className="code-muted">// the rest is up to you.</span>
              <br />
              <span className="code-blue">launch</span>(nextChapter);
              <span className="terminal-caret">▌</span>
            </pre>
            <div className="code-status">
              <span>
                <Check size={11} /> BUILD SUCCESSFUL
              </span>
              <span>36h well spent</span>
            </div>
          </div>
          <div className="payload-copy">
            <span className="eyebrow">01 / PROOF, NOT JUST POTENTIAL</span>
            <h3>Something you actually shipped.</h3>
            <p>
              A working prototype. A portfolio story. And the confidence that comes from turning a blank
              screen into something real.
            </p>
          </div>
        </Reveal>
        <div className="payload-side">
          <Reveal>
            <SpotlightCard
              className="payload-card"
              spotlightColor="var(--accent-primary)"
              theme={theme}
              paused={paused}
            >
              <div className="crew-avatars" aria-hidden="true">
                <span>
                  <Code2 />
                </span>
                <span>
                  <Layers3 />
                </span>
                <span>
                  <Command />
                </span>
                <span>YOU</span>
              </div>
              <span className="eyebrow">02 / FIND YOUR FREQUENCY</span>
              <h3>
                Your people.
                <br />
                Your next crew.
              </h3>
              <p>Meet the minds you’ll want to build the next thing with.</p>
            </SpotlightCard>
          </Reveal>
          <Reveal>
            <SpotlightCard
              className="payload-card"
              spotlightColor="var(--accent-secondary)"
              theme={theme}
              paused={paused}
            >
              <Zap className="payload-zap" size={38} strokeWidth={1} />
              <span className="eyebrow">03 / RESET YOUR LIMITS</span>
              <h3>
                A bigger idea
                <br />
                of what’s possible.
              </h3>
              <p>New tools. Fresh perspectives. A little more belief in yourself.</p>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [active, setActive] = useState(0);
  return (
    <section className="faq-section section" id="faq" tabIndex={-1}>
      <SectionLabel number="05" right="A LITTLE CLARITY BEFORE TAKEOFF">
        PRE-FLIGHT CHECK
      </SectionLabel>
      <div className="faq-layout">
        <Reveal>
          <h2>
            Good questions.
            <br />
            <span className="dim">Clear signals.</span>
          </h2>
          <p>Curiosity is kind of the whole point.</p>
          <div className="faq-mark" aria-hidden="true">
            ?<span>↗</span>
          </div>
        </Reveal>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <div className={`faq-item ${active === index ? 'open' : ''}`} key={question}>
              <h3>
                <button
                  aria-expanded={active === index}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => setActive(active === index ? null : index)}
                >
                  <span className="faq-index">0{index + 1}</span>
                  {question}
                  <span className="faq-toggle">
                    {active === index ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className="faq-answer"
                aria-hidden={active !== index}
              >
                <div>
                  <p>{answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [registration, setRegistration] = useState(false);
  const [selected, setSelected] = useState('human');
  const [menu, setMenu] = useState(false);
  const [motionOff, setMotionOff] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const menuToggle = useRef(null);
  const mobileNav = useRef(null);
  const [reduce, setReduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const paused = motionOff || reduce;
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -60% 0px' },
    );
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!menu) return;
    mobileNav.current.querySelector('a')?.focus({ preventScroll: true });

    function escape(event) {
      if (event.key === 'Escape') {
        setMenu(false);
        menuToggle.current.focus();
      }
    }
    const desktop = window.matchMedia('(min-width: 861px)');
    const closeMenu = () => setMenu(false);
    document.addEventListener('keydown', escape);
    desktop.addEventListener('change', closeMenu);
    return () => {
      document.removeEventListener('keydown', escape);
      desktop.removeEventListener('change', closeMenu);
    };
  }, [menu]);
  const openRegistration = () => {
    setMenu(false);
    setRegistration(true);
  };
  return (
    <MotionConfig reducedMotion={paused ? 'always' : 'never'}>
      <MotionPaused.Provider value={paused}>
        <div className={`app ${paused ? 'motion-off' : ''}`}>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <motion.div
            className="reading-progress"
            aria-hidden="true"
            style={{ scaleX: paused ? scrollYProgress : progress }}
          />
          <div className="concept-banner">
            <span>IEEE COMPUTER SOCIETY · UCSC</span>
            <span>
              FICTIONAL HACKATHON / WEB TEAM CHALLENGE <ArrowUpRight size={10} />
            </span>
          </div>
          <header
            className="site-header"
            onBlur={(event) => {
              if (menu && !event.currentTarget.contains(event.relatedTarget)) setMenu(false);
            }}
          >
            <a className="wordmark" href="#home" aria-label="ORBIT 26 home">
              <span className="brand-symbol" />
              ORBIT<span className="brand-year">’26</span>
            </a>
            <nav className="desktop-nav" aria-label="Main navigation">
              {nav.map(([id, title]) => (
                <a href={`#${id}`} key={id} aria-current={activeSection === id ? 'location' : undefined}>
                  {title}
                </a>
              ))}
            </nav>
            <div className="header-end">
              <span className="header-status mono">
                <span className="live-dot" /> OPEN FOR EXPLORERS
              </span>
              <button className="button header-cta" onClick={openRegistration}>
                Get on board <ArrowUpRight size={15} />
              </button>
              <button
                className="icon-button"
                type="button"
                onClick={toggleTheme}
                aria-label="Dark mode"
                aria-pressed={theme === 'dark'}
                title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              >
                {theme === 'dark' ? (
                  <Sun size={20} aria-hidden="true" />
                ) : (
                  <Moon size={20} aria-hidden="true" />
                )}
              </button>
              <button
                className="menu-toggle icon-button"
                ref={menuToggle}
                onClick={() => setMenu((value) => !value)}
                aria-expanded={menu}
                aria-controls="mobile-nav"
                aria-label={menu ? 'Close navigation' : 'Open navigation'}
              >
                {menu ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
            <nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label="Mobile navigation"
              ref={mobileNav}
              hidden={!menu}
            >
              {nav.map(([id, title]) => (
                <a
                  href={`#${id}`}
                  key={id}
                  aria-current={activeSection === id ? 'location' : undefined}
                  onClick={() => {
                    setMenu(false);
                    document.getElementById(id).focus({ preventScroll: true });
                  }}
                >
                  {title}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              ))}
            </nav>
          </header>
          <main id="main" tabIndex={-1}>
            <Hero
              openRegistration={openRegistration}
              motionOff={motionOff}
              setMotionOff={setMotionOff}
              reduce={reduce}
              theme={theme}
            />
            <div className="launch-status">
              <div className="launch-status-intro">
                <span className="mono">YOUR NEXT BIG THING</span>
                <strong>Starts in T-minus.</strong>
                <span>19 DEC 2026 · 08:00 SLST</span>
              </div>
              <Countdown />
              <div className="launch-status-location">
                <Crosshair size={22} strokeWidth={1} />
                <div>
                  <span className="mono">LAUNCH COORDINATES</span>
                  <strong>UCSC, Colombo</strong>
                  <span>SRI LANKA / PLANET EARTH</span>
                </div>
              </div>
            </div>
            <MissionSection motionOff={paused} />
            <div className="velocity-band" aria-label="Think boldly. Build fearlessly. Launch together.">
              {paused ? (
                <div className="static-marquee">THINK BOLDLY. ✳ BUILD FEARLESSLY. ✳ LAUNCH TOGETHER.</div>
              ) : (
                <ScrollVelocity
                  texts={['THINK BOLDLY.  ✳  BUILD FEARLESSLY.  ✳  LAUNCH TOGETHER.  ✳']}
                  velocity={28}
                  numCopies={3}
                  className="velocity-text"
                  pauseOnHover
                  skewWithVelocity={0.04}
                />
              )}
            </div>
            <Tracks
              selected={selected}
              setSelected={setSelected}
              openRegistration={openRegistration}
              motionOff={paused}
              theme={theme}
            />
            <FlightPlan />
            <Payload theme={theme} />
            <FAQ />
            <section className="final-cta">
              <div className="cta-grid" aria-hidden="true" />
              <div className="cta-star" aria-hidden="true">
                ✳
              </div>
              <Reveal className="cta-content">
                <span className="eyebrow">
                  <span className="live-dot" /> YOUR NEXT CHAPTER IS WAITING
                </span>
                <h2>
                  YOU WEREN’T MADE
                  <br />
                  FOR <span>ORDINARY.</span>
                </h2>
                <p>36 hours. Your crew. A whole new orbit.</p>
                <Magnet padding={35} magnetStrength={8} maxOffset={6} disabled={paused}>
                  <button className="button primary" onClick={openRegistration}>
                    Let’s build what’s next <ArrowUpRight size={19} />
                  </button>
                </Magnet>
                <span className="cta-caption mono">NO PERFECT IDEAS REQUIRED. JUST YOU.</span>
              </Reveal>
              <div className="cta-bottom mono">
                <span>ORBIT / EDITION 01</span>
                <span>COLOMBO, SRI LANKA ↗</span>
              </div>
            </section>
          </main>
          <footer>
            <div className="footer-main">
              <div>
                <a className="wordmark" href="#home" aria-label="ORBIT 26 back to top">
                  <span className="brand-symbol" />
                  ORBIT<span className="brand-year">’26</span>
                </a>
                <p>
                  For the curious.
                  <br />
                  Built for what comes next.
                </p>
              </div>
              <div className="footer-links">
                <span className="mono">EXPLORE THE MISSION</span>
                {nav.map(([id, title]) => (
                  <a href={`#${id}`} key={id}>
                    {title}
                    <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
              <div className="footer-credits">
                <span className="mono">A RECRUITMENT CONCEPT FOR</span>
                <img
                  src={asset(`logos/${themeAssets[theme].logo}`)}
                  alt="IEEE Computer Society UCSC Student Branch Chapter"
                  width="190"
                  height="104"
                  loading="lazy"
                />
                <a href="https://reactbits.dev" target="_blank" rel="noreferrer">
                  Made with React Bits <ExternalLink size={11} />
                </a>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© 2026 ORBIT. A fictional hackathon concept.</span>
              <span>NO REAL REGISTRATIONS. JUST REAL POSSIBILITIES.</span>
              <a href="#home">
                BACK TO TOP <ArrowUpRight size={12} />
              </a>
            </div>
          </footer>
          <Registration
            open={registration}
            selectedMission={selected}
            motionOff={paused}
            onClose={() => setRegistration(false)}
          />
        </div>
      </MotionPaused.Provider>
    </MotionConfig>
  );
}
