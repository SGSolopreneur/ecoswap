import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import HeroSection from '../components/home/HeroSection';
import ImpactStats from '../components/home/ImpactStats';
import CategoryCard from '../components/home/CategoryCard';
import ProductCard from '../components/products/ProductCard';
import ProductDetail from '../components/products/ProductDetail';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => base44.entities.Product.list('-eco_score', 100),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => base44.entities.Favorite.list(),
  });

  const favoriteIds = useMemo(() => new Set(favorites.map(f => f.product_id)), [favorites]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(createPageUrl('Browse') + `?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleFavorite = async (productId) => {
    const existing = favorites.find(f => f.product_id === productId);
    if (existing) {
      await base44.entities.Favorite.delete(existing.id);
    } else {
      await base44.entities.Favorite.create({ product_id: productId });
    }
  };

  const allCategories = ['cleaning', 'personal_care', 'kitchen', 'bathroom', 'office', 'fashion', 'food', 'garden'];

  return (
    <div>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
      
      <ImpactStats />

      {/* Categories */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Browse by Category</h2>
              <p className="text-gray-500 mt-1">Find alternatives in every area of life</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {allCategories.map((cat, i) => (
              <CategoryCard
                key={cat}
                category={cat}
                count={categoryCounts[cat] || 0}
                index={i}
                onClick={() => navigate(createPageUrl('Browse') + `?category=${cat}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4 bg-gradient-to-b from-transparent to-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Rated Products</h2>
              <p className="text-gray-500 mt-1">Highest eco-scores from our collection</p>
            </div>
            <Link to={createPageUrl('Browse')}>
              <Button variant="outline" className="rounded-xl hidden sm:flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredProducts.map((product, i) => (
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

          <div className="sm:hidden mt-6 text-center">
            <Link to={createPageUrl('Browse')}>
              <Button variant="outline" className="rounded-xl">
                View All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <ProductDetail
        product={selectedProduct}
        isFavorite={selectedProduct ? favoriteIds.has(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}