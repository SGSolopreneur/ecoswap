import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus, Recycle, Filter, Gift, ArrowRightLeft, Map, List, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ListingCard from '../components/swap/ListingCard';
import CreateListingModal from '../components/swap/CreateListingModal';
import ContactModal from '../components/swap/ContactModal';
import SwapMapView from '../components/swap/SwapMapView';
import { getCoordinates, haversineKm } from '../components/swap/singaporeLocations';

const CATEGORY_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'personal_care', label: 'Personal Care' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'garden', label: 'Garden' },
  { value: 'other', label: 'Other' },
];

const DISTANCE_OPTIONS = [
  { label: '2 km', value: 2 },
  { label: '5 km', value: 5 },
  { label: '10 km', value: 10 },
  { label: 'Island-wide', value: null },
];

export default function Swap() {
  const [showCreate, setShowCreate] = useState(false);
  const [contactListing, setContactListing] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [maxDistance, setMaxDistance] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['swap_listings'],
    queryFn: () => base44.entities.SwapListing.list('-created_date', 100),
  });

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  const markTakenMutation = useMutation({
    mutationFn: (id) => base44.entities.SwapListing.update(id, { status: 'taken' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['swap_listings'] }),
  });

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLocation([pos.coords.latitude, pos.coords.longitude]); setLocating(false); },
      () => setLocating(false)
    );
  };

  const filtered = useMemo(() => {
    return listings.filter(l => {
      const typeMatch = typeFilter === 'all' || l.listing_type === typeFilter;
      const catMatch = categoryFilter === 'all' || l.category === categoryFilter;
      if (!typeMatch || !catMatch) return false;
      if (maxDistance !== null && userLocation) {
        const coords = getCoordinates(l.location);
        if (coords && haversineKm(userLocation, coords) > maxDistance) return false;
      }
      return true;
    });
  }, [listings, typeFilter, categoryFilter, maxDistance, userLocation]);

  const available = filtered.filter(l => l.status === 'available');
  const taken = filtered.filter(l => l.status !== 'available');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-[#1B4332] rounded-xl flex items-center justify-center">
              <Recycle className="w-5 h-5 text-[#B7C4A1]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">EcoSwap Community</h1>
          </div>
          <p className="text-gray-500 ml-[3.25rem]">Give used eco-friendly goods a second life — donate or trade locally in Singapore.</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F] gap-2 shrink-0">
          <Plus className="w-4 h-4" /> List an Item
        </Button>
      </div>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Gift, label: 'Items to Donate', count: listings.filter(l => l.listing_type === 'donation' && l.status === 'available').length, color: 'text-[#1B4332] bg-[#F0F7F4]' },
          { icon: ArrowRightLeft, label: 'Swap Offers', count: listings.filter(l => l.listing_type === 'swap' && l.status === 'available').length, color: 'text-purple-700 bg-purple-50' },
          { icon: Recycle, label: 'Items Rehomed', count: listings.filter(l => l.status === 'taken').length, color: 'text-amber-700 bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col items-center text-center gap-1">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stat.count}</span>
            <span className="text-xs text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Row 1: type filter + view toggle + location */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {[['all', 'All Types'], ['donation', '🎁 Free'], ['swap', '🔄 Swap']].map(([val, label]) => (
              <button key={val} onClick={() => setTypeFilter(val)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${typeFilter === val ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={requestLocation}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${userLocation ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <Navigation className={`w-3.5 h-3.5 ${locating ? 'animate-pulse' : ''}`} />
              {locating ? 'Locating…' : userLocation ? '📍 Located' : 'My Location'}
            </button>

            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              <button onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                <List className="w-3.5 h-3.5" /> List
              </button>
              <button onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: category + distance */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            {CATEGORY_FILTERS.map(c => (
              <button key={c.value} onClick={() => setCategoryFilter(c.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all ${categoryFilter === c.value ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-400 whitespace-nowrap">Within:</span>
            {DISTANCE_OPTIONS.map(opt => {
              const disabled = !userLocation && opt.value !== null;
              return (
                <button key={opt.label} onClick={() => !disabled && setMaxDistance(opt.value)}
                  title={disabled ? 'Enable My Location first' : ''}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all
                    ${maxDistance === opt.value ? 'bg-[#1B4332] text-white border-[#1B4332]' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}
                    ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map view */}
      {viewMode === 'map' && (
        <div className="mb-8">
          <SwapMapView
            listings={filtered}
            onContact={setContactListing}
            userLocation={userLocation}
            maxDistance={maxDistance}
          />
          {!userLocation && (
            <p className="text-xs text-center text-gray-400 mt-2">
              Tap "My Location" to see a distance radius and filter listings nearby.
            </p>
          )}
          {filtered.filter(l => l.status === 'available' && getCoordinates(l.location)).length === 0 && (
            <p className="text-xs text-center text-gray-400 mt-2">
              No listings with mappable locations yet. Listings need a Singapore town/area to appear on the map.
            </p>
          )}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : available.length === 0 && taken.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Recycle className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No listings yet — be the first to share!</p>
              <Button onClick={() => setShowCreate(true)} className="mt-4 rounded-xl bg-[#1B4332] hover:bg-[#2D6A4F]">
                <Plus className="w-4 h-4 mr-2" /> List an Item
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {available.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Available ({available.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {available.map((listing, i) => (
                      <ListingCard
                        key={listing.id} listing={listing} index={i}
                        onContact={setContactListing}
                        onMarkTaken={(id) => markTakenMutation.mutate(id)}
                        isOwner={user && listing.created_by === user.email}
                      />
                    ))}
                  </div>
                </div>
              )}
              {taken.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Rehomed ({taken.length})</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {taken.map((listing, i) => (
                      <ListingCard key={listing.id} listing={listing} index={i} onContact={() => {}} onMarkTaken={() => {}} isOwner={false} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showCreate && <CreateListingModal onClose={() => setShowCreate(false)} onCreated={() => queryClient.invalidateQueries({ queryKey: ['swap_listings'] })} />}
      {contactListing && <ContactModal listing={contactListing} onClose={() => setContactListing(null)} />}
    </div>
  );
}