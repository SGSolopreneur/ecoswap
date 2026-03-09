import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Leaf, Trash2, TrendingDown } from 'lucide-react';

export default function SavingsHighlight({ savings }) {
  const cards = [
    { icon: DollarSign, label: '1-Year Cost Saving', value: savings.yearly_cost, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { icon: TrendingDown, label: '5-Year Total Saving', value: savings.five_year_cost, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
    { icon: Leaf, label: 'CO₂ Saved / Year', value: savings.co2_year, color: 'text-[#1B4332]', bg: 'bg-[#F0F7F4]', border: 'border-[#B7C4A1]/30' },
    { icon: Trash2, label: 'Plastic Waste Avoided', value: savings.waste, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-3xl p-6 sm:p-8 text-white">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-[#B7C4A1] mb-1">By Making the Switch You Save</h3>
      <p className="text-white/60 text-sm mb-6">Estimated lifetime impact compared to the conventional product</p>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
            >
              <Icon className="w-5 h-5 text-[#B7C4A1] mb-3" />
              <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">{card.value}</div>
              <div className="text-xs text-white/60">{card.label}</div>
            </motion.div>
          );
        })}
      </div>
      {savings.note && (
        <p className="text-xs text-white/40 mt-4">* {savings.note}</p>
      )}
    </div>
  );
}