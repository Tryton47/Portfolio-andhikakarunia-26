'use client';

import { useState, useEffect } from 'react';
import { Trash2, MessageSquare } from 'lucide-react';

type Comment = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetch('/api/comments')
      .then(async (r) => {
        // We need raw data with IDs for admin, refetch differently
        // For now use the formatted endpoint
        const data = await r.json();
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment permanently?')) return;
    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    if (res.ok) setComments(comments.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-text-primary text-lg font-bold mb-1">
          Comment Moderation
        </h2>
        <p className="text-text-dim text-xs">
          Review and moderate public comments from visitors.
        </p>
      </div>

      <div className="glass-panel border border-border rounded-xl overflow-hidden">
        {comments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center gap-3">
            <MessageSquare size={32} className="text-text-dim" />
            <p className="text-text-dim text-sm">
              No comments yet. Visitors can leave comments from the public
              portfolio page.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {comments.map((c) => (
              <div
                key={c.id}
                className="flex items-start gap-4 p-5 hover:bg-card/50 transition-colors"
              >
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shrink-0 text-text-dim text-xs font-bold">
                  {c.name?.[0]?.toUpperCase() || '?'}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-text-primary text-sm font-bold">
                      {c.name}
                    </span>
                    <span className="text-text-dim text-[10px] font-mono">
                      {c.email}
                    </span>
                  </div>
                  <p className="text-text-muted text-xs leading-relaxed">
                    {c.message}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 border border-border rounded-lg text-text-dim hover:text-neon-red hover:border-neon-red/30 transition-colors shrink-0"
                  title="Delete comment"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
