import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { SINGAPORE_AREA_NAMES } from './singaporeLocations';
import MobileSelect from '@/components/ui/MobileSelect';

const CATEGORIES = [
  { value: 'cleaning', label: 'Cleaning' }, { value: 'personal_care', label: 'Personal Care' },
  { value: 'kitchen', label: 'Kitchen' }, { value: 'bathroom', label: 'Bathroom' },
  { value: 'office', label: 'Office' }, { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food' }, { value: 'garden', label: 'Garden' },
  { value: 'other', label: 'Other' },
];

const INITIAL = { title: '', description: '', category: 'kitchen', condition: 'good', listing_type: 'donation', location: '', swap_for: '', contact_email: '', image_url: '' };

export default function CreateListingModal({ onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set('image_url', file_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, status: 'available' };
    if (form.listing_type === 'donation') delete data.swap_for;
    await base44.entities.SwapListing.create(data);
    setSaving(false);
    onCreated();
    onClose();
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#B7C4A1] bg-white";
  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <h2 className="text-lg font-bold text-gray-900">List an Item</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Listing type toggle */}
            <div>
              <label className={labelClass}>Listing Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['donation', 'swap'].map(t => (
                  <button type="button" key={t} onClick={() => set('listing_type', t)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${form.listing_type === t ? (t === 'donation' ? 'bg-[#1B4332] border-[#1B4332] text-white' : 'bg-purple-600 border-purple-600 text-white') : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {t === 'donation' ? '🎁 Free Donation' : '🔄 Swap'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Item Title *</label>
              <input required className={inputClass} placeholder="e.g. Bamboo toothbrush set" value={form.title} onChange={e => set('title', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Category</label>
                <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Condition</label>
                <select className={inputClass} value={form.condition} onChange={e => set('condition', e.target.value)}>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea className={inputClass + ' resize-none h-20'} placeholder="Describe the item, usage history, etc." value={form.description} onChange={e => set('description', e.target.value)} />
            </div>

            {form.listing_type === 'swap' && (
              <div>
                <label className={labelClass}>Looking to Swap For</label>
                <input className={inputClass} placeholder="e.g. Reusable beeswax wraps" value={form.swap_for} onChange={e => set('swap_for', e.target.value)} />
              </div>
            )}

            <div>
              <label className={labelClass}>Location (Singapore)</label>
              <select className={inputClass} value={form.location} onChange={e => set('location', e.target.value)}>
                <option value="">Select your area…</option>
                {SINGAPORE_AREA_NAMES.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Contact Email *</label>
              <input required type="email" className={inputClass} placeholder="your@email.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} />
            </div>

            {/* Image upload */}
            <div>
              <label className={labelClass}>Photo (optional)</label>
              {form.image_url ? (
                <div className="relative h-32 rounded-xl overflow-hidden border border-gray-100">
                  <img src={form.image_url} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => set('image_url', '')} className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#B7C4A1] transition-colors bg-gray-50">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : <><Upload className="w-5 h-5 text-gray-300 mb-1" /><span className="text-xs text-gray-400">Upload a photo</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                </label>
              )}
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] h-11">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Listing'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}