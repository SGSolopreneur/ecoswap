import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MapPin, ArrowRightLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactModal({ listing, onClose }) {
  if (!listing) return null;

  const isSwap = listing.listing_type === 'swap';
  const mailtoLink = `mailto:${listing.contact_email}?subject=EcoSwap: Interested in "${listing.title}"&body=Hi! I saw your listing on EcoSwap and I'm interested in your "${listing.title}". ${isSwap ? `I'd love to discuss a swap.` : `Would love to pick it up if still available.`}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900 text-lg">Contact Lister</h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex items-center gap-2">
              {isSwap ? <ArrowRightLeft className="w-4 h-4 text-purple-500" /> : <Gift className="w-4 h-4 text-[#1B4332]" />}
              <p className="font-semibold text-gray-900 text-sm">{listing.title}</p>
            </div>
            {listing.location && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{listing.location}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Send an email to connect with the lister. Be friendly and mention where you found them!
          </p>

          <a href={mailtoLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] gap-2">
              <Mail className="w-4 h-4" />
              Open Email
            </Button>
          </a>
          <p className="text-xs text-gray-400 text-center mt-3">Contacting: {listing.contact_email}</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}