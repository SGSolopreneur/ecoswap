import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import StarRating from './StarRating';

export default function ReviewForm({ productId, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => base44.entities.Review.create({ product_id: productId, rating, comment, reviewer_name: name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      onDone?.();
    },
  });

  return (
    <form
      onSubmit={e => { e.preventDefault(); mutation.mutate(); }}
      className="bg-gray-50 rounded-2xl p-4 space-y-3"
    >
      <p className="text-sm font-semibold text-gray-800">Write a Review</p>

      <StarRating value={rating} onChange={setRating} size="lg" />

      <input
        placeholder="Your name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white"
      />

      <textarea
        placeholder="Share your experience with this product…"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B4332]/20 bg-white resize-none"
      />

      <Button
        type="submit"
        disabled={rating === 0 || mutation.isPending}
        className="w-full rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] text-sm"
      >
        {mutation.isPending ? 'Submitting…' : 'Submit Review'}
      </Button>
    </form>
  );
}