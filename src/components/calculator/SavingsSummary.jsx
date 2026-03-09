import React from 'react';
import { motion } from 'framer-motion';
import { TreePine, Car, Zap, Droplets } from 'lucide-react';

function EquivalentCard({ icon: Icon, value, label, color, bg }) {
  return (
    <div className={`${bg} rounded-2xl p-4 flex flex-col items-center text-center gap-2`}>
      <div className={`w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600 leading-tight">{label}</div>
    </div>
  );
}

export default function SavingsSummary({ totalSavingKg, breakdown }) {
  const annualSaving = totalSavingKg * 12;
  const trees = (annualSaving / 21).toFixed(1);
  const carKm = (annualSaving / 0.21).toFixed(0);
  const kwh = (annualSaving / 0.233).toFixed(0);

  const maxSaving = Math.max(...breakdown.map(b => b.saving), 1);

  return (
    <div className="space-y-6">
      {/* Main number */}
      <motion.div
        key={totalSavingKg}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-3xl p-8 text-white text-center"
      >
        <p className="text-sm font-medium text-[#B7C4A1] mb-2 uppercase tracking-widest">Monthly CO₂ Savings</p>
        <div className="text-6xl font-black mb-1 tabular-nums">
          {totalSavingKg < 1 ? (totalSavingKg * 1000).toFixed(0) : totalSavingKg.toFixed(1)}
          <span className="text-2xl font-normal ml-1 text-[#B7C4A1]">
            {totalSavingKg < 1 ? 'g' : 'kg'}
          </span>
        </div>
        <p className="text-[#B7C4A1] text-sm">of CO₂ avoided per month</p>
        <div className="mt-4 pt-4 border-t border-white/10 text-sm text-white/70">
          That's <span className="text-white font-semibold">{annualSaving.toFixed(1)} kg</span> saved per year
        </div>
      </motion.div>

      {/* Equivalents */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">That's equivalent to...</p>
        <div className="grid grid-cols-3 gap-3">
          <EquivalentCard icon={TreePine} value={trees} label="trees absorbing CO₂ for a year" color="text-emerald-700" bg="bg-emerald-50" />
          <EquivalentCard icon={Car} value={`${carKm}km`} label="not driven by an average car" color="text-blue-700" bg="bg-blue-50" />
          <EquivalentCard icon={Zap} value={`${kwh}kWh`} label="of electricity saved" color="text-amber-700" bg="bg-amber-50" />
        </div>
      </div>

      {/* Per-product breakdown */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Savings Breakdown</p>
        <div className="space-y-3">
          {breakdown
            .filter(b => b.saving > 0)
            .sort((a, b) => b.saving - a.saving)
            .map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <span className="text-lg">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate">{b.label}</span>
                    <span className="text-xs font-bold text-[#1B4332] ml-2 shrink-0">
                      {b.saving >= 1000 ? `${(b.saving / 1000).toFixed(1)}kg` : `${b.saving.toFixed(0)}g`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(b.saving / maxSaving) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-[#2D6A4F] to-[#40916C] rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          {breakdown.every(b => b.saving === 0) && (
            <p className="text-sm text-gray-400 text-center py-4">Adjust the sliders to see your savings</p>
          )}
        </div>
      </div>
    </div>
  );
}