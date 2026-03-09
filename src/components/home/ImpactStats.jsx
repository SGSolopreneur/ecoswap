import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Recycle, TreePine } from 'lucide-react';

const stats = [
  { icon: Leaf, label: 'Eco Products', value: '50+', description: 'Curated alternatives', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Recycle, label: 'Categories', value: '8', description: 'Product categories', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Droplets, label: 'Save Water', value: '70%', description: 'Less water usage', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: TreePine, label: 'Reduce Waste', value: '90%', description: 'Less plastic waste', color: 'text-green-600', bg: 'bg-green-50' },
];

export default function ImpactStats() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Make an Impact</h2>
          <p className="text-gray-500 max-w-md mx-auto">Every sustainable swap makes a difference. Here's what our community achieves together.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:shadow-black/5 transition-shadow duration-300"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm font-medium text-gray-700 mb-0.5">{stat.label}</div>
                <div className="text-xs text-gray-400">{stat.description}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}