import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare } from 'lucide-react';
import CompareSelector from '../components/compare/CompareSelector';
import CompareCard from '../components/compare/CompareCard';
import SavingsHighlight from '../components/compare/SavingsHighlight';

const COMPARISONS = [
  {
    id: 'razor',
    category: '🪒 Razors',
    conventional: {
      name: 'Fusion5 Cartridge Razors',
      brand: 'Gillette',
      eco_score: 2,
      image_url: 'https://images.unsplash.com/photo-1621607505735-75ae0394eeeb?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$3.50 / cartridge' },
        { label: 'Annual cost (avg)', value: '~$84 / year', highlight: true },
        { label: 'Lifespan', value: '5–7 shaves' },
        { label: 'Material', value: 'Plastic + steel' },
        { label: 'End of life', value: 'Landfill (400 yrs)', highlight: true },
        { label: 'Plastic per year', value: '~24 cartridges', highlight: true },
      ],
    },
    eco: {
      name: 'Classic Double-Edge Safety Razor',
      brand: 'Merkur / Bambaw',
      eco_score: 10,
      image_url: 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=600&auto=format&fit=crop',
      certs: ['Plastic-free', 'Recyclable blades', 'Lifetime handle'],
      stats: [
        { label: 'Unit cost', value: '$0.10 / blade' },
        { label: 'Annual cost (avg)', value: '~$5 / year', highlight: true },
        { label: 'Lifespan', value: 'Infinite (handle)' },
        { label: 'Material', value: 'Stainless steel' },
        { label: 'End of life', value: 'Fully recyclable', highlight: true },
        { label: 'Plastic per year', value: 'Zero', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$79',
      five_year_cost: '$395',
      co2_year: '~0.8 kg CO₂',
      waste: '24 plastic cartridges',
      note: 'Based on average of 2 shaves/week. Handle cost ~$35 one-time.',
    },
  },
  {
    id: 'water_bottle',
    category: '🍶 Water Bottles',
    conventional: {
      name: 'Single-Use Water Bottles',
      brand: 'Dasani / Generic',
      eco_score: 1,
      image_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$1.50–$2.00 / bottle' },
        { label: 'Annual cost (avg)', value: '~$600 / year', highlight: true },
        { label: 'Lifespan', value: 'Single use' },
        { label: 'Material', value: 'PET plastic' },
        { label: 'End of life', value: 'Landfill / ocean', highlight: true },
        { label: 'Bottles per year', value: '~400 bottles', highlight: true },
      ],
    },
    eco: {
      name: 'Insulated Stainless Steel Bottle',
      brand: 'Hydro Flask / Klean Kanteen',
      eco_score: 9,
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
      certs: ['BPA-free', 'Lifetime warranty', 'Recyclable'],
      stats: [
        { label: 'Unit cost', value: '$30–$45 one-time' },
        { label: 'Annual cost (avg)', value: '~$3 / year', highlight: true },
        { label: 'Lifespan', value: '10+ years' },
        { label: 'Material', value: '18/8 Stainless steel' },
        { label: 'End of life', value: 'Fully recyclable', highlight: true },
        { label: 'Bottles per year', value: 'Zero', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$597',
      five_year_cost: '$2,985',
      co2_year: '~32 kg CO₂',
      waste: '~400 plastic bottles',
      note: 'Based on 1 bottle/day habit. Bottle cost amortized over 10 years.',
    },
  },
  {
    id: 'shampoo',
    category: '🧴 Shampoo',
    conventional: {
      name: 'Head & Shoulders Classic',
      brand: 'Head & Shoulders',
      eco_score: 3,
      image_url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$6–$8 / bottle' },
        { label: 'Annual cost (avg)', value: '~$72 / year', highlight: true },
        { label: 'Bottles used / year', value: '~9 bottles', highlight: true },
        { label: 'Packaging', value: 'HDPE plastic' },
        { label: 'Formula', value: 'Sulfates, silicones' },
        { label: 'End of life', value: 'Landfill', highlight: true },
      ],
    },
    eco: {
      name: 'Concentrated Shampoo Bar',
      brand: 'HiBar / Ethique',
      eco_score: 9,
      image_url: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&auto=format&fit=crop',
      certs: ['Zero plastic', 'Vegan', 'Cruelty-free', 'Compostable packaging'],
      stats: [
        { label: 'Unit cost', value: '$12–$15 / bar' },
        { label: 'Annual cost (avg)', value: '~$36 / year', highlight: true },
        { label: 'Bars used / year', value: '~3 bars', highlight: true },
        { label: 'Packaging', value: 'Cardboard / none' },
        { label: 'Formula', value: 'Plant-based, sulfate-free' },
        { label: 'End of life', value: 'Zero waste', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$36',
      five_year_cost: '$180',
      co2_year: '~1.2 kg CO₂',
      waste: '9 plastic bottles',
      note: 'Each bar equals ~3 liquid bottles. Results vary by hair type and usage.',
    },
  },
  {
    id: 'paper_towels',
    category: '🧻 Paper Towels',
    conventional: {
      name: 'Bounty Select-a-Size',
      brand: 'Bounty (P&G)',
      eco_score: 2,
      image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$3–$4 / roll' },
        { label: 'Annual cost (avg)', value: '~$120 / year', highlight: true },
        { label: 'Rolls / year', value: '~35 rolls', highlight: true },
        { label: 'Material', value: 'Virgin wood pulp' },
        { label: 'Trees cut / year', value: '~1/30th of a tree', highlight: true },
        { label: 'End of life', value: 'Landfill', highlight: true },
      ],
    },
    eco: {
      name: 'Reusable Bamboo Towels',
      brand: 'Bambooee / Marley\'s Monsters',
      eco_score: 9,
      image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&auto=format&fit=crop',
      certs: ['FSC Certified', 'Washable 100x', 'BPA-free'],
      stats: [
        { label: 'Unit cost', value: '$20–$25 / roll' },
        { label: 'Annual cost (avg)', value: '~$5 / year', highlight: true },
        { label: 'Rolls / year', value: '0 (reuse)', highlight: true },
        { label: 'Material', value: 'Bamboo fiber' },
        { label: 'Trees cut / year', value: 'Zero', highlight: true },
        { label: 'End of life', value: 'Compostable', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$115',
      five_year_cost: '$575',
      co2_year: '~5.9 kg CO₂',
      waste: '~35 paper rolls',
      note: 'Each bamboo roll replaces ~60+ conventional rolls over its lifetime.',
    },
  },
  {
    id: 'coffee_cups',
    category: '☕ Coffee Cups',
    conventional: {
      name: 'Disposable Coffee Cups',
      brand: 'Starbucks / Generic',
      eco_score: 1,
      image_url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$0 (included in drink)' },
        { label: 'Cups / year (5/wk)', value: '~260 cups', highlight: true },
        { label: 'Recyclable?', value: 'No (plastic-lined)', highlight: true },
        { label: 'Material', value: 'Paper + polyethylene' },
        { label: 'CO₂ / cup', value: '~110g CO₂', highlight: true },
        { label: 'End of life', value: 'Landfill', highlight: true },
      ],
    },
    eco: {
      name: 'Insulated Reusable Travel Mug',
      brand: 'KeepCup / Frank Green',
      eco_score: 9,
      image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&auto=format&fit=crop',
      certs: ['BPA-free', 'Dishwasher safe', 'Lifetime warranty'],
      stats: [
        { label: 'Unit cost', value: '$30–$45 one-time' },
        { label: 'Cups / year', value: '0 disposable', highlight: true },
        { label: 'Recyclable?', value: 'Yes (end of life)', highlight: true },
        { label: 'Material', value: 'Borosilicate / steel' },
        { label: 'CO₂ / use', value: '~3g CO₂ amortized', highlight: true },
        { label: 'End of life', value: 'Recyclable', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$130 (café discounts)',
      five_year_cost: '$650',
      co2_year: '~27 kg CO₂',
      waste: '260 disposable cups',
      note: 'Many cafés offer $0.10–$0.50 discount for bringing your own cup.',
    },
  },
  {
    id: 'laundry',
    category: '🫧 Laundry Detergent',
    conventional: {
      name: 'Tide Original Liquid',
      brand: 'Tide (P&G)',
      eco_score: 3,
      image_url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop',
      certs: [],
      stats: [
        { label: 'Unit cost', value: '$0.25 / load' },
        { label: 'Annual cost (avg)', value: '~$78 / year', highlight: true },
        { label: 'Jugs / year', value: '~6 plastic jugs', highlight: true },
        { label: 'Formula', value: 'Synthetic, phosphates' },
        { label: 'Packaging', value: 'HDPE plastic jug' },
        { label: 'Shipping weight', value: 'Heavy (liquid)', highlight: true },
      ],
    },
    eco: {
      name: 'Laundry Detergent Sheets',
      brand: 'Tru Earth / Earth Breeze',
      eco_score: 9,
      image_url: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop',
      certs: ['EWG Verified', 'Leaping Bunny', 'Plastic-free', 'Hypoallergenic'],
      stats: [
        { label: 'Unit cost', value: '$0.17 / load' },
        { label: 'Annual cost (avg)', value: '~$51 / year', highlight: true },
        { label: 'Packaging / year', value: '2 cardboard strips', highlight: true },
        { label: 'Formula', value: 'Plant-based, phosphate-free' },
        { label: 'Packaging', value: 'Cardboard / compostable' },
        { label: 'Shipping weight', value: '94% lighter', highlight: true },
      ],
    },
    savings: {
      yearly_cost: '$27',
      five_year_cost: '$135',
      co2_year: '~2.4 kg CO₂',
      waste: '~6 plastic jugs',
      note: 'Based on 300 loads/year. CO₂ includes reduced shipping emissions.',
    },
  },
];

export default function Compare() {
  const [selectedId, setSelectedId] = useState(COMPARISONS[0].id);
  const selected = COMPARISONS.find(c => c.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-[#B7C4A1]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Compare Products</h1>
        </div>
        <p className="text-gray-500">See exactly how eco-friendly alternatives stack up against popular conventional brands.</p>
      </div>

      {/* Selector */}
      <div className="max-w-sm mb-8">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Choose a product category</p>
        <CompareSelector comparisons={COMPARISONS} selectedId={selectedId} onChange={setSelectedId} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Side-by-side cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CompareCard product={selected.conventional} type="conventional" />
            <CompareCard product={selected.eco} type="eco" />
          </div>

          {/* Savings highlight */}
          <SavingsHighlight savings={selected.savings} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}