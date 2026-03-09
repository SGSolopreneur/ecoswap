import React from 'react';

export default function EcoScoreBadge({ score, size = 'md' }) {
  const getColor = (s) => {
    if (s >= 8) return { bg: 'bg-emerald-100', text: 'text-emerald-700', ring: 'ring-emerald-200' };
    if (s >= 6) return { bg: 'bg-lime-100', text: 'text-lime-700', ring: 'ring-lime-200' };
    if (s >= 4) return { bg: 'bg-amber-100', text: 'text-amber-700', ring: 'ring-amber-200' };
    return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-200' };
  };

  const colors = getColor(score);
  const sizeClasses = size === 'lg' 
    ? 'w-14 h-14 text-lg' 
    : size === 'sm' 
      ? 'w-8 h-8 text-xs' 
      : 'w-10 h-10 text-sm';

  return (
    <div className={`${sizeClasses} ${colors.bg} ${colors.text} ring-2 ${colors.ring} rounded-xl flex items-center justify-center font-bold`}>
      {score}
    </div>
  );
}