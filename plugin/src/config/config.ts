/**
 * Konfiguracja pluginu ikon dla Figma
 */

// Adresy URL dla wersji produkcyjnej i developerskiej
const DEV_ICON_URL = 'http://localhost:3000/icons';
const PROD_ICON_URL = 'https://figma-icon-plugin.vercel.app/icons';

const DEV_METADATA_URL = 'http://localhost:3000/icons-metadata.json';
const PROD_METADATA_URL = 'https://figma-icon-plugin.vercel.app/icons-metadata.json';

// Wskazuje, czy plugin działa w trybie developerskim czy produkcyjnym
export const IS_DEVELOPMENT = false;

// Podstawowy URL dla zasobów ikon
export const BASE_ICON_URL = IS_DEVELOPMENT ? DEV_ICON_URL : PROD_ICON_URL;

// URL do pliku JSON z metadanymi ikon
export const ICONS_METADATA_URL = IS_DEVELOPMENT ? DEV_METADATA_URL : PROD_METADATA_URL;

/**
 * INFORMACJA: Po uruchomieniu `npm run generate-icons`, metadane są generowane w folderze assets/ i hostowane na Vercel.
 * Plugin zawsze pobiera najnowsze metadane i ikony z adresu URL określonego w ICONS_METADATA_URL,
 * co umożliwia aktualizację ikon bez konieczności aktualizacji samego pluginu Figma.
 */

// Ustawienia dotyczące paginacji i lazy loadingu
export const ICONS_PER_PAGE = 100;
export const INITIAL_LOAD_LIMIT = 50;

// Domyślne ustawienia personalizacji ikon
export const DEFAULT_ICON_SIZE = 24;
export const DEFAULT_ICON_COLOR = '#000000'; 