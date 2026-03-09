import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CompareSelector({ comparisons, selectedId, onChange }) {
  return (
    <Select value={selectedId} onValueChange={onChange}>
      <SelectTrigger className="w-full h-14 rounded-2xl px-5 text-gray-900 font-medium text-base shadow-sm border-gray-200 focus:ring-2 focus:ring-[#B7C4A1]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {comparisons.map((c) => (
          <SelectItem key={c.id} value={c.id} className="text-sm">
            {c.category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}