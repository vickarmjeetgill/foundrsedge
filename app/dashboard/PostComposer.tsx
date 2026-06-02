'use client';
import { useState, useEffect, useRef } from 'react';
import { Calendar, Tag, X, ChevronDown } from 'lucide-react';
import type { Post } from './feed-types';

type Props = {
  currentUserName: string;
  currentUserBusiness: string;
  onPost: (post: Post) => void;
};

type LinkedContent = {
  type: 'event' | 'offer';
  title: string;
  subtitle?: string;
  url?: string;
};

const MAX_CHARS = 500;

export default function PostComposer({ currentUserName, currentUserBusiness, onPost }: Props) {
  const [content, setContent]             = useState('');
  const [linked, setLinked]               = useState<LinkedContent | null>(null);
  const [pickerType, setPickerType]       = useState<'event' | 'offer' | null>(null);
  const [events, setEvents]               = useState<any[]>([]);
  const [offers, setOffers]               = useState<any[]>([]);
  const pickerRef                         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const evRaw = localStorage.getItem('fe_my_submissions');
    if (evRaw) { try { setEvents(JSON.parse(evRaw)); } catch {} }
    const offRaw = localStorage.getItem('fe_approved_offers');
    if (offRaw) { try { setOffers(JSON.parse(offRaw)); } catch {} }
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerType(null);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function submit() {
    if (!content.trim()) return;
    const post: Post = {
      id:              `post_${Date.now()}`,
      authorName:      currentUserName,
      authorBusiness:  currentUserBusiness,
      content:         content.trim(),
      linkedType:      linked?.type,
      linkedTitle:     linked?.title,
      linkedSubtitle:  linked?.subtitle,
      linkedUrl:       linked?.url,
      likes:           [],
      commentCount:    0,
      flagCount:       0,
      createdAt:       new Date().toISOString(),
    };
    onPost(post);
    setContent('');
    setLinked(null);
    setPickerType(null);
  }

  const overLimit = content.length >= MAX_CHARS;

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e0d8', padding: '24px', marginBottom: 0 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ width: 40, height: 40, background: '#e7b605', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', fontWeight: 800, fontSize: '16px', color: '#000', flexShrink: 0 }}>
          {currentUserName.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          {/* Text input */}
          <textarea
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Share something with the Founders Edge network..."
            rows={3}
            style={{ width: '100%', border: '1px solid #e2e0d8', padding: '14px 16px', fontFamily: 'Noto Serif, serif', fontSize: '15px', lineHeight: 1.7, resize: 'none', outline: 'none', boxSizing: 'border-box', background: '#f9f9f7', transition: 'border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#e7b605'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e0d8'; }}
          />
          <div style={{ textAlign: 'right', marginTop: 4, marginBottom: linked ? 12 : 0 }}>
            <span style={{ fontSize: '11px', color: overLimit ? '#c0392b' : '#b8b4ae', fontFamily: 'DM Sans, sans-serif', fontWeight: 600 }}>
              {content.length}/{MAX_CHARS}
            </span>
          </div>

          {/* Linked content preview */}
          {linked && (
            <div style={{ marginBottom: 14, border: '1px solid #e2e0d8', borderLeft: '4px solid #e7b605', padding: '12px 16px', background: '#f9f9f7', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#9b7011', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {linked.type === 'event' ? '📅 Linked Event' : '🏷️ Linked Offer'}
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '14px', color: '#2a2820' }}>{linked.title}</div>
                {linked.subtitle && <div style={{ fontSize: '12px', color: '#9a9585', marginTop: 2 }}>{linked.subtitle}</div>}
              </div>
              <button onClick={() => setLinked(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a9585', padding: '2px 4px', flexShrink: 0 }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', position: 'relative' }} ref={pickerRef}>
            {!linked && (
              <>
                <button
                  onClick={() => setPickerType(pickerType === 'event' ? null : 'event')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${pickerType === 'event' ? '#e7b605' : '#e2e0d8'}`, background: pickerType === 'event' ? 'rgba(231,182,5,0.08)' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: pickerType === 'event' ? '#9b7011' : '#5a5650', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.03em' }}
                >
                  <Calendar size={13} /> Link Event <ChevronDown size={12} />
                </button>
                <button
                  onClick={() => setPickerType(pickerType === 'offer' ? null : 'offer')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${pickerType === 'offer' ? '#e7b605' : '#e2e0d8'}`, background: pickerType === 'offer' ? 'rgba(231,182,5,0.08)' : 'transparent', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: pickerType === 'offer' ? '#9b7011' : '#5a5650', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.03em' }}
                >
                  <Tag size={13} /> Link Offer <ChevronDown size={12} />
                </button>
              </>
            )}

            <button
              onClick={submit}
              disabled={!content.trim()}
              className="btn-primary"
              style={{ marginLeft: 'auto', padding: '10px 28px', fontSize: '13px', opacity: content.trim() ? 1 : 0.45, cursor: content.trim() ? 'pointer' : 'not-allowed' }}
            >
              Post
            </button>

            {/* Picker dropdown */}
            {pickerType && (
              <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, background: '#fff', border: '1px solid #e2e0d8', minWidth: 300, maxWidth: 400, maxHeight: 240, overflowY: 'auto', zIndex: 150, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0efe9', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', color: '#9a9585', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {pickerType === 'event' ? 'My Event Submissions' : 'Approved Offers'}
                </div>
                {pickerType === 'event' ? (
                  events.length === 0 ? (
                    <div style={{ padding: '20px 16px', color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '13px', textAlign: 'center' }}>
                      No submitted events yet. <br />Submit an event first.
                    </div>
                  ) : (
                    events.map(ev => (
                      <button key={ev.id} onClick={() => { setLinked({ type: 'event', title: ev.title, subtitle: ev.category, url: '/events' }); setPickerType(null); }} style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', borderBottom: '1px solid #f0efe9', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#2a2820', marginBottom: 2 }}>{ev.title}</div>
                        <div style={{ fontSize: '11px', color: '#9a9585' }}>{ev.category}</div>
                      </button>
                    ))
                  )
                ) : (
                  offers.length === 0 ? (
                    <div style={{ padding: '20px 16px', color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '13px', textAlign: 'center' }}>
                      No approved offers available.
                    </div>
                  ) : (
                    offers.map(off => (
                      <button key={off.id} onClick={() => { setLinked({ type: 'offer', title: off.title, subtitle: `${off.discount} · ${off.businessName}`, url: '/offers' }); setPickerType(null); }} style={{ display: 'block', width: '100%', padding: '12px 16px', border: 'none', borderBottom: '1px solid #f0efe9', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9f9f7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#2a2820', marginBottom: 2 }}>{off.title}</div>
                        <div style={{ fontSize: '11px', color: '#9a9585' }}>{off.discount} · {off.businessName}</div>
                      </button>
                    ))
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
