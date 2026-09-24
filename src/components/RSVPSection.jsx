// ============================================================
// RSVPSection — Premium RSVP form with success state
// ============================================================

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { User, Phone, CheckCircle } from 'lucide-react';
import { submitRSVP } from '../services/eventApi';
import { getFieldError } from '../utils/validation';
import RevealOnScroll from './animations/RevealOnScroll';
import './RSVPSection.scss';

const INITIAL_FORM = {
  name: '',
  contact: '',
};

function FloatingLabelInput({ id, label, type = 'text', value, onChange, error, icon: Icon, ...props }) {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''} ${value ? 'form-field--filled' : ''}`}>
      <div className="form-field__input-wrap">
        {Icon && <Icon size={16} className="form-field__icon" aria-hidden="true" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="form-field__input"
          placeholder=" "
          aria-label={label}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        <label htmlFor={id} className="form-field__label">{label}</label>
      </div>
      {error && (
        <p className="form-field__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Confetti particle
function Confetti() {
  useEffect(() => {
    const colors = ['#a855f7', '#ec4899', '#38bdf8', '#f59e0b', '#22c55e'];
    const container = document.querySelector('.rsvp-success');
    if (!container) return;

    const particles = Array.from({ length: 40 }, () => {
      const el = document.createElement('div');
      el.className = 'confetti-particle';
      el.style.cssText = `
        position: absolute;
        width: ${4 + Math.random() * 6}px;
        height: ${4 + Math.random() * 6}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${Math.random() * 100}%;
        top: -10px;
        pointer-events: none;
      `;
      container.appendChild(el);
      return el;
    });

    gsap.to(particles, {
      y: () => 200 + Math.random() * 200,
      x: () => (Math.random() - 0.5) * 200,
      rotation: () => Math.random() * 720,
      opacity: 0,
      duration: () => 1.5 + Math.random() * 1,
      stagger: 0.03,
      ease: 'power2.out',
      onComplete: () => particles.forEach((p) => p.remove()),
    });

    return () => particles.forEach((p) => p.remove());
  }, []);

  return null;
}

export default function RSVPSection({ config }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef(null);
  const successRef = useRef(null);

  const c = config || {};
  const registrationEnabled = c.registrationEnabled !== false;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    const nameError = getFieldError('name', form.name);
    const contactError = getFieldError('contact', form.contact);
    if (nameError) newErrors.name = nameError;
    if (contactError) newErrors.contact = contactError;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const result = await submitRSVP(form);
      if (result?.success) {
        setStatus('success');
        // Animate form out, success in
        gsap.to(formRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.4,
          onComplete: () => {
            if (successRef.current) {
              gsap.fromTo(successRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.3)' }
              );
            }
          }
        });
      } else {
        throw new Error(result?.message || 'Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="rsvp-section section" id="rsvp" aria-label="RSVP section">
      <div className="rsvp-section__bg" aria-hidden="true">
        <div className="rsvp-section__bg-gradient" />
        <div className="rsvp-section__bg-circles">
          <div className="rsvp-circle rsvp-circle--1" />
          <div className="rsvp-circle rsvp-circle--2" />
        </div>
      </div>

      <div className="container rsvp-section__inner">
        <RevealOnScroll direction="up">
          <div className="rsvp-section__header">
            <p className="eyebrow">Join Us</p>
            <h2 className="rsvp-section__title display">Are You In?</h2>
            <p className="rsvp-section__subtitle">
              Let us know you&apos;re joining the night.
            </p>
          </div>
        </RevealOnScroll>

        <div className="rsvp-section__content">
          {!registrationEnabled ? (
            <div className="rsvp-closed glass-card" role="status">
              <p className="rsvp-closed__icon">🔒</p>
              <h3>Registration Closed</h3>
              <p>RSVP is currently not open. Check back soon.</p>
            </div>
          ) : status === 'success' ? (
            <div ref={successRef} className="rsvp-success glass-card" role="status" aria-live="polite">
              <Confetti />
              <div className="rsvp-success__icon">
                <CheckCircle size={48} />
              </div>
              <h3 className="rsvp-success__title">You&apos;re On The List</h3>
              <p className="rsvp-success__sub">
                See you at <strong>{c.venueName || '[VENUE_NAME]'}</strong>.
              </p>
              <p className="rsvp-success__msg">🎉 See you on the dance floor.</p>
            </div>
          ) : (
            <form
              ref={formRef}
              className="rsvp-form glass-card"
              onSubmit={handleSubmit}
              noValidate
              aria-label="RSVP form"
            >
              <div className="rsvp-form__grid">
                <FloatingLabelInput
                  id="rsvp-name"
                  label="Your Name *"
                  value={form.name}
                  onChange={handleChange('name')}
                  error={errors.name}
                  icon={User}
                  autoComplete="name"
                />

                <FloatingLabelInput
                  id="rsvp-contact"
                  label="Contact Number *"
                  type="tel"
                  value={form.contact}
                  onChange={handleChange('contact')}
                  error={errors.contact}
                  icon={Phone}
                  autoComplete="tel"
                />
              </div>

              {status === 'error' && (
                <div className="rsvp-form__error-msg" role="alert">
                  {errorMsg || 'Something went wrong. Please try again.'}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary rsvp-form__submit"
                disabled={status === 'submitting'}
                id="rsvp-submit-btn"
                aria-busy={status === 'submitting'}
              >
                {status === 'submitting' ? (
                  <>
                    <span className="rsvp-form__spinner" aria-hidden="true" />
                    Sending...
                  </>
                ) : (
                  "Count Me In →"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
