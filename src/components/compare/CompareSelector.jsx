import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function CompareSelector({ comparisons, selectedId, onChange }) {
  return (
    <div className="relative">
      <select
        value={selectedId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-200 rounded-2xl px-5 py-4 pr-12 text-gray-900 font-medium text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B7C4A1] cursor-pointer"
      >
        {comparisons.map((c) => (
          <option key={c.id} value={c.id}>{c.category}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
}