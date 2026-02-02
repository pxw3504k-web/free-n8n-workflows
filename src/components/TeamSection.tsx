"use client";

import { motion } from 'framer-motion';
import { Linkedin, Settings, Code, Percent } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  roleZh: string;
  linkedin: string;
  icon: React.ReactNode;
}

const teamMembers: TeamMember[] = [
  {
    name: 'n8n Workflows Official',
    role: 'System Admin',
    roleZh: '系统管理员',
    linkedin: 'https://storage.googleapis.com/aiseo-image/images/static/qr.jpg',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function TeamSection() {
  const { language, t } = useLanguage();
  const [showLocalQr, setShowLocalQr] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('team.title')}
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-lg ml-2">
              Free N8N
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            {t('team.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-xl hover:border-primary/50 transition-all group relative"
            >
              {/* Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                {member.icon}
              </div>

              {/* Avatar Placeholder */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {member.name.charAt(0)}
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-white text-center mb-2">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-gray-400 text-center mb-4">
                {language === 'zh' ? member.roleZh : member.role}
              </p>

              {/* Join group (open modal) */}
              <button
                type="button"
                onClick={() => setShowLocalQr(true)}
                className="flex items-center justify-center gap-2 text-primary hover:text-accent transition-colors text-sm"
              >
                <Linkedin className="w-4 h-4" />
                <span>{t('footer.joinGroup')}</span>
              </button>
            </motion.div>
          ))}
        </div>
        {showLocalQr && (
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowLocalQr(false)} />
            <div className="relative z-70 bg-[#0b0b1f] border border-white/10 rounded-xl p-6 max-w-md w-full mx-4">
              <button onClick={() => setShowLocalQr(false)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
              <h3 className="text-lg font-bold text-white mb-4">{t('footer.joinGroup')}</h3>
              <img src="https://storage.googleapis.com/aiseo-image/images/static/qr.jpg" alt="Group QR" className="w-64 h-64 mx-auto rounded-md border border-white/10" />
              <p className="text-center text-sm text-gray-400 mt-4">{t('contact.scanHint')}</p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}

