/**
 * Main plugin file - handles communication with Figma API
 */
import { Icon, MessageType } from '../types';
import iconsMetadata from '../icons-metadata.json';

/**
 * PRZEPŁYW DANYCH IKON W APLIKACJI:
 * 1. Plik generate-icons.js skanuje folder icons/ i generuje icons-metadata.json w głównym katalogu
 * 2. Podczas budowania pluginu, icons-metadata.json jest kopiowany do katalogu src/ przez webpack
 * 3. Plugin importuje metadane i używa ich do pobierania ikon SVG z określonego URL
 * 4. Metadane zawierają informacje o ikonach, kategoriach oraz pełne URL do plików SVG
 * 
 * Aby zaktualizować ikony:
 * 1. Dodaj nowe pliki SVG do folderu icons/
 * 2. Uruchom `npm run generate-icons` aby zaktualizować icons-metadata.json
 * 3. Zbuduj i opublikuj plugin komendą `npm run build`
 */

/**
 * Konfiguracja pluginu
 */
figma.skipInvisibleInstanceChildren = true;

/**
 * Inicjalizacja pluginu
 */
console.log('Plugin starting...');

/**
 * Ustawienia rozmiaru UI
 */
figma.showUI(__html__, { width: 668, height: 600 });

/**
 * Konwersja koloru HEX na RGB
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Funkcja wstawiająca ikony do dokumentu Figma
 * 
 * PRZEPŁYW DANYCH:
 * 1. Funkcja otrzymuje tablicę obiektów ikon z UI (wygenerowanych przez generate-icons.js)
 * 2. Każda ikona zawiera pole svgUrl wskazujące na plik SVG
 * 3. Funkcja pobiera każdy plik SVG z podanego URL
 * 4. Tworzy węzeł Figma dla każdej ikony i wstawia ją do dokumentu
 * 
 * @param icons - Tablica obiektów ikon do wstawienia
 * @param color - Kolor ikon w formacie HEX
 */
async function insertIcons(icons: Icon[], color: string): Promise<void> {
  // Sprawdź czy mamy ikony do wstawienia
  if (!icons || icons.length === 0) {
    return;
  }
  
  // Ustaw wielkość i odstęp
  const iconSize = 24;
  const gap = 16;
  const cols = Math.min(8, icons.length);
  
  // Tablica do przechowywania utworzonych nodeów
  const nodes: SceneNode[] = [];
  
  // Konwersja koloru HEX na RGB
  const rgbColor = hexToRgb(color);
  
  // Pobierz pozycję okna pluginu
  const windowSize = {
    width: 668, // szerokość okna pluginu
    height: 600 // wysokość okna pluginu
  };
  
  // Pobierz aktualną pozycję widoku
  const zoom = figma.viewport.zoom;
  const center = figma.viewport.center;
  
  // Oblicz pozycję startową dla ikon (20px od prawej krawędzi okna pluginu)
  const startX = center.x + (windowSize.width / 2 / zoom) + 20;
  const startY = center.y - (windowSize.height / 2 / zoom);
  
  // Dodaj ikony jako osobne framy
  for (let i = 0; i < icons.length; i++) {
    const icon = icons[i];
    
    try {
      // Pobierz SVG z serwera
      if (!icon.svgUrl) {
        throw new Error(`SVG URL is missing for icon ${icon.name}`);
      }
      
      const svgResponse = await fetch(icon.svgUrl);
      
      if (!svgResponse.ok) {
        throw new Error(`Failed to fetch SVG from ${icon.svgUrl}`);
      }
      
      const svgText = await svgResponse.text();
      
      // Utwórz node SVG z pobranego kodu
      const node = figma.createNodeFromSvg(svgText);
      
      // Stwórz ramkę dla pojedynczej ikony
      const frame = figma.createFrame();
      frame.name = icon.name;
      frame.resize(iconSize, iconSize);
      frame.fills = []; // Przezroczyste tło
      
      // Ustaw nazwę ikony
      node.name = "icon";
      
      // Usuń tło
      node.fills = [];
      
      // Znajdź vector path i ustaw kolor
      const paths = node.findAll(n => n.type === 'VECTOR');
      if (paths && paths.length > 0) {
        for (const path of paths) {
          if ('fills' in path) {
            path.fills = [{
              type: 'SOLID',
              color: {
                r: rgbColor.r,
                g: rgbColor.g,
                b: rgbColor.b
              }
            }];
          }
        }
      }
      
      // Dopasuj rozmiar SVG do ramki
      node.resize(iconSize, iconSize);
      
      // Dodaj SVG do ramki
      frame.appendChild(node);
      
      // Oblicz pozycję na podstawie siatki
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      frame.x = startX + col * (iconSize + gap);
      frame.y = startY + row * (iconSize + gap);
      
      // Dodaj do strony
      figma.currentPage.appendChild(frame);
      
      // Dodaj do tablicy nodeów
      nodes.push(frame);
      
    } catch (error) {
      console.error(`Error inserting icon ${icon.name}:`, error);
      
      // Jeśli wystąpił błąd, wstaw domyślną ikonę
      const fallbackFrame = figma.createFrame();
      fallbackFrame.name = icon.name + " (error)";
      fallbackFrame.resize(iconSize, iconSize);
      fallbackFrame.fills = []; // Przezroczyste tło
      
      const fallbackNode = figma.createNodeFromSvg(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>`
      );
      
      // Znajdź vector path i ustaw kolor
      const vectorPath = fallbackNode.findOne(n => n.type === 'VECTOR');
      if (vectorPath && 'fills' in vectorPath) {
        vectorPath.fills = [{
          type: 'SOLID',
          color: {
            r: rgbColor.r,
            g: rgbColor.g,
            b: rgbColor.b
          }
        }];
      }
      
      // Dodaj do ramki
      fallbackFrame.appendChild(fallbackNode);
      
      // Oblicz pozycję na podstawie siatki
      const row = Math.floor(i / cols);
      const col = i % cols;
      
      fallbackFrame.x = startX + col * (iconSize + gap);
      fallbackFrame.y = startY + row * (iconSize + gap);
      
      // Dodaj do strony
      figma.currentPage.appendChild(fallbackFrame);
      
      // Dodaj do tablicy nodeów
      nodes.push(fallbackFrame);
    }
  }
  
  // Wybierz wszystkie ikony
  figma.currentPage.selection = nodes;
}

/**
 * Nasłuchiwanie wiadomości z UI
 */
figma.ui.onmessage = async (msg: any) => {
  // Obsługa wiadomości od UI
  switch (msg.type) {
    case MessageType.UI_READY:
      console.log('UI is ready, sending initial data');
      
      try {
        // Pobierz ikony i kategorie z metadanych
        const icons: Icon[] = iconsMetadata.icons;
        const categories: string[] = iconsMetadata.categories;
        
        // Wyślij dane do UI
        figma.ui.postMessage({
          type: MessageType.INIT_DATA,
          icons,
          categories
        });
      } catch (error) {
        console.error('Error initializing plugin:', error);
        figma.notify('Error initializing plugin', { error: true });
      }
      break;

    case MessageType.INSERT_ICONS:
      console.log('Inserting icons:', msg.icons);
      
      try {
        // Pobierz ikony i ustawienia
        const icons: Icon[] = msg.icons;
        const color: string = msg.color || '#000000';
        
        // Wstaw ikony
        await insertIcons(icons, color);
        
        // Powiadom UI o sukcesie
        figma.ui.postMessage({
          type: MessageType.ICONS_INSERTED,
          success: true
        });
      } catch (error: unknown) {
        // Obsługa błędów
        console.error('Error inserting icons:', error);
        
        // Powiadom UI o błędzie
        figma.ui.postMessage({
          type: MessageType.ICONS_INSERTED,
          success: false,
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      break;
      
    default:
      console.log('Unknown message type:', msg.type);
  }
}; 