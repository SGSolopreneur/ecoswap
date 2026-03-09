import React from 'react';

export default function ProductInput({ item, value, onChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#B7C4A1] hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{item.emoji}</div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
            <p className="text-xs text-gray-400">{item.unit}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xl font-bold text-[#1B4332]">{value}</div>
          <div className="text-xs text-gray-400">/ month</div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={item.max}
        step={item.step || 1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #2D6A4F ${(value / item.max) * 100}%, #e5e7eb ${(value / item.max) * 100}%)`,
          accentColor: '#2D6A4F',
        }}
      />

      <div className="flex justify-between text-xs text-gray-300 mt-1.5">
        <span>0</span>
        <span>{item.max}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
        <span className="text-gray-500 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-300 inline-block"></span>
          Now: ~{(value * item.co2_conventional / 1000).toFixed(2)} kg CO₂/mo
        </span>
        <span className="text-[#2D6A4F] font-medium flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          Eco: ~{(value * item.co2_eco / 1000).toFixed(2)} kg CO₂/mo
        </span>
      </div>
    </div>
  );
}