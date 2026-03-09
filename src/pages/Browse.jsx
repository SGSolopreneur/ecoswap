import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import FilterBar from '../components/products/FilterBar';
import ProductCard from '../components/products/ProductCard';
import ProductDetail from '../components/products/ProductDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf } from 'lucide-react';

export default function Browse() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';
  const initialQuery = urlParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState({
    category: initialCategory,
    priceRange: 'all',
    minScore: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-eco_score', 200),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.product_id)), [favorites]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = filters.category === 'all' || p.category === filters.category;
      const matchPrice = filters.priceRange === 'all' || p.price_range === filters.priceRange;
      const matchScore = p.eco_score >= filters.minScore;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || 
        p.name?.toLowerCase().includes(q) ||
        p.replaces?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      return matchCategory && matchPrice && matchScore && matchSearch;
    });
  }, [products, filters, searchQuery]);

  const toggleFavorite = async (productId) => {
    const existing = favorites.find(f => f.product_id === productId);
    if (existing) {
      await base44.entities.Favorite.delete(existing.id);
    } else {
      await base44.entities.Favorite.create({ product_id: productId });
    }
    queryClient.invalidateQueries({ queryKey: ['favorites'] });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Products</h1>
        <p className="text-gray-500">Discover eco-friendly alternatives for everyday items</p>
      </div>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalResults={filteredProducts.length}
      />

      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(9).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                isFavorite={favoriteIds.has(product.id)}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductDetail
        product={selectedProduct}
        isFavorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}