import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import ProductCard from '../components/products/ProductCard';
import ProductDetail from '../components/products/ProductDetail';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Heart, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Favorites() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-eco_score', 200),
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.product_id)), [favorites]);

  const favoriteProducts = useMemo(() => products.filter(p => favoriteIds.has(p.id)), [products, favoriteIds]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ action, favoriteId, productId }) =>
      action === 'remove'
        ? base44.entities.Favorite.delete(favoriteId)
        : base44.entities.Favorite.create({ product_id: productId }),
    onMutate: async ({ action, productId }) => {
      await queryClient.cancelQueries({ queryKey: ['favorites'] });
      const prev = queryClient.getQueryData(['favorites']) || [];
      queryClient.setQueryData(['favorites'],
        action === 'remove'
          ? prev.filter(f => f.product_id !== productId)
          : [...prev, { product_id: productId, id: 'opt-' + Date.now() }]
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => queryClient.setQueryData(['favorites'], ctx.prev),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const toggleFavorite = (productId) => {
    const existing = favorites.find(f => f.product_id === productId);
    toggleFavoriteMutation.mutate(
      existing
        ? { action: 'remove', favoriteId: existing.id, productId }
        : { action: 'add', productId }
    );
  };

  const isLoading = productsLoading || favoritesLoading;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        </div>
        <p className="text-gray-500">Your saved eco-friendly products</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : favoriteProducts.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start exploring and save the eco-friendly products you love</p>
          <Link to={createPageUrl('Browse')}>
            <Button className="rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F]">
              Browse Products <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      <ProductDetail
        product={selectedProduct}
        isFavorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}