import React, { useState } from 'react';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { SHOPEE_REGIONS, getSavedRegion, saveRegion, getShopeeSearchUrl } from './shopeeUtils';

export default function ShopeeButton({ productName }) {
  const [region, setRegion] = useState(getSavedRegion);
  const [open, setOpen] = useState(false);

  const handleRegionChange = (code) => {
    saveRegion(code);
    setRegion(code);
    setOpen(false);
  };

  const handleShopee = () => {
    window.open(getShopeeSearchUrl(productName, region), '_blank', 'noopener');
  };

  const current = SHOPEE_REGIONS.find(r => r.code === region);

  return (
    <div className="relative flex rounded-xl overflow-hidden border border-[#EE4D2D]/30 flex-1">
      {/* Main Shopee button */}
      <button
        onClick={handleShopee}
        className="flex-1 flex items-center justify-center gap-2 bg-[#EE4D2D] hover:bg-[#d94429] text-white text-sm font-semibold px-4 py-2.5 transition-colors"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Shopee {current?.code}</span>
      </button>

      {/* Region picker toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        className="bg-[#EE4D2D] hover:bg-[#c93e26] text-white border-l border-white/20 px-2.5 transition-colors"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full right-0 mb-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-[180px]">
          {SHOPEE_REGIONS.map(r => (
            <button
              key={r.code}
              onClick={() => handleRegionChange(r.code)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${r.code === region ? 'font-semibold text-[#EE4D2D]' : 'text-gray-700'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}