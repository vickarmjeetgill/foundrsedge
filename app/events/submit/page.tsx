'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

type FormData = {
  title: string;
  category: string;
  price: string;
  date: string;
  time: string;
  duration: string;
  capacity: string;
  location: string;
  isOnline: boolean;
  description: string;
  hostName: string;
  contactEmail: string;
  tags: string;
  agreeGuidelines: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  title: '',
  category: 'Networking',
  price: '',
  date: '',
  time: '',
  duration: '',
  capacity: '',
  location: '',
  isOnline: false,
  description: '',
  hostName: '',
  contactEmail: '',
  tags: '',
  agreeGuidelines: false,
};

const categories = ['Networking', 'Workshop', 'Webinar', 'Supper Club', 'Other'];

function validateForm(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = 'Event title is required.';
  if (!form.date) errors.date = 'Date is required.';
  if (!form.time) errors.time = 'Time is required.';
  if (!form.duration.trim()) errors.duration = 'Duration is required.';
  if (!form.capacity.trim() || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0)
    errors.capacity = 'Valid capacity is required.';
  if (!form.isOnline && !form.location.trim()) errors.location = 'Location is required for in-person events.';
  if (!form.description.trim() || form.description.trim().length < 30)
    errors.description = 'Description must be at least 30 characters.';
  if (!form.hostName.trim()) errors.hostName = 'Host name is required.';
  if (!form.contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
    errors.contactEmail = 'Valid contact email is required.';
  if (!form.agreeGuidelines) errors.agreeGuidelines = 'You must agree to the event guidelines.';
  return errors;
}

export default function EventSubmitPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function handleOnlineToggle() {
    setForm(prev => ({
      ...prev,
      isOnline: !prev.isOnline,
      location: !prev.isOnline ? 'Meeting link provided upon registration' : '',
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstErrKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstErrKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitted(true);
  }

  const fieldStyle = (field: keyof FormData) => ({
    margin: 0,
    borderColor: errors[field] ? '#e7b605' : undefined,
  });

  if (submitted) {
    return (
      <PageLayout>
        <div className="page-hero">
          <div className="container">
            <div className="section-label">Submit an Event</div>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
              SUBMIT AN<br /><span style={{ color: '#e7b605' }}>EVENT</span>
            </h1>
          </div>
        </div>
        <div style={{ background: '#f9f9f7', padding: '100px 0' }}>
          <div className="container" style={{ maxWidth: 600 }}>
            <div style={{ background: '#fff', border: '1px solid #e2e0d8', borderTop: '4px solid #e7b605', padding: '60px 48px', textAlign: 'center' }}>
              <CheckCircle size={56} style={{ color: '#e7b605', marginBottom: 24 }} />
              <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: '28px', color: '#2a2820', marginBottom: 16 }}>
                Your event has been submitted!
              </h2>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', lineHeight: 1.8, fontSize: '16px', marginBottom: 32 }}>
                Thank you for submitting <strong>{form.title}</strong>. Our team reviews all submitted events within 2–3 business days. If approved, your event will be promoted to all Founders Edge members and featured on the events page.
              </p>
              <p style={{ fontFamily: 'Noto Serif, serif', color: '#9a9585', fontSize: '14px', marginBottom: 40 }}>
                You'll receive a confirmation email at <strong>{form.contactEmail}</strong> once a decision has been made.
              </p>
              <Link href="/events" className="btn-primary" style={{ justifyContent: 'center' }}>
                <ArrowLeft size={16} /> Back to Events
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <Link
            href="/events"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#9a9585', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            <ArrowLeft size={14} /> All Events
          </Link>
          <div className="section-label">Submit an Event</div>
          <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.05, marginBottom: 16 }}>
            SUBMIT AN<br /><span style={{ color: '#e7b605' }}>EVENT</span>
          </h1>
          <p style={{ fontFamily: 'Noto Serif, serif', color: '#999', fontSize: '17px', maxWidth: 480, lineHeight: 1.7 }}>
            Share your event with Calgary's entrepreneurial community. We review every submission personally.
          </p>
        </div>
      </div>

      {/* Form */}
      <div style={{ background: '#f9f9f7', padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {/* Notice */}
          <div style={{ borderLeft: '4px solid #e7b605', background: 'rgba(231,182,5,0.06)', padding: '20px 24px', marginBottom: 40 }}>
            <p style={{ fontFamily: 'Noto Serif, serif', color: '#5a5650', fontSize: '15px', lineHeight: 1.7 }}>
              <strong style={{ fontFamily: 'DM Sans, sans-serif', color: '#2a2820' }}>Review process:</strong> All submitted events are reviewed by our team within 2–3 business days. Approved events are promoted to all Founders Edge members and featured on the events page.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Event Title */}
            <div id="field-title" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5650', marginBottom: 8 }}>
                Event Title <span style={{ color: '#e7b605' }}>*</span>
              </label>
              <input
                className="input-field"
                placeholder="e.g. YYC Founders Networking Mixer"
                value={form.title}
                onChange={e => handleChange('title', e.target.value)}
                style={fieldStyle('title')}
              />
              {errors.title && <ErrorMsg msg={errors.title} />}
            </div>

            {/* Category + Price */}
            <div className="grid-form" style={{ marginBottom: 20 }}>
              <div id="field-category">
                <label style={labelStyle}>Category <span style={{ color: '#e7b605' }}>*</span></label>
                <select className="select-field" value={form.category} onChange={e => handleChange('category', e.target.value)} style={{ margin: 0 }}>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div id="field-price">
                <label style={labelStyle}>Price / Ticket Cost</label>
                <input
                  className="input-field"
                  placeholder="e.g. Free, $49, Members Only"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  style={{ margin: 0 }}
                />
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid-form" style={{ marginBottom: 20 }}>
              <div id="field-date">
                <label style={labelStyle}>Date <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  type="date"
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  style={fieldStyle('date')}
                />
                {errors.date && <ErrorMsg msg={errors.date} />}
              </div>
              <div id="field-time">
                <label style={labelStyle}>Time <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  type="time"
                  value={form.time}
                  onChange={e => handleChange('time', e.target.value)}
                  style={fieldStyle('time')}
                />
                {errors.time && <ErrorMsg msg={errors.time} />}
              </div>
            </div>

            {/* Duration + Capacity */}
            <div className="grid-form" style={{ marginBottom: 20 }}>
              <div id="field-duration">
                <label style={labelStyle}>Duration <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="e.g. 2 hrs, 90 mins"
                  value={form.duration}
                  onChange={e => handleChange('duration', e.target.value)}
                  style={fieldStyle('duration')}
                />
                {errors.duration && <ErrorMsg msg={errors.duration} />}
              </div>
              <div id="field-capacity">
                <label style={labelStyle}>Capacity <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={form.capacity}
                  onChange={e => handleChange('capacity', e.target.value)}
                  style={fieldStyle('capacity')}
                />
                {errors.capacity && <ErrorMsg msg={errors.capacity} />}
              </div>
            </div>

            {/* Location + Online toggle */}
            <div style={{ marginBottom: 20 }}>
              <div id="field-location" style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Location / Venue {!form.isOnline && <span style={{ color: '#e7b605' }}>*</span>}</label>
                <input
                  className="input-field"
                  placeholder={form.isOnline ? 'Meeting link provided upon registration' : 'e.g. Platform Calgary, 422 11 Ave SW'}
                  value={form.location}
                  onChange={e => handleChange('location', e.target.value)}
                  disabled={form.isOnline}
                  style={{ ...fieldStyle('location'), opacity: form.isOnline ? 0.6 : 1 }}
                />
                {errors.location && <ErrorMsg msg={errors.location} />}
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 600, color: '#5a5650' }}>
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={handleOnlineToggle}
                  style={{ width: 16, height: 16, accentColor: '#e7b605', cursor: 'pointer' }}
                />
                This is an online event
              </label>
            </div>

            {/* Description */}
            <div id="field-description" style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Description <span style={{ color: '#e7b605' }}>*</span></label>
              <textarea
                className="input-field"
                placeholder="Describe your event — what attendees will learn, experience, or take away. Be specific and compelling."
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                style={{ ...fieldStyle('description'), height: 120, resize: 'vertical', lineHeight: 1.6 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {errors.description ? <ErrorMsg msg={errors.description} /> : <span />}
                <span style={{ fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
                  {form.description.length} chars
                </span>
              </div>
            </div>

            {/* Host Name + Contact Email */}
            <div className="grid-form" style={{ marginBottom: 20 }}>
              <div id="field-hostName">
                <label style={labelStyle}>Host / Organizer Name <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  placeholder="Your name or organization"
                  value={form.hostName}
                  onChange={e => handleChange('hostName', e.target.value)}
                  style={fieldStyle('hostName')}
                />
                {errors.hostName && <ErrorMsg msg={errors.hostName} />}
              </div>
              <div id="field-contactEmail">
                <label style={labelStyle}>Contact Email <span style={{ color: '#e7b605' }}>*</span></label>
                <input
                  className="input-field"
                  type="email"
                  placeholder="you@example.com"
                  value={form.contactEmail}
                  onChange={e => handleChange('contactEmail', e.target.value)}
                  style={fieldStyle('contactEmail')}
                />
                {errors.contactEmail && <ErrorMsg msg={errors.contactEmail} />}
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 32 }}>
              <label style={labelStyle}>Tags (comma-separated)</label>
              <input
                className="input-field"
                placeholder="e.g. Networking, Calgary, Tech, Startups"
                value={form.tags}
                onChange={e => handleChange('tags', e.target.value)}
                style={{ margin: 0 }}
              />
              <div style={{ marginTop: 6, fontSize: '12px', color: '#9a9585', fontFamily: 'DM Sans, sans-serif' }}>
                Tags help members find your event. Use 2–5 relevant keywords.
              </div>
            </div>

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: '1px solid #e2e0d8', marginBottom: 28 }} />

            {/* Guidelines checkbox */}
            <div id="field-agreeGuidelines" style={{ marginBottom: 32 }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.agreeGuidelines}
                  onChange={e => handleChange('agreeGuidelines', e.target.checked)}
                  style={{ width: 16, height: 16, marginTop: 2, accentColor: '#e7b605', cursor: 'pointer', flexShrink: 0 }}
                />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '14px', color: '#5a5650', lineHeight: 1.6 }}>
                  I agree to the{' '}
                  <Link href="/membership" style={{ color: '#9b7011', textDecoration: 'underline' }}>Founders Edge Event Guidelines</Link>.
                  I confirm this event is relevant to Calgary's entrepreneurial community and I have authority to submit it.
                  <span style={{ color: '#e7b605' }}> *</span>
                </span>
              </label>
              {errors.agreeGuidelines && <ErrorMsg msg={errors.agreeGuidelines} />}
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '18px' }}>
              Submit for Review
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 700,
  fontSize: '12px',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#5a5650',
  marginBottom: 8,
};

function ErrorMsg({ msg }: { msg: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, color: '#9b7011', fontFamily: 'DM Sans, sans-serif', fontSize: '12px', fontWeight: 600 }}>
      <AlertCircle size={12} />
      {msg}
    </div>
  );
}
