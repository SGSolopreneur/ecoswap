import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'personal_care', label: 'Personal Care' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'office', label: 'Office' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food' },
  { value: 'garden', label: 'Garden' },
];

const priceOptions = [
  { value: 'all', label: 'Any Price' },
  { value: '$', label: '$ Budget' },
  { value: '$$', label: '$$ Mid-range' },
  { value: '$$$', label: '$$$ Premium' },
];

export default function FilterBar({ filters, setFilters, searchQuery, setSearchQuery, totalResults }) {
  const hasFilters = filters.category !== 'all' || filters.priceRange !== 'all' || filters.minScore > 0 || searchQuery;

  const clearAll = () => {
    setFilters({ category: 'all', priceRange: 'all', minScore: 0 });
    setSearchQuery('');
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm outline-none focus:ring-2 focus:ring-[#B7C4A1] focus:border-transparent transition-all"
          />
        </div>

        {/* Category */}
        <Select value={filters.category} onValueChange={(v) => setFilters({ ...filters, category: v })}>
          <SelectTrigger className="w-full sm:w-44 rounded-xl border-gray-100 bg-gray-50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price */}
        <Select value={filters.priceRange} onValueChange={(v) => setFilters({ ...filters, priceRange: v })}>
          <SelectTrigger className="w-full sm:w-36 rounded-xl border-gray-100 bg-gray-50">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map(p => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="text-gray-500 hover:text-gray-900 shrink-0">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="mt-3 text-sm text-gray-500">
        {totalResults} product{totalResults !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}