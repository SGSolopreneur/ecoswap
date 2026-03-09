export const SINGAPORE_AREAS = {
  'Ang Mo Kio': [1.3691, 103.8454],
  'Bedok': [1.3236, 103.9273],
  'Bishan': [1.3526, 103.8352],
  'Bukit Batok': [1.3590, 103.7637],
  'Bukit Merah': [1.2819, 103.8239],
  'Bukit Panjang': [1.3774, 103.7719],
  'Bukit Timah': [1.3294, 103.8021],
  'CBD': [1.2855, 103.8565],
  'Chinatown': [1.2821, 103.8444],
  'Choa Chu Kang': [1.3840, 103.7470],
  'Clementi': [1.3162, 103.7649],
  'Dempsey': [1.3040, 103.8076],
  'East Coast': [1.3016, 103.9123],
  'Geylang': [1.3201, 103.8918],
  'Holland Village': [1.3113, 103.7961],
  'Hougang': [1.3612, 103.8863],
  'Jurong East': [1.3329, 103.7436],
  'Jurong West': [1.3404, 103.7090],
  'Kallang': [1.3100, 103.8714],
  'Kampong Glam': [1.3018, 103.8596],
  'Katong': [1.3057, 103.9037],
  'Little India': [1.3066, 103.8518],
  'Marina Bay': [1.2800, 103.8609],
  'Marine Parade': [1.3024, 103.9073],
  'Novena': [1.3203, 103.8439],
  'Orchard': [1.3048, 103.8318],
  'Pasir Ris': [1.3721, 103.9493],
  'Punggol': [1.3984, 103.9072],
  'Queenstown': [1.2942, 103.7861],
  'Raffles Place': [1.2840, 103.8512],
  'Rochor': [1.3040, 103.8565],
  'Sembawang': [1.4491, 103.8185],
  'Sengkang': [1.3868, 103.8914],
  'Sentosa': [1.2494, 103.8303],
  'Serangoon': [1.3554, 103.8679],
  'Tampines': [1.3496, 103.9568],
  'Toa Payoh': [1.3343, 103.8563],
  'Woodlands': [1.4382, 103.7890],
  'Yishun': [1.4304, 103.8354],
};

export const SINGAPORE_CENTER = [1.3521, 103.8198];

export const SINGAPORE_AREA_NAMES = Object.keys(SINGAPORE_AREAS).sort();

export function getCoordinates(locationString) {
  if (!locationString) return null;
  const normalized = locationString.trim().toLowerCase();
  for (const [area, coords] of Object.entries(SINGAPORE_AREAS)) {
    if (normalized.includes(area.toLowerCase())) return coords;
  }
  return null;
}

export function haversineKm([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}