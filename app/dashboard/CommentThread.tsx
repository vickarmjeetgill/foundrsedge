'use client';
import { useState, useEffect } from 'react';
import { Heart, CornerDownRight, Flag } from 'lucide-react';
import { type Comment, getSessionId, timeAgo, pushNotification } from './feed-types';

type Props = {
  postId: string;
  currentUserName: string;
  currentUserBusiness: string;
  onCommentAdded: () => void;
};

const avatarStyle = (bg: string, color: string, size: number): React.CSSProperties => ({
  width: size, height: size, background: bg,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: size * 0.38, fontWeight: 800, color, flexShrink: 0,
  fontFamily: 'DM Sans, sans-serif',
});

export default function CommentThread({ postId, currentUserName, currentUserBusiness, onCommentAdded }: Props) {
  const [comments, setComments]   = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo]     = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const raw = localStorage.getItem('fe_post_comments');
    const all: Comment[] = raw ? JSON.parse(raw) : [];
    setComments(all.filter(c => c.postId === postId && !c.removed));
  }, [postId]);

  function persist(updated: Comment[]) {
    const raw = localStorage.getItem('fe_post_comments');
    const all: Comment[] = raw ? JSON.parse(raw) : [];
    const others = all.filter(c => c.postId !== postId);
    localStorage.setItem('fe_post_comments', JSON.stringify([...others, ...updated]));
    setComments(updated.filter(c => !c.removed));
  }

  function submitComment() {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `cmt_${Date.now()}`,
      postId,
      authorName: currentUserName,
      authorBusiness: currentUserBusiness,
      content: newComment.trim(),
      likes: [],
      createdAt: new Date().toISOString(),
    };
    persist([...comments, c]);
    setNewComment('');
    onCommentAdded();
    pushNotification({ type: 'comment', message: `You commented on a post.`, postId, read: false });
  }

  function submitReply(parentId: string) {
    if (!replyText.trim()) return;
    const c: Comment = {
      id: `cmt_${Date.now()}`,
      postId,
      parentId,
      authorName: currentUserName,
      authorBusiness: currentUserBusiness,
      content: replyText.trim(),
      likes: [],
      createdAt: new Date().toISOString(),
    };
    persist([...comments, c]);
    setReplyText('');
    setReplyTo(null);
    onCommentAdded();
    pushNotification({ type: 'reply', message: `You replied to a comment.`, postId, read: false });
  }

  function toggleLike(id: string) {
    const sid = getSessionId();
    const updated = comments.map(c => {
      if (c.id !== id) return c;
      const already = c.likes.includes(sid);
      return { ...c, likes: already ? c.likes.filter(l => l !== sid) : [...c.likes, sid] };
    });
    persist(updated);
  }

  function flagComment(c: Comment) {
    if (flaggedIds.has(c.id)) return;
    const report = {
      id: `flag_${Date.now()}`,
      contentType: 'comment' as const,
      contentId: c.id,
      contentPreview: c.content.slice(0, 100),
      authorName: c.authorName,
      reportedBy: currentUserName || 'Member',
      reason: 'Reported by member',
      details: '',
      status: 'pending' as const,
      reportedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('fe_flag_reports') || '[]');
    localStorage.setItem('fe_flag_reports', JSON.stringify([report, ...existing]));
    setFlaggedIds(prev => new Set(prev).add(c.id));
  }

  const sid = getSessionId();
  const topLevel = comments.filter(c => !c.parentId);
  const replies = (parentId: string) => comments.filter(c => c.parentId === parentId);

  const inputBase: React.CSSProperties = {
    width: '100%', border: '1px solid #e2e0d8', padding: '10px 14px',
    fontFamily: 'Noto Serif, serif', fontSize: '14px',
    resize: 'none', outline: 'none', boxSizing: 'border-box', background: '#f9f9f7',
    lineHeight: 1.6,
  };

  return (
    <div>
      {/* New comment input */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'flex-start' }}>
        <div style={avatarStyle('#e7b605', '#000', 32)}>{currentUserName.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Write a comment... (Enter to post)"
            rows={2}
            style={inputBase}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
          />
          {newComment.trim() && (
            <button onClick={submitComment} className="btn-primary" style={{ marginTop: 6, padding: '7px 16px', fontSize: '12px' }}>
              Post
            </button>
          )}
        </div>
      </div>

      {/* Comment list */}
      {topLevel.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '16px 0', color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '13px' }}>
          No comments yet — be the first.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topLevel.map(comment => {
            const isLiked = comment.likes.includes(sid);
            const commentReplies = replies(comment.id);
            const isFlagged = flaggedIds.has(comment.id);

            return (
              <div key={comment.id}>
                {/* Comment */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={avatarStyle('#1a1a1a', '#e7b605', 32)}>{comment.authorName.charAt(0)}</div>
                  <div style={{ flex: 1, background: '#f9f9f7', padding: '12px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px', color: '#2a2820' }}>{comment.authorName}</span>
                        <span style={{ fontSize: '11px', color: '#9a9585', marginLeft: 8 }}>{comment.authorBusiness} · {timeAgo(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p style={{ fontFamily: 'Noto Serif, serif', color: '#2a2820', fontSize: '14px', lineHeight: 1.6, marginBottom: 8 }}>
                      {comment.content}
                    </p>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <button onClick={() => toggleLike(comment.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: isLiked ? '#e7b605' : '#9a9585', padding: 0, transition: 'color 0.15s' }}>
                        <Heart size={13} fill={isLiked ? '#e7b605' : 'none'} />
                        {comment.likes.length > 0 && comment.likes.length}
                      </button>
                      <button onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: replyTo === comment.id ? '#2a2820' : '#9a9585', padding: 0 }}>
                        <CornerDownRight size={13} /> Reply
                      </button>
                      <button onClick={() => flagComment(comment)} title="Report comment" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: isFlagged ? 'default' : 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', color: isFlagged ? '#27ae60' : '#9a9585', padding: 0, marginLeft: 'auto', transition: 'color 0.15s' }}>
                        <Flag size={12} /> {isFlagged ? 'Reported' : ''}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reply input */}
                {replyTo === comment.id && (
                  <div style={{ display: 'flex', gap: 10, marginTop: 8, marginLeft: 42 }}>
                    <div style={avatarStyle('#e7b605', '#000', 28)}>{currentUserName.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.authorName}...`}
                        rows={2}
                        style={{ ...inputBase, fontSize: '13px', padding: '8px 12px' }}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitReply(comment.id); } }}
                        autoFocus
                      />
                      {replyText.trim() && (
                        <button onClick={() => submitReply(comment.id)} className="btn-primary" style={{ marginTop: 6, padding: '6px 14px', fontSize: '11px' }}>
                          Reply
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Nested replies */}
                {commentReplies.map(reply => {
                  const isReplyLiked = reply.likes.includes(sid);
                  return (
                    <div key={reply.id} style={{ display: 'flex', gap: 10, marginTop: 8, marginLeft: 42 }}>
                      <div style={avatarStyle('#1a1a1a', '#e7b605', 28)}>{reply.authorName.charAt(0)}</div>
                      <div style={{ flex: 1, background: '#f0efe9', padding: '10px 14px' }}>
                        <div style={{ marginBottom: 4 }}>
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '12px', color: '#2a2820' }}>{reply.authorName}</span>
                          <span style={{ fontSize: '11px', color: '#9a9585', marginLeft: 8 }}>{reply.authorBusiness} · {timeAgo(reply.createdAt)}</span>
                        </div>
                        <p style={{ fontFamily: 'Noto Serif, serif', color: '#2a2820', fontSize: '13px', lineHeight: 1.6, marginBottom: 6 }}>
                          {reply.content}
                        </p>
                        <button onClick={() => toggleLike(reply.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '11px', color: isReplyLiked ? '#e7b605' : '#9a9585', padding: 0 }}>
                          <Heart size={11} fill={isReplyLiked ? '#e7b605' : 'none'} />
                          {reply.likes.length > 0 && reply.likes.length}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
