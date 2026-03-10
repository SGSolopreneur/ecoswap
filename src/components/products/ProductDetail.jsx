import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ExternalLink, Leaf, ArrowRightLeft, Award, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EcoScoreBadge from './EcoScoreBadge';
import ShopeeButton from '@/components/shopee/ShopeeButton';
import ReviewList from './ReviewList';

export default function ProductDetail({ product, isFavorite, onToggleFavorite, onClose }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Header Image */}
          <div className="relative h-56 bg-gradient-to-br from-[#B7C4A1]/20 to-[#1B4332]/10 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Leaf className="w-24 h-24 text-[#B7C4A1]/40" />
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="absolute bottom-4 left-4">
              <EcoScoreBadge score={product.eco_score} size="lg" />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{product.name}</h2>
              {product.replaces && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Eco-friendly alternative to <strong>{product.replaces}</strong></span>
                </div>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            )}

            {/* Price & Materials */}
            <div className="grid grid-cols-2 gap-3">
              {product.price_range && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Price Range</p>
                  <p className="text-xl font-bold text-gray-900">{product.price_range}</p>
                </div>
              )}
              {product.materials && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Materials</p>
                  <div className="flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-[#2D6A4F]" />
                    <p className="text-sm font-medium text-gray-900">{product.materials}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2D6A4F]" />
                  Environmental Benefits
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.benefits.map((b, i) => (
                    <Badge key={i} className="bg-[#B7C4A1]/15 text-[#1B4332] border-0 px-3 py-1">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#2D6A4F]" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((c, i) => (
                    <Badge key={i} variant="outline" className="border-[#2D6A4F]/20 text-[#2D6A4F] px-3 py-1">
                      {c}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-t border-gray-100 pt-4">
              <ReviewList productId={product.id} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 flex-wrap">
              <Button
                onClick={() => onToggleFavorite(product.id)}
                variant="outline"
                className={`rounded-xl flex-1 min-w-[100px] ${isFavorite ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <ShopeeButton productName={product.name} />
              {product.buy_url && (
                <Button
                  onClick={() => window.open(product.buy_url, '_blank')}
                  className="rounded-xl flex-1 min-w-[100px] bg-[#1B4332] hover:bg-[#2D6A4F]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Where to Buy
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}