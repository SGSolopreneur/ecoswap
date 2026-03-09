import React from 'react';
import { motion } from 'framer-motion';
import { Search, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HeroSection({ onSearch, searchQuery, setSearchQuery }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#40916C] text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#B7C4A1]/10 rounded-full blur-3xl" />
        <svg className="absolute top-10 right-10 opacity-10 w-64 h-64" viewBox="0 0 200 200">
          <path d="M100 20 C100 20, 40 60, 40 120 C40 160, 70 180, 100 180 C130 180, 160 160, 160 120 C160 60, 100 20, 100 20Z" fill="currentColor" />
          <line x1="100" y1="180" x2="100" y2="80" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
            <Leaf className="w-4 h-4" />
            <span>Discover sustainable alternatives</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Find Eco-Friendly
            <br />
            <span className="text-[#B7C4A1]">Alternatives</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Replace everyday products with sustainable options. Better for you, better for the planet.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); onSearch(); }}
            className="relative max-w-lg mx-auto"
          >
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#2D6A4F] transition-colors" />
              <input
                type="text"
                placeholder="Search for a product to replace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-4 sm:py-5 rounded-2xl bg-white text-gray-900 placeholder-gray-400 text-base shadow-2xl shadow-black/20 outline-none focus:ring-2 focus:ring-[#B7C4A1] transition-all"
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B4332] hover:bg-[#2D6A4F] text-white rounded-xl px-5 py-2.5 flex items-center gap-2 transition-all"
              >
                <span className="hidden sm:inline">Search</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}