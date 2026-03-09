import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCoordinates, SINGAPORE_CENTER } from './singaporeLocations';

// Fix Leaflet default marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makeIcon = (type) => new L.DivIcon({
  html: `<div style="background:${type === 'donation' ? '#1B4332' : '#7c3aed'};width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;border:2.5px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.25)">${type === 'donation' ? '🎁' : '🔄'}</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -22],
});

const userIcon = new L.DivIcon({
  html: `<div style="background:#2563eb;width:14px;height:14px;border-radius:50%;border:2.5px solid white;box-shadow:0 0 0 5px rgba(37,99,235,0.2)"></div>`,
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function SwapMapView({ listings, onContact, userLocation, maxDistance }) {
  const center = userLocation || SINGAPORE_CENTER;

  const mappedListings = listings
    .filter(l => l.status === 'available')
    .map(l => ({ ...l, coords: getCoordinates(l.location) }))
    .filter(l => l.coords);

  // Deduplicate by coords to avoid exact stacking — slight offset per duplicate
  const positioned = mappedListings.map((l, i) => {
    const sameSpot = mappedListings.slice(0, i).filter(p => p.coords[0] === l.coords[0]);
    const offset = sameSpot.length * 0.0015;
    return { ...l, coords: [l.coords[0] + offset, l.coords[1] + offset * 0.8] };
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height: '480px' }}>
      <MapContainer center={center} zoom={userLocation ? 13 : 12} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Distance ring */}
        {userLocation && maxDistance && (
          <Circle
            center={userLocation}
            radius={maxDistance * 1000}
            pathOptions={{ color: '#1B4332', fillColor: '#B7C4A1', fillOpacity: 0.07, weight: 1.5, dashArray: '6 4' }}
          />
        )}

        {/* User location dot */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup><span style={{ fontSize: 13, fontWeight: 600 }}>You are here</span></Popup>
          </Marker>
        )}

        {/* Listing markers */}
        {positioned.map(listing => (
          <Marker key={listing.id} position={listing.coords} icon={makeIcon(listing.listing_type)}>
            <Popup maxWidth={230}>
              <div style={{ fontFamily: 'Inter, sans-serif', padding: '2px 0' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', marginBottom: '5px', color: '#111827', lineHeight: 1.3 }}>{listing.title}</p>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '7px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ background: listing.listing_type === 'donation' ? '#dcfce7' : '#f3e8ff', color: listing.listing_type === 'donation' ? '#166534' : '#6b21a8', fontSize: '11px', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                    {listing.listing_type === 'donation' ? '🎁 Free' : '🔄 Swap'}
                  </span>
                  {listing.location && (
                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>📍 {listing.location}</span>
                  )}
                </div>
                {listing.condition && (
                  <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '5px' }}>Condition: <strong>{listing.condition.replace('_', ' ')}</strong></p>
                )}
                {listing.description && (
                  <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', lineHeight: 1.4 }}>
                    {listing.description.length > 90 ? listing.description.slice(0, 90) + '…' : listing.description}
                  </p>
                )}
                {listing.swap_for && (
                  <p style={{ fontSize: '11px', color: '#7c3aed', marginBottom: '8px' }}>Wants: {listing.swap_for}</p>
                )}
                {listing.contact_email && (
                  <button
                    onClick={() => onContact(listing)}
                    style={{ width: '100%', background: '#1B4332', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Contact Lister
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}