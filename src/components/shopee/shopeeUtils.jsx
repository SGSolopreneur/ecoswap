export const SHOPEE_REGIONS = [
  { code: 'SG', label: '🇸🇬 Singapore',  domain: 'shopee.sg' },
  { code: 'MY', label: '🇲🇾 Malaysia',   domain: 'shopee.com.my' },
  { code: 'ID', label: '🇮🇩 Indonesia',  domain: 'shopee.co.id' },
  { code: 'PH', label: '🇵🇭 Philippines',domain: 'shopee.ph' },
  { code: 'TH', label: '🇹🇭 Thailand',   domain: 'shopee.co.th' },
  { code: 'VN', label: '🇻🇳 Vietnam',    domain: 'shopee.vn' },
  { code: 'TW', label: '🇹🇼 Taiwan',     domain: 'shopee.tw' },
];

export const DEFAULT_REGION = 'SG';
const STORAGE_KEY = 'ecoswap_shopee_region';

export function getSavedRegion() {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_REGION; } catch { return DEFAULT_REGION; }
}

export function saveRegion(code) {
  try { localStorage.setItem(STORAGE_KEY, code); } catch {}
}

export function getShopeeSearchUrl(productName, regionCode) {
  const region = SHOPEE_REGIONS.find(r => r.code === regionCode) || SHOPEE_REGIONS[0];
  const keyword = encodeURIComponent(productName);
  return `https://${region.domain}/search?keyword=${keyword}`;
}