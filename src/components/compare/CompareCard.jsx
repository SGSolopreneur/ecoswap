import React from 'react';
import { Leaf } from 'lucide-react';
import EcoScoreBadge from '../products/EcoScoreBadge';

export default function CompareCard({ product, type }) {
  const isEco = type === 'eco';

  return (
    <div className={`relative rounded-3xl border-2 overflow-hidden flex flex-col ${
      isEco
        ? 'border-[#2D6A4F] bg-gradient-to-b from-[#F0F7F4] to-white'
        : 'border-gray-200 bg-white'
    }`}>
      {isEco && (
        <div className="bg-[#1B4332] text-white text-xs font-semibold tracking-widest uppercase text-center py-2 flex items-center justify-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" />
          Recommended Alternative
        </div>
      )}

      {/* Image */}
      <div className={`h-44 flex items-center justify-center overflow-hidden ${isEco ? 'bg-[#E8F5EE]' : 'bg-gray-50'}`}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Leaf className="w-16 h-16 text-gray-200" />
        )}
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{product.name}</h3>
        </div>

        {/* Eco Score */}
        <div className="flex items-center gap-3">
          <EcoScoreBadge score={product.eco_score} size="md" />
          <div>
            <p className="text-xs text-gray-400">Eco Score</p>
            <p className="text-sm font-semibold text-gray-700">{product.eco_score}/10</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {product.stats.map((stat) => (
            <div key={stat.label} className="flex justify-between items-start gap-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className={`text-sm font-semibold text-right ${stat.highlight ? (isEco ? 'text-[#1B4332]' : 'text-red-500') : 'text-gray-800'}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {product.certs && product.certs.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.certs.map((c) => (
              <span key={c} className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                isEco ? 'bg-[#1B4332]/10 text-[#1B4332]' : 'bg-gray-100 text-gray-500'
              }`}>{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}