import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, ArrowRightLeft, Gift, Leaf } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const conditionLabel = { like_new: 'Like New', good: 'Good', fair: 'Fair' };
const conditionColor = { like_new: 'bg-emerald-50 text-emerald-700', good: 'bg-blue-50 text-blue-700', fair: 'bg-amber-50 text-amber-700' };
const categoryLabel = {
  cleaning: 'Cleaning', personal_care: 'Personal Care', kitchen: 'Kitchen',
  bathroom: 'Bathroom', office: 'Office', fashion: 'Fashion',
  food: 'Food', garden: 'Garden', other: 'Other',
};

export default function ListingCard({ listing, index, onContact, onMarkTaken, isOwner }) {
  const isSwap = listing.listing_type === 'swap';
  const isTaken = listing.status !== 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-black/5 ${isTaken ? 'opacity-60' : 'border-gray-100'}`}
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {listing.image_url ? (
          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf className="w-12 h-12 text-[#B7C4A1]/50" />
          </div>
        )}

        {/* Type badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isSwap ? 'bg-purple-600 text-white' : 'bg-[#1B4332] text-white'
        }`}>
          {isSwap ? <ArrowRightLeft className="w-3 h-3" /> : <Gift className="w-3 h-3" />}
          {isSwap ? 'Swap' : 'Free'}
        </div>

        {isTaken && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {listing.status === 'reserved' ? 'Reserved' : 'Taken'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionColor[listing.condition]}`}>
              {conditionLabel[listing.condition]}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              {categoryLabel[listing.category] || listing.category}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base leading-snug">{listing.title}</h3>
        </div>

        {listing.description && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{listing.description}</p>
        )}

        {isSwap && listing.swap_for && (
          <div className="flex items-start gap-2 bg-purple-50 rounded-xl px-3 py-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
            <p className="text-xs text-purple-700"><span className="font-semibold">Wants:</span> {listing.swap_for}</p>
          </div>
        )}

        {listing.location && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>{listing.location}</span>
          </div>
        )}

        <div className="flex gap-2 mt-auto pt-1">
          {isOwner ? (
            !isTaken && (
              <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs" onClick={() => onMarkTaken(listing.id)}>
                Mark as Taken
              </Button>
            )
          ) : (
            !isTaken && listing.contact_email && (
              <Button size="sm" className="flex-1 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-xs gap-1.5" onClick={() => onContact(listing)}>
                <Mail className="w-3.5 h-3.5" /> Contact
              </Button>
            )
          )}
        </div>
      </div>
    </motion.div>
  );
}