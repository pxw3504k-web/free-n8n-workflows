'use client';

interface OpalCoverProps {
  icon: string | null;
  category: string | null;
}

// 根据 category 映射颜色
const categoryColors: Record<string, { glow: string; blur: string }> = {
  'Marketing': { glow: 'bg-purple-500/30', blur: 'bg-purple-500/20' },
  'Productivity': { glow: 'bg-blue-500/30', blur: 'bg-blue-500/20' },
  'Development': { glow: 'bg-cyan-500/30', blur: 'bg-cyan-500/20' },
  'Writing': { glow: 'bg-green-500/30', blur: 'bg-green-500/20' },
  'Design': { glow: 'bg-pink-500/30', blur: 'bg-pink-500/20' },
  'Business': { glow: 'bg-orange-500/30', blur: 'bg-orange-500/20' },
  'Education': { glow: 'bg-indigo-500/30', blur: 'bg-indigo-500/20' },
};

// 默认颜色
const defaultColor = { glow: 'bg-primary/30', blur: 'bg-primary/20' };

export function OpalCover({ icon, category }: OpalCoverProps) {
  const colors = category ? categoryColors[category] || defaultColor : defaultColor;
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      {/* 背景模糊光晕 */}
      <div className={`absolute inset-0 ${colors.blur} blur-3xl opacity-50`} />
      
      {/* 中心光晕 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${colors.glow} rounded-full blur-2xl opacity-60`} />
      
      {/* Icon */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {icon ? (
          <div className="text-6xl md:text-7xl lg:text-8xl select-none">
            {icon}
          </div>
        ) : (
          <div className="text-6xl md:text-7xl lg:text-8xl text-gray-600 select-none">
            ⚡
          </div>
        )}
      </div>
    </div>
  );
}

