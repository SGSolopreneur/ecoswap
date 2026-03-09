import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Leaf, ArrowRightLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EcoScoreBadge from './EcoScoreBadge';

export default function ProductCard({ product, isFavorite, onToggleFavorite, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-black/5 hover:border-gray-200 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-16 h-16 text-[#B7C4A1]/50" />
          </div>
        )}
        
        {/* Eco Score */}
        <div className="absolute top-3 left-3">
          <EcoScoreBadge score={product.eco_score} />
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id); }}
          className={`absolute top-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isFavorite 
              ? 'bg-red-50 text-red-500' 
              : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Price */}
        {product.price_range && (
          <div className="absolute bottom-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-gray-700">
            {product.price_range}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-[#1B4332] transition-colors">
          {product.name}
        </h3>

        {product.replaces && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Replaces {product.replaces}</span>
          </div>
        )}

        {product.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
        )}

        {/* Benefits */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <Badge key={i} variant="secondary" className="bg-[#B7C4A1]/15 text-[#1B4332] border-0 text-xs font-medium px-2.5 py-0.5">
                {benefit}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        {product.buy_url && (
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-gray-200 hover:bg-[#1B4332] hover:text-white hover:border-[#1B4332] transition-all"
            onClick={(e) => { e.stopPropagation(); window.open(product.buy_url, '_blank'); }}
          >
            <ExternalLink className="w-3.5 h-3.5 mr-2" />
            Where to Buy
          </Button>
        )}
      </div>
    </motion.div>
  );
}