/**
 * Definicje typów dla pluginu ikon
 */

/**
 * Interfejs reprezentujący pojedynczą ikonę
 */
export interface Icon {
  id: string;          // Unikalny identyfikator ikony
  name: string;        // Nazwa ikony (do wyświetlania)
  categories: string[]; // Kategorie, do których należy ikona
  tags: string[];      // Tagi ułatwiające wyszukiwanie
  svgPath?: string;    // Ścieżka SVG (path komponent) - opcjonalna jeśli używamy svgUrl
  svgUrl?: string;     // URL do pliku SVG - opcjonalny jeśli używamy svgPath
  premium?: boolean;   // Flaga określająca, czy ikona jest premium
}

/**
 * Interfejs reprezentujący metadane ikon (struktura pliku JSON)
 */
export interface IconsMetadata {
  lastUpdated: string;  // Data ostatniej aktualizacji zbioru ikon
  totalCount: number;   // Całkowita liczba ikon
  categories: string[]; // Lista wszystkich dostępnych kategorii
  icons: Icon[];        // Lista wszystkich ikon
}

/**
 * Interfejs reprezentujący ustawienia personalizacji ikony
 */
export interface IconSettings {
  size: number;         // Rozmiar ikony (w pikselach)
  color: string;        // Kolor ikony (w formacie HEX)
  flipX: boolean;       // Czy odbić poziomo
  flipY: boolean;       // Czy odbić pionowo
  rotation: number;     // Rotacja w stopniach
}

/**
 * Typy komunikatów między UI a głównym wątkiem
 */
export enum MessageType {
  // Standardowe typy
  INIT = 'INIT',
  SEARCH = 'SEARCH',
  INSERT_ICON = 'INSERT_ICON',
  LOAD_MORE = 'LOAD_MORE',
  ERROR = 'ERROR',
  
  // Nowe typy dla nowego interfejsu
  UI_READY = 'UI_READY',
  INIT_DATA = 'INIT_DATA',
  INSERT_ICONS = 'INSERT_ICONS',
  ICONS_INSERTED = 'ICONS_INSERTED'
}

/**
 * Interfejs reprezentujący podstawową strukturę komunikatu
 */
export interface Message {
  type: MessageType | string;
  payload?: any;
}

/**
 * Interfejs reprezentujący komunikat z żądaniem wstawienia ikony (stara wersja)
 */
export interface InsertIconMessage extends Message {
  type: MessageType.INSERT_ICON;
  payload: {
    iconId: string;
    svgString: string;
    settings: IconSettings;
  };
}

/**
 * Interfejs reprezentujący nowy komunikat wstawiania ikon
 */
export interface InsertIconsMessage extends Message {
  type: MessageType.INSERT_ICONS;
  icons: Icon[];
  color: string;
}

/**
 * Interfejs reprezentujący komunikat z wynikami wyszukiwania
 */
export interface SearchMessage extends Message {
  type: MessageType.SEARCH;
  payload: {
    query: string;
    category?: string;
    page: number;
    limit: number;
  };
} 