import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowUpRight,
  ArrowLeft,
  Check,
  Download,
  X,
  Rocket,
  Code2,
  Palette,
  Lightbulb,
  Terminal,
} from 'lucide-react';
import { missions } from '../data';

const roles = [
  { label: 'Developer', Icon: Code2 },
  { label: 'Designer', Icon: Palette },
  { label: 'Thinker', Icon: Lightbulb },
  { label: 'All-rounder', Icon: Terminal },
];

export default function Registration({ open, selectedMission, motionOff, onClose }) {
  const dialog = useRef(null);
  const lastFocus = useRef(null);
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Developer');
  const [crew, setCrew] = useState('Find me a crew');
  const [mission, setMission] = useState(selectedMission);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const chosen = missions.find((item) => item.id === mission) || missions[0];

  useLayoutEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setStep(0);
      setName('');
      setRole('Developer');
      setCrew('Find me a crew');
      setMission(selectedMission);
      setError('');
      setDownloaded(false);
      if (!dialog.current.open) dialog.current.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [open, selectedMission]);

  useLayoutEffect(() => {
    if (!open) return;
    dialog.current.scrollTop = 0;
    dialog.current.querySelector('#registration-heading')?.focus({ preventScroll: true });
  }, [step, open]);

  function close() {
    dialog.current.close();
    setName('');
    setError('');
    onClose();
    lastFocus.current?.focus({ preventScroll: true });
  }
  function next(event) {
    event.preventDefault();
    if (step === 0 && name.trim().length < 2) {
      setError('Enter a nickname with at least two non-space characters.');
      dialog.current.querySelector('input').focus();
      return;
    }
    setError('');
    setStep((current) => current + 1);
  }
  function download() {
    const escape = (text) =>
      text.replace(
        /[<>&"']/g,
        (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char],
      );
    const nickname = name
      .trim()
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
      .toWellFormed();
    const context = document.createElement('canvas').getContext('2d');
    if (context) context.font = 'bold 48px Arial';
    const nameWidth = context?.measureText(nickname).width ?? nickname.length * 48;
    const nameSize = nameWidth > 820 ? Math.max(22, Math.round((48 * 820) / nameWidth)) : 48;
    const nameFit = nameWidth > 820 ? ' textLength="820" lengthAdjust="spacingAndGlyphs"' : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="580" viewBox="0 0 1000 580" role="img" aria-labelledby="title">
  <title id="title">ORBIT ’26 demo boarding pass for ${escape(nickname)}</title>
  <defs>
    <linearGradient id="surface" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#080D1E"/><stop offset="1" stop-color="#141C35"/>
    </linearGradient>
    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
      <path d="M24 0H0V24" fill="none" stroke="#4F8CFF" opacity=".15"/>
    </pattern>
  </defs>
  <rect width="1000" height="580" rx="28" fill="url(#surface)"/>
  <rect x="27" y="27" width="946" height="526" rx="16" fill="none" stroke="#345581"/>
  <path d="M52 28H330" stroke="#4F8CFF" stroke-width="3"/>
  <path d="M702 44H947V172H702Z" fill="url(#grid)"/>
  <g fill="none" stroke="#4F8CFF">
    <circle cx="828" cy="108" r="32"/>
    <circle cx="828" cy="108" r="49" opacity=".55" stroke-dasharray="4 6"/>
    <ellipse cx="828" cy="108" rx="78" ry="21" transform="rotate(-24 828 108)"/>
  </g>
  <circle cx="881" cy="73" r="5" fill="#36F1CD"/>
  <path d="M64 308H936" stroke="#345581" stroke-dasharray="5 7"/>
  <path d="M595 337V415M64 445H936" stroke="#345581"/>
  <g fill="#F5F7FF" font-family="Arial, sans-serif">
    <text x="64" y="112" font-size="54" font-weight="bold">ORBIT ’26</text>
    <text x="64" y="228" font-size="${nameSize}" font-weight="bold"${nameFit}>${escape(nickname)}</text>
    <text x="64" y="269" fill="#A7B5D1" font-size="21">${escape(role)} · ${escape(crew)}</text>
    <text x="64" y="408" fill="${chosen.color}" font-size="31" font-weight="bold">${escape(chosen.name)}</text>
    <text x="625" y="406" font-size="25">19 DEC 2026 / 08:00 SLST</text>
    <text x="64" y="516" fill="#A7B5D1" font-size="14">IEEE CS UCSC Web Team Recruitment concept. No registration has been submitted.</text>
  </g>
  <g font-family="monospace" font-size="15" letter-spacing="2">
    <text x="67" y="145" fill="#9CC5FF">BOARDING PASS / MISSION ${chosen.number}</text>
    <text x="64" y="187" fill="#A7B5D1">EXPLORER</text>
    <text x="64" y="365" fill="#A7B5D1">YOUR MISSION</text>
    <text x="625" y="365" fill="#A7B5D1">DEPARTURE</text>
    <text x="64" y="486" fill="#36F1CD">DEMO ONLY · FICTIONAL EVENT</text>
  </g>
</svg>`;
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orbit-26-demo-boarding-pass.svg';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    setDownloaded(true);
  }

  return (
    <dialog
      ref={dialog}
      className="registration"
      aria-labelledby="registration-heading"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) {
          const r = dialog.current.getBoundingClientRect();
          if (
            event.clientX < r.left ||
            event.clientX > r.right ||
            event.clientY < r.top ||
            event.clientY > r.bottom
          )
            close();
        }
      }}
    >
      <button className="dialog-close icon-button" aria-label="Close application" onClick={close}>
        <X size={20} />
      </button>
      <div className="registration-brand">
        <span className="brand-symbol" />
        <span>
          ORBIT<span className="brand-year">’26</span>
        </span>
        <span className="mono">CREW APPLICATION</span>
      </div>
      {step < 3 && (
        <>
          <div className="step-indicators" aria-label={`Step ${step + 1} of 3`}>
            {['EXPLORER', 'MISSION', 'REVIEW'].map((label, index) => (
              <div
                className={index <= step ? 'active' : ''}
                aria-current={index === step ? 'step' : undefined}
                key={label}
              >
                <span>{index < step ? <Check size={12} /> : `0${index + 1}`}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>
          <p className="demo-note">
            <span className="live-dot" /> FICTIONAL EVENT · NOTHING IS SENT OR SAVED
          </p>
        </>
      )}
      <motion.div
        key={step}
        initial={motionOff ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionOff ? 0 : 0.24 }}
      >
        {step === 0 && (
          <form onSubmit={next}>
            <span className="eyebrow">FIRST, THE HUMAN BEHIND THE IDEA.</span>
            <h2 id="registration-heading" tabIndex={-1}>
              Who’s coming
              <br />
              on board?
            </h2>
            <label className="field-label" htmlFor="explorer-name">
              Your name or nickname
            </label>
            <input
              id="explorer-name"
              autoComplete="off"
              maxLength={40}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              placeholder="e.g. Cosmic Coder"
              required
              aria-describedby={error ? 'name-error' : undefined}
              aria-invalid={!!error}
            />
            <p id="name-error" role="alert" className="field-error">
              {error}
            </p>
            <fieldset>
              <legend>What’s your superpower?</legend>
              <div className="role-grid">
                {roles.map(({ label, Icon }) => (
                  <label key={label} className={role === label ? 'selected' : ''}>
                    <input
                      type="radio"
                      name="role"
                      value={label}
                      checked={role === label}
                      onChange={() => setRole(label)}
                    />
                    <Icon size={20} />
                    <span>{label}</span>
                    <span className="choice-dot" aria-hidden="true">
                      {role === label && <Check size={12} />}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="field-label" htmlFor="crew-status">
              Crew status
            </label>
            <select id="crew-status" value={crew} onChange={(event) => setCrew(event.target.value)}>
              <option>Find me a crew</option>
              <option>I have a team of 2–4</option>
            </select>
            <button className="button primary full" type="submit">
              Choose your mission <ArrowUpRight size={18} />
            </button>
          </form>
        )}
        {step === 1 && (
          <form onSubmit={next}>
            <span className="eyebrow">FOLLOW YOUR CURIOSITY.</span>
            <h2 id="registration-heading" tabIndex={-1}>
              Pick a direction.
              <br />
              Make it yours.
            </h2>
            <fieldset className="mission-choices">
              <legend className="sr-only">Choose a mission</legend>
              {missions.map((item) => (
                <label
                  key={item.id}
                  className={mission === item.id ? 'selected' : ''}
                  style={{ '--track-color': item.color }}
                >
                  <input
                    type="radio"
                    name="mission"
                    value={item.id}
                    checked={mission === item.id}
                    onChange={() => setMission(item.id)}
                  />
                  <item.Icon size={25} />
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.name}</strong>
                  </span>
                  <span className="choice-dot">{mission === item.id && <Check size={13} />}</span>
                </label>
              ))}
            </fieldset>
            <div className="step-actions">
              <button type="button" className="back-button" onClick={() => setStep(0)}>
                <ArrowLeft size={17} /> Back
              </button>
              <button className="button primary" type="submit">
                Review flight details <ArrowUpRight size={18} />
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={next}>
            <span className="eyebrow">ALL SYSTEMS READY.</span>
            <h2 id="registration-heading" tabIndex={-1}>
              Your next chapter
              <br />
              looks good.
            </h2>
            <div className="review-details">
              <div>
                <span>EXPLORER</span>
                <strong>{name.trim()}</strong>
              </div>
              <div>
                <span>SUPERPOWER</span>
                <strong>{role}</strong>
              </div>
              <div>
                <span>YOUR CREW</span>
                <strong>{crew}</strong>
              </div>
              <div>
                <span>MISSION</span>
                <strong style={{ color: chosen.color }}>{chosen.name}</strong>
              </div>
              <div>
                <span>BUILD WINDOW</span>
                <strong>19–20 Dec 2026 · 36 hours</strong>
              </div>
            </div>
            <p className="review-note">
              This creates a demo pass on your device. ORBIT is a fictional recruitment concept, not a real
              event registration.
            </p>
            <div className="step-actions">
              <button type="button" className="back-button" onClick={() => setStep(1)}>
                <ArrowLeft size={17} /> Back
              </button>
              <button className="button primary" type="submit">
                Initialize my mission <Rocket size={17} />
              </button>
            </div>
          </form>
        )}
        {step === 3 && (
          <div className="success-view">
            <div className="success-orbit">
              <Rocket size={31} />
            </div>
            <span className="eyebrow">DEMO FLIGHT MANIFEST / CONFIRMED</span>
            <h2 id="registration-heading" tabIndex={-1}>
              Welcome aboard,
              <br />
              <em>{name.trim()}.</em>
            </h2>
            <p>Your next big idea has a destination.</p>
            <div className="ticket" style={{ '--track-color': chosen.color }}>
              <div className="ticket-top">
                <span>ORBIT ’26</span>
                <span className="mono">BOARDING PASS</span>
              </div>
              <div className="ticket-mission">
                <chosen.Icon size={29} />
                <div>
                  <small>MISSION {chosen.number}</small>
                  <strong>{chosen.name}</strong>
                </div>
              </div>
              <div className="ticket-bottom">
                <div>
                  <small>DEPARTURE</small>
                  <span>19 DEC · 08:00 SLST</span>
                </div>
                <div className="barcode" aria-hidden="true" />
              </div>
              <span className="ticket-demo">DEMO ONLY · NOT A REAL EVENT TICKET</span>
            </div>
            <button id="download-ticket" className="button primary full" onClick={download}>
              {downloaded ? 'Download again' : 'Download your demo pass'}
              <Download size={18} />
            </button>
            <p role="status" className="download-status">
              {downloaded
                ? 'Your SVG boarding pass is ready to save.'
                : 'A little souvenir from your next possible future.'}
            </p>
            <button className="back-button" onClick={close}>
              Back to mission control <ArrowUpRight size={15} />
            </button>
          </div>
        )}
      </motion.div>
    </dialog>
  );
}
