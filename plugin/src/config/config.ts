/**
 * Konfiguracja pluginu ikon dla Figma
 */

// Tryb pracy: development lub production
export const MODE = 'development';

// Podstawowy URL dla zasobów ikon
// W trybie developerskim możemy używać lokalnego źródła, a w produkcji zewnętrznego hostingu
export const BASE_ICON_URL = MODE === 'development' 
  ? 'http://localhost:3000/icons' 
  : 'https://figma-icon-plugin.vercel.app/icons';

// URL do pliku JSON z metadanymi ikon
export const ICONS_METADATA_URL = MODE === 'development'
  ? 'http://localhost:3000/icons-metadata.json'
  : 'https://figma-icon-plugin.vercel.app/icons-metadata.json';

// Ustawienia dotyczące paginacji i lazy loadingu
export const ICONS_PER_PAGE = 100;
export const INITIAL_LOAD_LIMIT = 50;

// Domyślne ustawienia personalizacji ikon
export const DEFAULT_ICON_SIZE = 24;
export const DEFAULT_ICON_COLOR = '#000000'; 