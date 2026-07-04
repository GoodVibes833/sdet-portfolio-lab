// Selectors for Map module (main page with Leaflet map)
export const mapSelectors = {
  // Map container
  mapContainer: '.leaflet-container',
  mapTile: '.leaflet-tile-loaded',

  // City tabs
  cityTab: (city: string) => `[data-testid="city-tab-${city}"]`,
  cityTabActive: '[data-testid*="city-tab"][aria-selected="true"]',

  // Filter chips
  filterChip: (category: string) => `[data-testid="filter-${category}"]`,
  filterChipActive: '[data-testid*="filter"][aria-pressed="true"]',

  // Bottom sheet / place list
  bottomSheet: '[data-testid="bottom-sheet"]',
  placeCard: '[data-testid="place-card"]',
  placeCardTitle: '[data-testid="place-card-title"]',

  // Map markers
  mapMarker: '.leaflet-marker-icon',
  markerCluster: '.marker-cluster',

  // Location button
  myLocationBtn: '[data-testid="my-location-btn"]',
};
