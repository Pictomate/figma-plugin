/**
 * Main plugin file - handles communication with Figma API
 */
import { Icon, MessageType } from '../types';
import { ICONS_METADATA_URL } from '../config/config';

/**
 * PRZEPŁYW DANYCH IKON W APLIKACJI:
 * 1. Plik generate-icons.js skanuje folder assets/icons/ i generuje assets/icons-metadata.json
 * 2. Plik assets/icons-metadata.json jest hostowany na Vercel
 * 3. Plugin pobiera metadane z zewnętrznego URL (https://twoja-aplikacja.vercel.app/icons-metadata.json)
 * 4. Na podstawie metadanych, plugin pobiera pliki SVG z określonych URL-i
 * 
 * Aby zaktualizować ikony:
 * 1. Dodaj nowe pliki SVG do folderu assets/icons/
 * 2. Uruchom `npm run generate-icons` aby zaktualizować icons-metadata.json w folderze assets/
 * 3. Zbuduj i opublikuj zmiany (np. przez Vercel)
 */

/**
 * Konfiguracja pluginu
 */
figma.skipInvisibleInstanceChildren = true;

/**
 * Inicjalizacja pluginu
 */
console.log('Plugin starting...');
console.log('Icons metadata URL:', ICONS_METADATA_URL);

// Test bezpośredniego dostępu do pliku icons-metadata.json bez parametrów
testDirectFetch();

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
      // Dodaj pobieranie SVG z serwera
      if (!icon.svgUrl) {
        throw new Error(`SVG URL is missing for icon ${icon.name}`);
      }
      
      // Sprawdź czy URL używa HTTPS
      if (icon.svgUrl.startsWith('http://')) {
        console.warn(`⚠️ BŁĄD: URL ikony ${icon.name} używa HTTP zamiast HTTPS!`);
        console.warn(`   Oryginalny URL: ${icon.svgUrl}`);
        console.warn(`   Figma blokuje zasoby z HTTP (Mixed Content Error).`);
        // Spróbuj naprawić URL zamieniając http na https
        icon.svgUrl = icon.svgUrl.replace('http://', 'https://');
        console.warn(`   Próba naprawy URL: ${icon.svgUrl}`);
      }
      
      // Dodaj parametr cache-busting dla adresu URL
      const timestamp = Date.now();
      const svgUrl = icon.svgUrl + '?v=' + timestamp;
      console.log(`Pobieranie ikony [${icon.name}] z: ${svgUrl}`);
      
      // Weryfikacja URL
      if (!svgUrl.includes('figma-plugin-indol.vercel.app')) {
        console.warn(`⚠️ UWAGA: URL ikony ${icon.name} nie zawiera oczekiwanej domeny figma-plugin-indol.vercel.app!`);
        console.warn(`   Aktualny URL: ${svgUrl}`);
        console.warn(`   Sprawdź czy w pliku icons-metadata.json są poprawne URL-e.`);
      }
      
      // Usuwamy problematyczne nagłówki, które mogą powodować błędy CORS
      const svgResponse = await fetch(svgUrl);
      
      // Diagnostyka nagłówków CORS dla pliku SVG
      console.log(`Szczegóły odpowiedzi SVG dla ${icon.name}:`);
      console.log(`- Status: ${svgResponse.status} ${svgResponse.statusText}`);
      console.log(`- URL: ${svgResponse.url}`);
      console.log(`- Type: ${svgResponse.type}`);
      
      // Wyświetlamy nagłówki odpowiedzi dla SVG
      const svgHeaders: Record<string, string> = {};
      svgResponse.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
        svgHeaders[key.toLowerCase()] = value;
      });
      
      // Sprawdzamy Content-Type
      const svgContentType = svgHeaders['content-type'] || '';
      if (!svgContentType.includes('svg') && !svgContentType.includes('xml')) {
        console.warn(`⚠️ UWAGA: Niepoprawny Content-Type dla ikony ${icon.name}: ${svgContentType}`);
        console.warn('Oczekiwano image/svg+xml lub text/xml - to może powodować błędy rendering');
      }
      
      // Sprawdzamy czy nagłówek CORS istnieje
      if (!svgHeaders['access-control-allow-origin']) {
        console.warn(`⚠️ UWAGA: Brak nagłówka CORS dla ikony ${icon.name}!`);
        console.warn('Sprawdź konfigurację Vercel - plik vercel.json powinien zawierać nagłówek "Access-Control-Allow-Origin": "*"');
      } else {
        console.log(`✅ Nagłówek CORS dla ikony ${icon.name} jest obecny.`);
      }
      
      if (!svgResponse.ok) {
        throw new Error(`Błąd pobierania SVG: ${svgResponse.status} ${svgResponse.statusText} - URL: ${svgUrl}`);
      }
      
      const svgText = await svgResponse.text();
      
      // Sprawdzamy, czy odpowiedź jest pusta
      if (!svgText || svgText.trim() === '') {
        console.error(`⚠️ BŁĄD: Otrzymano pustą odpowiedź SVG dla ikony ${icon.name}!`);
        throw new Error(`Otrzymano pustą odpowiedź SVG dla ikony ${icon.name}`);
      }
      
      // Sprawdzamy czy otrzymano HTML zamiast SVG
      if (svgText.trim().startsWith('<!DOCTYPE html>') || svgText.trim().startsWith('<html')) {
        console.error(`⚠️ BŁĄD: Otrzymano HTML zamiast SVG dla ikony ${icon.name}!`);
        console.error('Pierwsze 100 znaków:', svgText.substring(0, 100));
        throw new Error(`Otrzymano HTML zamiast SVG dla ikony ${icon.name}`);
      }
      
      // Wyświetl początek zawartości SVG
      console.log(`Zawartość SVG (pierwsze 100 znaków):`);
      console.log(JSON.stringify(svgText.substring(0, 100)) + (svgText.length > 100 ? '...' : ''));
      
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
 * Pobiera metadane ikon z zewnętrznego serwera
 * @returns Promise z danymi o ikonach
 */
async function fetchIconsMetadata() {
  try {
    const timestamp = Date.now();
    // Dodajemy parametr cache-busting, ale usuwamy problematyczne nagłówki
    let url = ICONS_METADATA_URL + '?v=' + timestamp; 
    
    // Sprawdź czy URL używa HTTPS - Figma wymaga HTTPS
    if (url.startsWith('http://')) {
      console.warn('⚠️ BŁĄD: URL metadanych używa HTTP zamiast HTTPS!');
      console.warn(`   Oryginalny URL: ${url}`);
      console.warn('   Figma blokuje żądania HTTP (Mixed Content Error).');
      // Spróbuj naprawić URL zamieniając http na https
      url = url.replace('http://', 'https://');
      console.warn(`   Próba naprawy URL: ${url}`);
    }
    
    console.log(`Pobieranie metadanych ikon z: ${url}`);
    console.log(`Timestamp: ${timestamp}, Data: ${new Date(timestamp).toISOString()}`);
    
    // WAŻNE: Usunięto problematyczne nagłówki, które powodowały błędy CORS
    // Używamy podstawowego fetch bez dodatkowych nagłówków
    const response = await fetch(url);
    
    console.log('Szczegóły odpowiedzi HTTP:');
    console.log(`- Status: ${response.status} ${response.statusText}`);
    console.log(`- URL: ${response.url}`); 
    console.log(`- Type: ${response.type}`);
    
    let contentType = null; 
    let headers: Record<string, string> = {};
    
    // Bezpieczna obsługa nagłówków - ignorujemy błąd "headers jest undefined"
    try {
      if (response.headers) {
        console.log('- Nagłówki odpowiedzi:');
        
        // Bezpieczna obsługa nagłówków
        if (typeof response.headers.forEach === 'function') {
          response.headers.forEach((value, key) => {
            console.log(`  ${key}: ${value}`);
            headers[key.toLowerCase()] = value;
          });
          
          // Sprawdzamy Content-Type
          contentType = headers['content-type'] || '';
          console.log(`Content-Type odpowiedzi: ${contentType}`);
          
          if (!contentType.includes('application/json')) {
            console.warn(`⚠️ UWAGA: Niepoprawny Content-Type: ${contentType}`);
            console.warn('Oczekiwano application/json - to może powodować błąd parsowania');
          }
          
          // Sprawdzamy czy nagłówek CORS istnieje
          if (!headers['access-control-allow-origin']) {
            console.warn('⚠️ UWAGA: Brak nagłówka CORS "Access-Control-Allow-Origin" w odpowiedzi!');
            console.log('To może być przyczyna błędu CORS. Sprawdź konfigurację serwera Vercel.');
          } else {
            console.log('✅ Nagłówek CORS "Access-Control-Allow-Origin" jest obecny w odpowiedzi.');
          }
        } else {
          console.log('⚠️ UWAGA: Metoda forEach nie jest dostępna dla nagłówków');
        }
      } else {
        console.log('⚠️ UWAGA: response.headers jest undefined - typowe w środowisku Figma');
      }
    } catch (headerError) {
      console.warn('⚠️ UWAGA: Błąd podczas przetwarzania nagłówków:', headerError);
    }
    
    if (!response.ok) {
      throw new Error(`Błąd pobierania metadanych: ${response.status} ${response.statusText}`);
    }
    
    // Pobieramy treść odpowiedzi jako tekst
    const responseText = await response.text();
    
    // DIAGNOSTYKA: Wyświetlamy surowy tekst odpowiedzi przed parsowaniem JSON
    console.log('📦 DIAGNOSTYKA - Treść surowej odpowiedzi (pierwsze 200 znaków):');
    console.log(responseText.substring(0, 200));
    
    // Sprawdzamy, czy odpowiedź nie jest pusta
    if (!responseText || responseText.trim() === '') {
      console.error('⚠️ BŁĄD: Otrzymano pustą odpowiedź!');
      throw new Error('Otrzymano pustą odpowiedź od serwera');
    }
    
    // Sprawdzamy czy pierwszym znakiem jest '<' (HTML), co powoduje błąd
    if (responseText.trim().startsWith('<')) {
      console.error('⚠️ BŁĄD: Otrzymano HTML zamiast JSON!');
      console.error('Pierwsze 50 znaków odpowiedzi:');
      console.error(responseText.substring(0, 50));
      throw new Error('Otrzymano HTML zamiast JSON. Sprawdź przekierowania lub błędy serwera.');
    }
    
    // Konwertujemy tekst na JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📦 DIAGNOSTYKA - Struktura sparsowanych danych JSON:', JSON.stringify(data).substring(0, 100));
    } catch (jsonError) {
      console.error('Błąd parsowania JSON:', jsonError);
      console.error('Pierwsze 100 znaków odpowiedzi:', JSON.stringify(responseText.substring(0, 100)));
      throw new Error('Otrzymane dane nie są poprawnym formatem JSON');
    }
    
    // Sprawdzamy, czy data istnieje
    if (!data) {
      console.error('⚠️ BŁĄD: Po parsowaniu JSON otrzymano null lub undefined!');
      throw new Error('Po parsowaniu JSON otrzymano null lub undefined');
    }
    
    // Sprawdzamy, czy data.icons istnieje i jest tablicą
    if (!data.icons) {
      console.error('⚠️ BŁĄD: Brak pola "icons" w strukturze JSON!');
      console.error('Otrzymana struktura:', JSON.stringify(data).substring(0, 200) + '...');
      throw new Error('Brak pola "icons" w strukturze JSON');
    }
    
    if (!Array.isArray(data.icons)) {
      console.error('⚠️ BŁĄD: Pole "icons" nie jest tablicą!');
      console.error('Typ pola icons:', typeof data.icons);
      console.error('Zawartość pola icons:', data.icons);
      throw new Error('Pole "icons" nie jest tablicą');
    }
    
    // Sprawdzam, czy icons jest pustą tablicą
    if (data.icons.length === 0) {
      console.warn('⚠️ UWAGA: Tablica ikon jest pusta!');
    }
    
    // WAŻNE: Sprawdzamy i uzupełniamy brakujące pola w każdej ikonie
    console.log('📦 NAPRAWIANIE DANYCH: Uzupełnianie brakujących pól w ikonach...');
    
    data.icons = data.icons.map((icon: any) => {
      if (!icon) return null;
      
      // Sprawdzamy i dodajemy puste tablice dla categories jeśli nie istnieją
      if (!icon.categories) {
        console.log(`📦 Ikona ${icon.id || 'bez ID'}: dodaję brakujące pole 'categories' jako pustą tablicę`);
        icon.categories = [];
      } else if (!Array.isArray(icon.categories)) {
        console.warn(`⚠️ UWAGA: Pole 'categories' ikony ${icon.id || 'bez ID'} nie jest tablicą! Typ:`, typeof icon.categories);
        icon.categories = Array.isArray(icon.categories) ? icon.categories : [];
      }
      
      // Sprawdzamy i dodajemy puste tablice dla tags jeśli nie istnieją
      if (!icon.tags) {
        icon.tags = [];
      } else if (!Array.isArray(icon.tags)) {
        console.warn(`⚠️ UWAGA: Pole 'tags' ikony ${icon.id || 'bez ID'} nie jest tablicą! Typ:`, typeof icon.tags);
        icon.tags = Array.isArray(icon.tags) ? icon.tags : [];
      }
      
      return icon;
    }).filter((icon: any) => icon !== null); // Usuwamy null
    
    // Sprawdzam obecność kategorii na poziomie głównym JSON - to nie jest krytyczne
    console.log('📦 DIAGNOSTYKA - Czy istnieje pole categories:', data.categories !== undefined);
    if (data.categories !== undefined && !Array.isArray(data.categories)) {
      console.warn('⚠️ UWAGA: Pole "categories" nie jest tablicą!');
      console.warn('Typ pola categories:', typeof data.categories);
      // Inicjalizujemy jako pustą tablicę, aby uniknąć błędu forEach
      data.categories = [];
    }
    
    // Jeśli categories nie istnieje, tworzymy go na podstawie kategorii ikon
    if (!data.categories || !Array.isArray(data.categories)) {
      console.log('📦 NAPRAWIANIE DANYCH: Tworzenie pola "categories" na podstawie kategorii ikon');
      
      // Zbieramy wszystkie unikalne kategorie z ikon
      const allCategories = new Set<string>();
      
      data.icons.forEach((icon: any) => {
        if (icon.categories && Array.isArray(icon.categories)) {
          icon.categories.forEach((category: string) => {
            if (category) allCategories.add(category);
          });
        }
      });
      
      data.categories = Array.from(allCategories);
      console.log(`📦 Utworzono pole "categories" z ${data.categories.length} kategoriami`);
    }
    
    console.log('Pobrano metadane ikon:', {
      lastUpdated: data.lastUpdated,
      totalCount: data.totalCount,
      categories: data.categories ? data.categories.length : 0,
      icons: data.icons ? data.icons.length : 0
    });
    
    // Wyświetl przykładową ikonę (jeśli istnieje)
    if (data.icons && data.icons.length > 0) {
      console.log('Przykładowa ikona:', data.icons[0]);
    }
    
    return data;
  } catch (error) {
    console.error('Błąd podczas pobierania metadanych ikon:', error);
    // Dodajemy powiadomienie Figma o błędzie
    figma.notify('Błąd pobierania metadanych ikon. Sprawdź konsolę.', { error: true });
    throw error;
  }
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
        const iconsMetadata = await fetchIconsMetadata();
        
        // WAŻNE: Sprawdzamy czy iconsMetadata i jego pola istnieją przed wysłaniem do UI
        if (!iconsMetadata) {
          throw new Error('Metadane ikon są puste (null/undefined)');
        }
        
        // Sprawdzamy i inicjalizujemy icons
        let icons: Icon[] = [];
        if (iconsMetadata.icons && Array.isArray(iconsMetadata.icons)) {
          icons = iconsMetadata.icons;
        } else {
          console.error('⚠️ BŁĄD: iconsMetadata.icons jest undefined lub nie jest tablicą');
          console.error('iconsMetadata:', iconsMetadata);
        }
        
        // Sprawdzamy i inicjalizujemy categories
        let categories: string[] = [];
        if (iconsMetadata.categories && Array.isArray(iconsMetadata.categories)) {
          categories = iconsMetadata.categories;
        } else {
          console.log('ℹ️ INFO: iconsMetadata.categories jest undefined lub nie jest tablicą, używam pustej tablicy');
        }
        
        console.log('📦 DIAGNOSTYKA - Wysyłanie do UI:', {
          iconsCount: icons.length,
          categoriesCount: categories.length
        });
        
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

/**
 * Prosty test dostępu do pliku icons-metadata.json
 * bez parametrów cache-busting, aby sprawdzić czy problem jest z cache
 */
async function testDirectFetch() {
  try {
    // Testujemy URL bezpośrednio - usuwamy problematyczne nagłówki
    let directUrl = 'https://figma-plugin-indol.vercel.app/icons-metadata.json';
    
    // Sprawdź czy URL używa HTTPS
    if (directUrl.startsWith('http://')) {
      console.warn('⚠️ BŁĄD: URL testu używa HTTP zamiast HTTPS!');
      console.warn(`   Oryginalny URL: ${directUrl}`);
      console.warn('   Figma blokuje żądania HTTP (Mixed Content Error).');
      // Spróbuj naprawić URL zamieniając http na https
      directUrl = directUrl.replace('http://', 'https://');
      console.warn(`   Próba naprawy URL: ${directUrl}`);
    }
    
    console.log(`⚙️ TEST: Bezpośredni fetch z: ${directUrl}`);
    
    // Usuwamy nagłówki powodujące problemy CORS
    const testResponse = await fetch(directUrl);
    
    console.log(`⚙️ TEST: Status: ${testResponse.status} ${testResponse.statusText}`);
    console.log(`⚙️ TEST: URL: ${testResponse.url}`);
    console.log(`⚙️ TEST: Type: ${testResponse.type}`);
    
    let contentType = null;
    
    // Ignorujemy błąd "response.headers jest undefined" i obsługujemy go bezpiecznie
    try {
      if (testResponse.headers) {
        console.log('⚙️ TEST: Nagłówki odpowiedzi:');
        
        // Bezpieczna obsługa nagłówków
        if (typeof testResponse.headers.forEach === 'function') {
          testResponse.headers.forEach((value, key) => {
            console.log(`  ${key}: ${value}`);
          });
        } else {
          console.log('⚙️ TEST: Metoda forEach nie jest dostępna dla nagłówków');
        }
        
        // Pobieramy Content-Type w bezpieczny sposób
        if (typeof testResponse.headers.get === 'function') {
          contentType = testResponse.headers.get('content-type');
          console.log(`⚙️ TEST: Content-Type: ${contentType}`);
        }
      } else {
        console.log('⚙️ TEST: ⚠️ UWAGA: testResponse.headers jest undefined - typowe w środowisku Figma');
      }
    } catch (headerError) {
      console.warn('⚙️ TEST: ⚠️ UWAGA: Błąd podczas przetwarzania nagłówków:', headerError);
    }
    
    if (!testResponse.ok) {
      console.error(`⚙️ TEST: Błąd HTTP - ${testResponse.status} ${testResponse.statusText}`);
      return;
    }
    
    const testText = await testResponse.text();
    
    // DIAGNOSTYKA: Wyświetlamy surowy tekst odpowiedzi
    console.log('⚙️ TEST: 📦 DIAGNOSTYKA - Surowy tekst odpowiedzi (pierwsze 200 znaków):');
    console.log(testText.substring(0, 200));
    
    // Sprawdzamy czy odpowiedź jest pusta
    if (!testText || testText.trim() === '') {
      console.error('⚙️ TEST: Otrzymano pustą odpowiedź!');
      return;
    }
    
    console.log(`⚙️ TEST: Wielkość odpowiedzi: ${testText.length} znaków`);
    
    // Sprawdźmy, czy to jest HTML czy JSON
    if (testText.trim().startsWith('<')) {
      console.error('⚙️ TEST: Otrzymano HTML zamiast JSON w teście bezpośrednim!');
      console.error('⚙️ TEST: Pierwsze 100 znaków:', testText.substring(0, 100));
    } else {
      console.log('⚙️ TEST: Otrzymano prawdopodobnie poprawny JSON');
      
      // Spróbujmy sparsować JSON
      try {
        const jsonData = JSON.parse(testText);
        console.log('⚙️ TEST: Parsowanie JSON powiodło się');
        
        // DIAGNOSTYKA: Sprawdzamy dokładnie strukturę danych
        console.log('⚙️ TEST: 📦 DIAGNOSTYKA - Pełna struktura danych:', jsonData);
        
        // Sprawdzamy czy ikony istnieją i są tablicą
        if (!jsonData.icons) {
          console.error('⚙️ TEST: ⚠️ BŁĄD: Brak pola "icons" w strukturze JSON!');
        } else if (!Array.isArray(jsonData.icons)) {
          console.error('⚙️ TEST: ⚠️ BŁĄD: Pole "icons" nie jest tablicą!');
          console.error('⚙️ TEST: Typ pola icons:', typeof jsonData.icons);
        } else {
          console.log('⚙️ TEST: ✅ Pole "icons" jest tablicą z', jsonData.icons.length, 'elementami');
          if (jsonData.icons.length > 0) {
            console.log('⚙️ TEST: Przykładowa ikona:', jsonData.icons[0]);
          }
        }
        
        // Sprawdzamy czy categories istnieją i są tablicą
        if (jsonData.categories === undefined) {
          console.log('⚙️ TEST: ℹ️ INFO: Brak pola "categories" w strukturze JSON');
        } else if (!Array.isArray(jsonData.categories)) {
          console.warn('⚙️ TEST: ⚠️ UWAGA: Pole "categories" nie jest tablicą!');
          console.warn('⚙️ TEST: Typ pola categories:', typeof jsonData.categories);
        } else {
          console.log('⚙️ TEST: ✅ Pole "categories" jest tablicą z', jsonData.categories.length, 'elementami');
        }
        
        console.log('⚙️ TEST: Struktura danych:', 
          jsonData.icons ? `Znaleziono ${jsonData.icons.length} ikon` : 'Brak ikon',
          jsonData.categories ? `Znaleziono ${jsonData.categories.length} kategorii` : 'Brak kategorii',
          jsonData.lastUpdated ? `Ostatnia aktualizacja: ${jsonData.lastUpdated}` : 'Brak daty aktualizacji'
        );
      } catch (parseError) {
        console.error('⚙️ TEST: Błąd parsowania JSON:', parseError);
        console.error('⚙️ TEST: Pierwsze 100 znaków tekstu:', testText.substring(0, 100));
      }
    }
  } catch (error) {
    console.error('⚙️ TEST: Błąd podczas testu bezpośredniego fetch:', error);
  }
} 