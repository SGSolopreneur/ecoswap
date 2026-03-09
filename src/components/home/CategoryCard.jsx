import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Droplets, UtensilsCrossed, Bath, Briefcase, Shirt, Apple, Flower2 } from 'lucide-react';

const categoryConfig = {
  cleaning: { icon: Sparkles, label: 'Cleaning', color: 'from-blue-50 to-cyan-50', iconColor: 'text-blue-600', border: 'border-blue-100' },
  personal_care: { icon: Droplets, label: 'Personal Care', color: 'from-pink-50 to-rose-50', iconColor: 'text-pink-600', border: 'border-pink-100' },
  kitchen: { icon: UtensilsCrossed, label: 'Kitchen', color: 'from-amber-50 to-orange-50', iconColor: 'text-amber-600', border: 'border-amber-100' },
  bathroom: { icon: Bath, label: 'Bathroom', color: 'from-teal-50 to-emerald-50', iconColor: 'text-teal-600', border: 'border-teal-100' },
  office: { icon: Briefcase, label: 'Office', color: 'from-slate-50 to-gray-50', iconColor: 'text-slate-600', border: 'border-slate-100' },
  fashion: { icon: Shirt, label: 'Fashion', color: 'from-purple-50 to-violet-50', iconColor: 'text-purple-600', border: 'border-purple-100' },
  food: { icon: Apple, label: 'Food', color: 'from-green-50 to-lime-50', iconColor: 'text-green-600', border: 'border-green-100' },
  garden: { icon: Flower2, label: 'Garden', color: 'from-emerald-50 to-green-50', iconColor: 'text-emerald-600', border: 'border-emerald-100' },
};

export default function CategoryCard({ category, count, onClick, index }) {
  const config = categoryConfig[category] || categoryConfig.cleaning;
  const Icon = config.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative group w-full text-left p-6 rounded-2xl bg-gradient-to-br ${config.color} border ${config.border} hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300`}
    >
      <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-6 h-6 ${config.iconColor}`} />
      </div>
      <h3 className="font-semibold text-gray-900 text-base mb-1">{config.label}</h3>
      <p className="text-sm text-gray-500">{count} product{count !== 1 ? 's' : ''}</p>
    </motion.button>
  );
}

export { categoryConfig };