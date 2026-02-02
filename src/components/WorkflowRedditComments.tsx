"use client";

import { MessageSquare, ThumbsUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RedditComment {
  body?: string;
  date?: string; // ISO date string
  score?: number;
  author?: string;
  source?: string;
}

interface WorkflowRedditCommentsProps {
  comments: RedditComment[];
}

export function WorkflowRedditComments({ comments }: WorkflowRedditCommentsProps) {
  const { language } = useLanguage();

  if (!comments || comments.length === 0) {
    return null;
  }

  // 只显示前3条
  const displayedComments = comments.slice(0, 3);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center">
        <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-3" />
        <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
        {language === 'zh' ? 'Reddit 用户评价' : 'Reddit User Reviews'}
      </h3>
      <div className="space-y-4">
        {displayedComments.map((comment, index) => {
          return (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {comment.author && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <span className="text-orange-400 text-xs font-bold">
                          {comment.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        u/{comment.author}
                      </span>
                    </div>
                  )}
                  {comment.score !== undefined && comment.score !== null && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{comment.score}</span>
                    </div>
                  )}
                </div>
                {comment.date && (
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.date)}
                  </span>
                )}
              </div>
              
              {comment.body && (
                <p className="text-gray-300 leading-relaxed mb-4">
                  {comment.body.length > 300 
                    ? `${comment.body.substring(0, 300)}...` 
                    : comment.body}
                </p>
              )}
              
              {comment.source && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{comment.source}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
