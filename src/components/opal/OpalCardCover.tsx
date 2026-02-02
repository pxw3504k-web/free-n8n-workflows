interface OpalCardCoverProps {
  icon?: string | null;
  category?: string | null;
}

export function OpalCardCover({ icon, category }: OpalCardCoverProps) {
  // 根据 category 映射颜色
  const getGlowColor = () => {
    const categoryColors: Record<string, string> = {
      'Marketing': 'bg-purple-500',
      'Developer': 'bg-blue-500',
      'Development': 'bg-blue-500', // 兼容不同的命名
      'Writing': 'bg-orange-500',
    };
    return categoryColors[category || ''] || 'bg-emerald-500';
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#1e1e1e] flex items-center justify-center">
      {/* 光效 - 中心高光 */}
      <div 
        className={`absolute w-32 h-32 rounded-full blur-[80px] opacity-60 ${getGlowColor()}`}
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* 主体 - Emoji Icon */}
      <div 
        className="relative z-10 text-6xl drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5))',
        }}
      >
        {icon || '⚡'}
      </div>
    </div>
  );
}

