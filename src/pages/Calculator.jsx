import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalculatorIcon, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductInput from '../components/calculator/ProductInput';
import SavingsSummary from '../components/calculator/SavingsSummary';

// All CO2 values are in grams per unit
const PRODUCTS = [
  {
    id: 'water_bottles',
    emoji: '🍶',
    label: 'Plastic Water Bottles',
    unit: 'bottles per month',
    max: 60,
    step: 1,
    co2_conventional: 82,   // g per disposable bottle
    co2_eco: 2,             // g amortized per use (reusable bottle)
    eco_alt: 'Stainless Steel Water Bottle',
  },
  {
    id: 'plastic_bags',
    emoji: '🛍️',
    label: 'Plastic Shopping Bags',
    unit: 'bags per month',
    max: 60,
    step: 1,
    co2_conventional: 6,
    co2_eco: 0.3,
    eco_alt: 'Organic Cotton Tote Bag',
  },
  {
    id: 'paper_towels',
    emoji: '🧻',
    label: 'Paper Towel Rolls',
    unit: 'rolls per month',
    max: 20,
    step: 1,
    co2_conventional: 170,
    co2_eco: 30,
    eco_alt: 'Bamboo Paper Towels',
  },
  {
    id: 'shampoo',
    emoji: '🧴',
    label: 'Shampoo Bottles',
    unit: 'bottles per month',
    max: 4,
    step: 1,
    co2_conventional: 200,
    co2_eco: 40,
    eco_alt: 'Solid Shampoo Bar',
  },
  {
    id: 'laundry',
    emoji: '🫧',
    label: 'Laundry Loads',
    unit: 'loads per month',
    max: 30,
    step: 1,
    co2_conventional: 600,   // g per load (liquid in plastic jug)
    co2_eco: 180,            // g per load (concentrated sheet)
    eco_alt: 'Laundry Detergent Sheets',
  },
  {
    id: 'razors',
    emoji: '🪒',
    label: 'Disposable Razors',
    unit: 'razors per month',
    max: 10,
    step: 1,
    co2_conventional: 40,
    co2_eco: 1,
    eco_alt: 'Safety Razor',
  },
  {
    id: 'dryer_sheets',
    emoji: '🌬️',
    label: 'Dryer Sheets',
    unit: 'sheets per month',
    max: 60,
    step: 2,
    co2_conventional: 5,
    co2_eco: 0.5,
    eco_alt: 'Wool Dryer Balls',
  },
  {
    id: 'coffee_cups',
    emoji: '☕',
    label: 'Disposable Coffee Cups',
    unit: 'cups per month',
    max: 60,
    step: 1,
    co2_conventional: 110,
    co2_eco: 3,
    eco_alt: 'Reusable Travel Mug',
  },
  {
    id: 'food_wrap',
    emoji: '🥗',
    label: 'Plastic Cling Wrap Uses',
    unit: 'uses per month',
    max: 40,
    step: 1,
    co2_conventional: 15,
    co2_eco: 1,
    eco_alt: 'Beeswax Food Wraps',
  },
  {
    id: 'toilet_paper',
    emoji: '🧻',
    label: 'Toilet Paper Rolls',
    unit: 'rolls per month',
    max: 20,
    step: 1,
    co2_conventional: 140,
    co2_eco: 70,
    eco_alt: 'Bamboo Toilet Paper',
  },
];

const DEFAULT_VALUES = {
  water_bottles: 10,
  plastic_bags: 8,
  paper_towels: 4,
  shampoo: 1,
  laundry: 12,
  razors: 2,
  dryer_sheets: 16,
  coffee_cups: 20,
  food_wrap: 10,
  toilet_paper: 8,
};

export default function Calculator() {
  const [values, setValues] = useState(DEFAULT_VALUES);

  const handleChange = (id, val) => setValues(prev => ({ ...prev, [id]: val }));

  const reset = () => setValues(DEFAULT_VALUES);

  const { totalSavingKg, breakdown } = useMemo(() => {
    const breakdown = PRODUCTS.map(p => {
      const qty = values[p.id] || 0;
      const saving = qty * (p.co2_conventional - p.co2_eco); // grams
      return { label: p.label, emoji: p.emoji, saving };
    });
    const totalG = breakdown.reduce((sum, b) => sum + b.saving, 0);
    return { totalSavingKg: totalG / 1000, breakdown };
  }, [values]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center">
            <Calculator className="w-5 h-5 text-[#B7C4A1]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CO₂ Savings Calculator</h1>
        </div>
        <p className="text-gray-500 max-w-xl">
          Adjust the sliders to match your monthly usage. See how much CO₂ you'd save by switching to eco-friendly alternatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Inputs — left/top */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Your Monthly Consumption</h2>
            <Button variant="ghost" size="sm" onClick={reset} className="text-gray-400 hover:text-gray-700 gap-1.5 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          </div>
          {PRODUCTS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <ProductInput
                item={item}
                value={values[item.id] || 0}
                onChange={(val) => handleChange(item.id, val)}
              />
            </motion.div>
          ))}
        </div>

        {/* Summary — right/bottom (sticky on desktop) */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Your Impact</h2>
            <SavingsSummary totalSavingKg={totalSavingKg} breakdown={breakdown} />
          </div>
        </div>
      </div>
    </div>
  );
}