import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { MessageSquarePlus } from 'lucide-react';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';
import { formatDistanceToNow } from 'date-fns';

export default function ReviewList({ productId }) {
  const [showForm, setShowForm] = useState(false);

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => base44.entities.Review.filter({ product_id: productId }, '-created_date', 50),
  });

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Community Reviews</h3>
          {avg && (
            <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
              ★ {avg} <span className="font-normal text-amber-600">({reviews.length})</span>
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="flex items-center gap-1.5 text-xs font-medium text-[#2D6A4F] hover:text-[#1B4332] transition-colors"
        >
          <MessageSquarePlus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ReviewForm productId={productId} onDone={() => setShowForm(false)} />
      )}

      {/* Reviews */}
      {reviews.length === 0 && !showForm ? (
        <p className="text-xs text-gray-400 text-center py-4">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-gray-50 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#B7C4A1]/40 flex items-center justify-center text-xs font-bold text-[#1B4332]">
                    {(r.reviewer_name || r.created_by || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {r.reviewer_name || r.created_by?.split('@')[0] || 'Anonymous'}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  {formatDistanceToNow(new Date(r.created_date), { addSuffix: true })}
                </span>
              </div>
              <StarRating value={r.rating} readonly size="sm" />
              {r.comment && <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}