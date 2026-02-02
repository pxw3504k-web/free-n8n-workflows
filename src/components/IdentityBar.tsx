"use client";

import Link from 'next/link';

interface Identity {
  label: string;
  icon: string;
  query: string;
}

const identities: Identity[] = [
  { label: 'Marketers', icon: '📈', query: 'marketing' },
  { label: 'Founders', icon: '💼', query: 'business' },
  { label: 'Creators', icon: '🎨', query: 'content' },
  { label: 'Beginners', icon: '👶', query: 'beginner' },
  { label: 'Developers', icon: '💻', query: 'developer' },
  { label: 'Designers', icon: '✨', query: 'design' },
  { label: 'Sales', icon: '💰', query: 'sales' },
  { label: 'HR', icon: '👥', query: 'hr' },
  { label: 'E-commerce', icon: '🛒', query: 'ecommerce' },
  { label: 'Social Media', icon: '📱', query: 'social media' },
  { label: 'Data Analysts', icon: '📊', query: 'analytics' },
  { label: 'Customer Support', icon: '🎧', query: 'support' },
  { label: 'Students', icon: '📚', query: 'education' },
  { label: 'Freelancers', icon: '🚀', query: 'freelance' },
];

export function IdentityBar() {
  return (
    <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap px-4">
      {identities.map((identity) => (
        <Link
          key={identity.query}
          href={`/search?q=${encodeURIComponent(identity.query)}`}
          className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-800 text-white text-xs md:text-sm font-medium hover:bg-purple-600/80 hover:text-white transition-colors duration-200"
        >
          <span>{identity.icon}</span>
          <span>{identity.label}</span>
        </Link>
      ))}
    </div>
  );
}
