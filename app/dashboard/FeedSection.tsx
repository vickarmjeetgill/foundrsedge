'use client';
import { useState, useEffect } from 'react';
import { Rss } from 'lucide-react';
import type { Post } from './feed-types';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

type Props = {
  memberName: string;
  memberBusiness: string;
};

type FeedFilter = 'all' | 'mine';

export default function FeedSection({ memberName, memberBusiness }: Props) {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [filter, setFilter] = useState<FeedFilter>('all');

  useEffect(() => {
    const raw = localStorage.getItem('fe_feed_posts');
    if (raw) { try { setPosts(JSON.parse(raw)); } catch {} }
  }, []);

  function addPost(post: Post) {
    const updated = [post, ...posts];
    localStorage.setItem('fe_feed_posts', JSON.stringify(updated));
    setPosts(updated);
  }

  function updatePost(updated: Post) {
    const newPosts = posts.map(p => p.id === updated.id ? updated : p);
    localStorage.setItem('fe_feed_posts', JSON.stringify(newPosts));
    setPosts(newPosts);
  }

  const visible = posts.filter(p => {
    if (p.removed) return false;
    if (filter === 'mine') return p.authorName === memberName;
    return true;
  });

  return (
    <div style={{ padding: '40px' }}>
      {/* Composer */}
      <PostComposer
        currentUserName={memberName}
        currentUserBusiness={memberBusiness}
        onPost={addPost}
      />

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 0, background: '#fff', borderLeft: '1px solid #e2e0d8', borderRight: '1px solid #e2e0d8', padding: '0 20px' }}>
        {([['all', 'All Posts'], ['mine', 'My Posts']] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            style={{
              padding: '14px 20px', background: 'none', border: 'none',
              borderBottom: filter === val ? '2px solid #e7b605' : '2px solid transparent',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '13px',
              color: filter === val ? '#2a2820' : '#9a9585',
              cursor: 'pointer', marginBottom: -1, transition: 'all 0.15s', letterSpacing: '0.03em',
            }}
          >
            {label}
            {val === 'mine' && posts.filter(p => !p.removed && p.authorName === memberName).length > 0 && (
              <span style={{ marginLeft: 6, fontSize: '11px', opacity: 0.7 }}>
                ({posts.filter(p => !p.removed && p.authorName === memberName).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Post list — each card shares a border with the next */}
      <div style={{ border: '1px solid #e2e0d8', borderTop: 'none' }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff' }}>
            <Rss size={40} style={{ color: '#e2e0d8', marginBottom: 16 }} />
            <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: 8, color: '#2a2820' }}>
              {filter === 'mine' ? 'No posts from you yet' : 'Feed is empty'}
            </div>
            <div style={{ color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '15px' }}>
              {filter === 'mine' ? 'Write something above to share with the network.' : 'Be the first to post something for the Founders Edge community.'}
            </div>
          </div>
        ) : (
          visible.map((post, i) => (
            <div key={post.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #e2e0d8' }}>
              <PostCard
                post={post}
                currentUserName={memberName}
                currentUserBusiness={memberBusiness}
                onUpdate={updatePost}
              />
            </div>
          ))
        )}
      </div>

      {visible.length > 0 && (
        <div style={{ textAlign: 'center', padding: '24px', color: '#9a9585', fontFamily: 'Noto Serif, serif', fontSize: '13px', background: '#fff', border: '1px solid #e2e0d8', borderTop: 'none' }}>
          {visible.length} post{visible.length !== 1 ? 's' : ''} · All caught up
        </div>
      )}
    </div>
  );
}
