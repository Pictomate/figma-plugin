/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 513:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Main plugin file - handles communication with Figma API
 */
var types_1 = __webpack_require__(799);
var config_1 = __webpack_require__(800);
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
console.log('Icons metadata URL:', config_1.ICONS_METADATA_URL);
// Test bezpośredniego dostępu do pliku icons-metadata.json bez parametrów
testDirectFetch();
/**
 * Ustawienia rozmiaru UI
 */
figma.showUI(__html__, { width: 668, height: 600 });
/**
 * Konwersja koloru HEX na RGB
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
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
function insertIcons(icons, color) {
    return __awaiter(this, void 0, void 0, function () {
        var iconSize, gap, cols, nodes, rgbColor, windowSize, zoom, center, startX, startY, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Sprawdź czy mamy ikony do wstawienia
                    if (!icons || icons.length === 0) {
                        return [2 /*return*/];
                    }
                    iconSize = 24;
                    gap = 16;
                    cols = Math.min(8, icons.length);
                    nodes = [];
                    rgbColor = hexToRgb(color);
                    windowSize = {
                        width: 668, // szerokość okna pluginu
                        height: 600 // wysokość okna pluginu
                    };
                    zoom = figma.viewport.zoom;
                    center = figma.viewport.center;
                    startX = center.x + (windowSize.width / 2 / zoom) + 20;
                    startY = center.y - (windowSize.height / 2 / zoom);
                    _loop_1 = function (i) {
                        var icon, timestamp, svgUrl, svgResponse, svgHeaders_1, svgContentType, svgText, node, frame, paths, _i, paths_1, path, row, col, error_1, fallbackFrame, fallbackNode, vectorPath, row, col;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    icon = icons[i];
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 4, , 5]);
                                    // Dodaj pobieranie SVG z serwera
                                    if (!icon.svgUrl) {
                                        throw new Error("SVG URL is missing for icon ".concat(icon.name));
                                    }
                                    // Sprawdź czy URL używa HTTPS
                                    if (icon.svgUrl.startsWith('http://')) {
                                        console.warn("\u26A0\uFE0F B\u0141\u0104D: URL ikony ".concat(icon.name, " u\u017Cywa HTTP zamiast HTTPS!"));
                                        console.warn("   Oryginalny URL: ".concat(icon.svgUrl));
                                        console.warn("   Figma blokuje zasoby z HTTP (Mixed Content Error).");
                                        // Spróbuj naprawić URL zamieniając http na https
                                        icon.svgUrl = icon.svgUrl.replace('http://', 'https://');
                                        console.warn("   Pr\u00F3ba naprawy URL: ".concat(icon.svgUrl));
                                    }
                                    timestamp = Date.now();
                                    svgUrl = icon.svgUrl + '?v=' + timestamp;
                                    console.log("Pobieranie ikony [".concat(icon.name, "] z: ").concat(svgUrl));
                                    // Weryfikacja URL
                                    if (!svgUrl.includes('figma-plugin-indol.vercel.app')) {
                                        console.warn("\u26A0\uFE0F UWAGA: URL ikony ".concat(icon.name, " nie zawiera oczekiwanej domeny figma-plugin-indol.vercel.app!"));
                                        console.warn("   Aktualny URL: ".concat(svgUrl));
                                        console.warn("   Sprawd\u017A czy w pliku icons-metadata.json s\u0105 poprawne URL-e.");
                                    }
                                    return [4 /*yield*/, fetch(svgUrl)];
                                case 2:
                                    svgResponse = _b.sent();
                                    // Diagnostyka nagłówków CORS dla pliku SVG
                                    console.log("Szczeg\u00F3\u0142y odpowiedzi SVG dla ".concat(icon.name, ":"));
                                    console.log("- Status: ".concat(svgResponse.status, " ").concat(svgResponse.statusText));
                                    console.log("- URL: ".concat(svgResponse.url));
                                    console.log("- Type: ".concat(svgResponse.type));
                                    svgHeaders_1 = {};
                                    svgResponse.headers.forEach(function (value, key) {
                                        console.log("  ".concat(key, ": ").concat(value));
                                        svgHeaders_1[key.toLowerCase()] = value;
                                    });
                                    svgContentType = svgHeaders_1['content-type'] || '';
                                    if (!svgContentType.includes('svg') && !svgContentType.includes('xml')) {
                                        console.warn("\u26A0\uFE0F UWAGA: Niepoprawny Content-Type dla ikony ".concat(icon.name, ": ").concat(svgContentType));
                                        console.warn('Oczekiwano image/svg+xml lub text/xml - to może powodować błędy rendering');
                                    }
                                    // Sprawdzamy czy nagłówek CORS istnieje
                                    if (!svgHeaders_1['access-control-allow-origin']) {
                                        console.warn("\u26A0\uFE0F UWAGA: Brak nag\u0142\u00F3wka CORS dla ikony ".concat(icon.name, "!"));
                                        console.warn('Sprawdź konfigurację Vercel - plik vercel.json powinien zawierać nagłówek "Access-Control-Allow-Origin": "*"');
                                    }
                                    else {
                                        console.log("\u2705 Nag\u0142\u00F3wek CORS dla ikony ".concat(icon.name, " jest obecny."));
                                    }
                                    if (!svgResponse.ok) {
                                        throw new Error("B\u0142\u0105d pobierania SVG: ".concat(svgResponse.status, " ").concat(svgResponse.statusText, " - URL: ").concat(svgUrl));
                                    }
                                    return [4 /*yield*/, svgResponse.text()];
                                case 3:
                                    svgText = _b.sent();
                                    // Sprawdzamy, czy odpowiedź jest pusta
                                    if (!svgText || svgText.trim() === '') {
                                        console.error("\u26A0\uFE0F B\u0141\u0104D: Otrzymano pust\u0105 odpowied\u017A SVG dla ikony ".concat(icon.name, "!"));
                                        throw new Error("Otrzymano pust\u0105 odpowied\u017A SVG dla ikony ".concat(icon.name));
                                    }
                                    // Sprawdzamy czy otrzymano HTML zamiast SVG
                                    if (svgText.trim().startsWith('<!DOCTYPE html>') || svgText.trim().startsWith('<html')) {
                                        console.error("\u26A0\uFE0F B\u0141\u0104D: Otrzymano HTML zamiast SVG dla ikony ".concat(icon.name, "!"));
                                        console.error('Pierwsze 100 znaków:', svgText.substring(0, 100));
                                        throw new Error("Otrzymano HTML zamiast SVG dla ikony ".concat(icon.name));
                                    }
                                    // Wyświetl początek zawartości SVG
                                    console.log("Zawarto\u015B\u0107 SVG (pierwsze 100 znak\u00F3w):");
                                    console.log(JSON.stringify(svgText.substring(0, 100)) + (svgText.length > 100 ? '...' : ''));
                                    node = figma.createNodeFromSvg(svgText);
                                    frame = figma.createFrame();
                                    frame.name = icon.name;
                                    frame.resize(iconSize, iconSize);
                                    frame.fills = []; // Przezroczyste tło
                                    // Ustaw nazwę ikony
                                    node.name = "icon";
                                    // Usuń tło
                                    node.fills = [];
                                    paths = node.findAll(function (n) { return n.type === 'VECTOR'; });
                                    if (paths && paths.length > 0) {
                                        for (_i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                                            path = paths_1[_i];
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
                                    row = Math.floor(i / cols);
                                    col = i % cols;
                                    frame.x = startX + col * (iconSize + gap);
                                    frame.y = startY + row * (iconSize + gap);
                                    // Dodaj do strony
                                    figma.currentPage.appendChild(frame);
                                    // Dodaj do tablicy nodeów
                                    nodes.push(frame);
                                    return [3 /*break*/, 5];
                                case 4:
                                    error_1 = _b.sent();
                                    console.error("Error inserting icon ".concat(icon.name, ":"), error_1);
                                    fallbackFrame = figma.createFrame();
                                    fallbackFrame.name = icon.name + " (error)";
                                    fallbackFrame.resize(iconSize, iconSize);
                                    fallbackFrame.fills = []; // Przezroczyste tło
                                    fallbackNode = figma.createNodeFromSvg("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\">\n          <path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z\"/>\n        </svg>");
                                    vectorPath = fallbackNode.findOne(function (n) { return n.type === 'VECTOR'; });
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
                                    row = Math.floor(i / cols);
                                    col = i % cols;
                                    fallbackFrame.x = startX + col * (iconSize + gap);
                                    fallbackFrame.y = startY + row * (iconSize + gap);
                                    // Dodaj do strony
                                    figma.currentPage.appendChild(fallbackFrame);
                                    // Dodaj do tablicy nodeów
                                    nodes.push(fallbackFrame);
                                    return [3 /*break*/, 5];
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < icons.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Wybierz wszystkie ikony
                    figma.currentPage.selection = nodes;
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Pobiera metadane ikon z zewnętrznego serwera
 * @returns Promise z danymi o ikonach
 */
function fetchIconsMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var timestamp, url, response, contentType, headers_1, responseText, data, allCategories_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    timestamp = Date.now();
                    url = config_1.ICONS_METADATA_URL + '?v=' + timestamp;
                    // Sprawdź czy URL używa HTTPS - Figma wymaga HTTPS
                    if (url.startsWith('http://')) {
                        console.warn('⚠️ BŁĄD: URL metadanych używa HTTP zamiast HTTPS!');
                        console.warn("   Oryginalny URL: ".concat(url));
                        console.warn('   Figma blokuje żądania HTTP (Mixed Content Error).');
                        // Spróbuj naprawić URL zamieniając http na https
                        url = url.replace('http://', 'https://');
                        console.warn("   Pr\u00F3ba naprawy URL: ".concat(url));
                    }
                    console.log("Pobieranie metadanych ikon z: ".concat(url));
                    console.log("Timestamp: ".concat(timestamp, ", Data: ").concat(new Date(timestamp).toISOString()));
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    console.log('Szczegóły odpowiedzi HTTP:');
                    console.log("- Status: ".concat(response.status, " ").concat(response.statusText));
                    console.log("- URL: ".concat(response.url));
                    console.log("- Type: ".concat(response.type));
                    contentType = null;
                    headers_1 = {};
                    // Bezpieczna obsługa nagłówków - ignorujemy błąd "headers jest undefined"
                    try {
                        if (response.headers) {
                            console.log('- Nagłówki odpowiedzi:');
                            // Bezpieczna obsługa nagłówków
                            if (typeof response.headers.forEach === 'function') {
                                response.headers.forEach(function (value, key) {
                                    console.log("  ".concat(key, ": ").concat(value));
                                    headers_1[key.toLowerCase()] = value;
                                });
                                // Sprawdzamy Content-Type
                                contentType = headers_1['content-type'] || '';
                                console.log("Content-Type odpowiedzi: ".concat(contentType));
                                if (!contentType.includes('application/json')) {
                                    console.warn("\u26A0\uFE0F UWAGA: Niepoprawny Content-Type: ".concat(contentType));
                                    console.warn('Oczekiwano application/json - to może powodować błąd parsowania');
                                }
                                // Sprawdzamy czy nagłówek CORS istnieje
                                if (!headers_1['access-control-allow-origin']) {
                                    console.warn('⚠️ UWAGA: Brak nagłówka CORS "Access-Control-Allow-Origin" w odpowiedzi!');
                                    console.log('To może być przyczyna błędu CORS. Sprawdź konfigurację serwera Vercel.');
                                }
                                else {
                                    console.log('✅ Nagłówek CORS "Access-Control-Allow-Origin" jest obecny w odpowiedzi.');
                                }
                            }
                            else {
                                console.log('⚠️ UWAGA: Metoda forEach nie jest dostępna dla nagłówków');
                            }
                        }
                        else {
                            console.log('⚠️ UWAGA: response.headers jest undefined - typowe w środowisku Figma');
                        }
                    }
                    catch (headerError) {
                        console.warn('⚠️ UWAGA: Błąd podczas przetwarzania nagłówków:', headerError);
                    }
                    if (!response.ok) {
                        throw new Error("B\u0142\u0105d pobierania metadanych: ".concat(response.status, " ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    responseText = _a.sent();
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
                    data = void 0;
                    try {
                        data = JSON.parse(responseText);
                        console.log('📦 DIAGNOSTYKA - Struktura sparsowanych danych JSON:', JSON.stringify(data).substring(0, 100));
                    }
                    catch (jsonError) {
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
                    data.icons = data.icons.map(function (icon) {
                        if (!icon)
                            return null;
                        // Sprawdzamy i dodajemy puste tablice dla categories jeśli nie istnieją
                        if (!icon.categories) {
                            console.log("\uD83D\uDCE6 Ikona ".concat(icon.id || 'bez ID', ": dodaj\u0119 brakuj\u0105ce pole 'categories' jako pust\u0105 tablic\u0119"));
                            icon.categories = [];
                        }
                        else if (!Array.isArray(icon.categories)) {
                            console.warn("\u26A0\uFE0F UWAGA: Pole 'categories' ikony ".concat(icon.id || 'bez ID', " nie jest tablic\u0105! Typ:"), typeof icon.categories);
                            icon.categories = Array.isArray(icon.categories) ? icon.categories : [];
                        }
                        // Sprawdzamy i dodajemy puste tablice dla tags jeśli nie istnieją
                        if (!icon.tags) {
                            icon.tags = [];
                        }
                        else if (!Array.isArray(icon.tags)) {
                            console.warn("\u26A0\uFE0F UWAGA: Pole 'tags' ikony ".concat(icon.id || 'bez ID', " nie jest tablic\u0105! Typ:"), typeof icon.tags);
                            icon.tags = Array.isArray(icon.tags) ? icon.tags : [];
                        }
                        return icon;
                    }).filter(function (icon) { return icon !== null; }); // Usuwamy null
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
                        allCategories_1 = new Set();
                        data.icons.forEach(function (icon) {
                            if (icon.categories && Array.isArray(icon.categories)) {
                                icon.categories.forEach(function (category) {
                                    if (category)
                                        allCategories_1.add(category);
                                });
                            }
                        });
                        data.categories = Array.from(allCategories_1);
                        console.log("\uD83D\uDCE6 Utworzono pole \"categories\" z ".concat(data.categories.length, " kategoriami"));
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
                    return [2 /*return*/, data];
                case 3:
                    error_2 = _a.sent();
                    console.error('Błąd podczas pobierania metadanych ikon:', error_2);
                    // Dodajemy powiadomienie Figma o błędzie
                    figma.notify('Błąd pobierania metadanych ikon. Sprawdź konsolę.', { error: true });
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Nasłuchiwanie wiadomości z UI
 */
figma.ui.onmessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, iconsMetadata, icons, categories, error_3, icons, color, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = msg.type;
                switch (_a) {
                    case types_1.MessageType.UI_READY: return [3 /*break*/, 1];
                    case types_1.MessageType.INSERT_ICONS: return [3 /*break*/, 6];
                }
                return [3 /*break*/, 11];
            case 1:
                console.log('UI is ready, sending initial data');
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, fetchIconsMetadata()];
            case 3:
                iconsMetadata = _b.sent();
                // WAŻNE: Sprawdzamy czy iconsMetadata i jego pola istnieją przed wysłaniem do UI
                if (!iconsMetadata) {
                    throw new Error('Metadane ikon są puste (null/undefined)');
                }
                icons = [];
                if (iconsMetadata.icons && Array.isArray(iconsMetadata.icons)) {
                    icons = iconsMetadata.icons;
                }
                else {
                    console.error('⚠️ BŁĄD: iconsMetadata.icons jest undefined lub nie jest tablicą');
                    console.error('iconsMetadata:', iconsMetadata);
                }
                categories = [];
                if (iconsMetadata.categories && Array.isArray(iconsMetadata.categories)) {
                    categories = iconsMetadata.categories;
                }
                else {
                    console.log('ℹ️ INFO: iconsMetadata.categories jest undefined lub nie jest tablicą, używam pustej tablicy');
                }
                console.log('📦 DIAGNOSTYKA - Wysyłanie do UI:', {
                    iconsCount: icons.length,
                    categoriesCount: categories.length
                });
                // Wyślij dane do UI
                figma.ui.postMessage({
                    type: types_1.MessageType.INIT_DATA,
                    icons: icons,
                    categories: categories
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.error('Error initializing plugin:', error_3);
                figma.notify('Error initializing plugin', { error: true });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 12];
            case 6:
                console.log('Inserting icons:', msg.icons);
                _b.label = 7;
            case 7:
                _b.trys.push([7, 9, , 10]);
                icons = msg.icons;
                color = msg.color || '#000000';
                // Wstaw ikony
                return [4 /*yield*/, insertIcons(icons, color)];
            case 8:
                // Wstaw ikony
                _b.sent();
                // Powiadom UI o sukcesie
                figma.ui.postMessage({
                    type: types_1.MessageType.ICONS_INSERTED,
                    success: true
                });
                return [3 /*break*/, 10];
            case 9:
                error_4 = _b.sent();
                // Obsługa błędów
                console.error('Error inserting icons:', error_4);
                // Powiadom UI o błędzie
                figma.ui.postMessage({
                    type: types_1.MessageType.ICONS_INSERTED,
                    success: false,
                    details: error_4 instanceof Error ? error_4.message : 'Unknown error'
                });
                return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 12];
            case 11:
                console.log('Unknown message type:', msg.type);
                _b.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); };
/**
 * Prosty test dostępu do pliku icons-metadata.json
 * bez parametrów cache-busting, aby sprawdzić czy problem jest z cache
 */
function testDirectFetch() {
    return __awaiter(this, void 0, void 0, function () {
        var directUrl, testResponse, contentType, testText, jsonData, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    directUrl = 'https://figma-plugin-indol.vercel.app/icons-metadata.json';
                    // Sprawdź czy URL używa HTTPS
                    if (directUrl.startsWith('http://')) {
                        console.warn('⚠️ BŁĄD: URL testu używa HTTP zamiast HTTPS!');
                        console.warn("   Oryginalny URL: ".concat(directUrl));
                        console.warn('   Figma blokuje żądania HTTP (Mixed Content Error).');
                        // Spróbuj naprawić URL zamieniając http na https
                        directUrl = directUrl.replace('http://', 'https://');
                        console.warn("   Pr\u00F3ba naprawy URL: ".concat(directUrl));
                    }
                    console.log("\u2699\uFE0F TEST: Bezpo\u015Bredni fetch z: ".concat(directUrl));
                    return [4 /*yield*/, fetch(directUrl)];
                case 1:
                    testResponse = _a.sent();
                    console.log("\u2699\uFE0F TEST: Status: ".concat(testResponse.status, " ").concat(testResponse.statusText));
                    console.log("\u2699\uFE0F TEST: URL: ".concat(testResponse.url));
                    console.log("\u2699\uFE0F TEST: Type: ".concat(testResponse.type));
                    contentType = null;
                    // Ignorujemy błąd "response.headers jest undefined" i obsługujemy go bezpiecznie
                    try {
                        if (testResponse.headers) {
                            console.log('⚙️ TEST: Nagłówki odpowiedzi:');
                            // Bezpieczna obsługa nagłówków
                            if (typeof testResponse.headers.forEach === 'function') {
                                testResponse.headers.forEach(function (value, key) {
                                    console.log("  ".concat(key, ": ").concat(value));
                                });
                            }
                            else {
                                console.log('⚙️ TEST: Metoda forEach nie jest dostępna dla nagłówków');
                            }
                            // Pobieramy Content-Type w bezpieczny sposób
                            if (typeof testResponse.headers.get === 'function') {
                                contentType = testResponse.headers.get('content-type');
                                console.log("\u2699\uFE0F TEST: Content-Type: ".concat(contentType));
                            }
                        }
                        else {
                            console.log('⚙️ TEST: ⚠️ UWAGA: testResponse.headers jest undefined - typowe w środowisku Figma');
                        }
                    }
                    catch (headerError) {
                        console.warn('⚙️ TEST: ⚠️ UWAGA: Błąd podczas przetwarzania nagłówków:', headerError);
                    }
                    if (!testResponse.ok) {
                        console.error("\u2699\uFE0F TEST: B\u0142\u0105d HTTP - ".concat(testResponse.status, " ").concat(testResponse.statusText));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, testResponse.text()];
                case 2:
                    testText = _a.sent();
                    // DIAGNOSTYKA: Wyświetlamy surowy tekst odpowiedzi
                    console.log('⚙️ TEST: 📦 DIAGNOSTYKA - Surowy tekst odpowiedzi (pierwsze 200 znaków):');
                    console.log(testText.substring(0, 200));
                    // Sprawdzamy czy odpowiedź jest pusta
                    if (!testText || testText.trim() === '') {
                        console.error('⚙️ TEST: Otrzymano pustą odpowiedź!');
                        return [2 /*return*/];
                    }
                    console.log("\u2699\uFE0F TEST: Wielko\u015B\u0107 odpowiedzi: ".concat(testText.length, " znak\u00F3w"));
                    // Sprawdźmy, czy to jest HTML czy JSON
                    if (testText.trim().startsWith('<')) {
                        console.error('⚙️ TEST: Otrzymano HTML zamiast JSON w teście bezpośrednim!');
                        console.error('⚙️ TEST: Pierwsze 100 znaków:', testText.substring(0, 100));
                    }
                    else {
                        console.log('⚙️ TEST: Otrzymano prawdopodobnie poprawny JSON');
                        // Spróbujmy sparsować JSON
                        try {
                            jsonData = JSON.parse(testText);
                            console.log('⚙️ TEST: Parsowanie JSON powiodło się');
                            // DIAGNOSTYKA: Sprawdzamy dokładnie strukturę danych
                            console.log('⚙️ TEST: 📦 DIAGNOSTYKA - Pełna struktura danych:', jsonData);
                            // Sprawdzamy czy ikony istnieją i są tablicą
                            if (!jsonData.icons) {
                                console.error('⚙️ TEST: ⚠️ BŁĄD: Brak pola "icons" w strukturze JSON!');
                            }
                            else if (!Array.isArray(jsonData.icons)) {
                                console.error('⚙️ TEST: ⚠️ BŁĄD: Pole "icons" nie jest tablicą!');
                                console.error('⚙️ TEST: Typ pola icons:', typeof jsonData.icons);
                            }
                            else {
                                console.log('⚙️ TEST: ✅ Pole "icons" jest tablicą z', jsonData.icons.length, 'elementami');
                                if (jsonData.icons.length > 0) {
                                    console.log('⚙️ TEST: Przykładowa ikona:', jsonData.icons[0]);
                                }
                            }
                            // Sprawdzamy czy categories istnieją i są tablicą
                            if (jsonData.categories === undefined) {
                                console.log('⚙️ TEST: ℹ️ INFO: Brak pola "categories" w strukturze JSON');
                            }
                            else if (!Array.isArray(jsonData.categories)) {
                                console.warn('⚙️ TEST: ⚠️ UWAGA: Pole "categories" nie jest tablicą!');
                                console.warn('⚙️ TEST: Typ pola categories:', typeof jsonData.categories);
                            }
                            else {
                                console.log('⚙️ TEST: ✅ Pole "categories" jest tablicą z', jsonData.categories.length, 'elementami');
                            }
                            console.log('⚙️ TEST: Struktura danych:', jsonData.icons ? "Znaleziono ".concat(jsonData.icons.length, " ikon") : 'Brak ikon', jsonData.categories ? "Znaleziono ".concat(jsonData.categories.length, " kategorii") : 'Brak kategorii', jsonData.lastUpdated ? "Ostatnia aktualizacja: ".concat(jsonData.lastUpdated) : 'Brak daty aktualizacji');
                        }
                        catch (parseError) {
                            console.error('⚙️ TEST: Błąd parsowania JSON:', parseError);
                            console.error('⚙️ TEST: Pierwsze 100 znaków tekstu:', testText.substring(0, 100));
                        }
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('⚙️ TEST: Błąd podczas testu bezpośredniego fetch:', error_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}


/***/ }),

/***/ 799:
/***/ (function(__unused_webpack_module, exports) {


/**
 * Definicje typów dla pluginu ikon
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageType = void 0;
/**
 * Typy komunikatów między UI a głównym wątkiem
 */
var MessageType;
(function (MessageType) {
    // Standardowe typy
    MessageType["INIT"] = "INIT";
    MessageType["SEARCH"] = "SEARCH";
    MessageType["INSERT_ICON"] = "INSERT_ICON";
    MessageType["LOAD_MORE"] = "LOAD_MORE";
    MessageType["ERROR"] = "ERROR";
    // Nowe typy dla nowego interfejsu
    MessageType["UI_READY"] = "UI_READY";
    MessageType["INIT_DATA"] = "INIT_DATA";
    MessageType["INSERT_ICONS"] = "INSERT_ICONS";
    MessageType["ICONS_INSERTED"] = "ICONS_INSERTED";
})(MessageType || (exports.MessageType = MessageType = {}));


/***/ }),

/***/ 800:
/***/ (function(__unused_webpack_module, exports) {


/**
 * Konfiguracja pluginu ikon dla Figma
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_ICON_COLOR = exports.DEFAULT_ICON_SIZE = exports.INITIAL_LOAD_LIMIT = exports.ICONS_PER_PAGE = exports.ICONS_METADATA_URL = exports.BASE_ICON_URL = exports.IS_DEVELOPMENT = void 0;
// Adresy URL dla wersji produkcyjnej i developerskiej
var DEV_ICON_URL = 'https://localhost:3000/icons';
var PROD_ICON_URL = 'https://figma-plugin-indol.vercel.app/icons';
var DEV_METADATA_URL = 'https://localhost:3000/icons-metadata.json';
var PROD_METADATA_URL = 'https://figma-plugin-indol.vercel.app/icons-metadata.json';
// Wskazuje, czy plugin działa w trybie developerskim czy produkcyjnym
exports.IS_DEVELOPMENT = false;
// Podstawowy URL dla zasobów ikon
exports.BASE_ICON_URL = exports.IS_DEVELOPMENT ? DEV_ICON_URL : PROD_ICON_URL;
// URL do pliku JSON z metadanymi ikon
exports.ICONS_METADATA_URL = exports.IS_DEVELOPMENT ? DEV_METADATA_URL : PROD_METADATA_URL;
/**
 * INFORMACJA: Po uruchomieniu `npm run generate-icons`, metadane są generowane w folderze assets/ i hostowane na Vercel.
 * Plugin zawsze pobiera najnowsze metadane i ikony z adresu URL określonego w ICONS_METADATA_URL,
 * co umożliwia aktualizację ikon bez konieczności aktualizacji samego pluginu Figma.
 *
 * DEBUGOWANIE:
 * 1. W Figma, otwórz menu Plugins > Development > Open Console
 * 2. Uruchom plugin
 * 3. W konsoli zobaczysz logi zawierające:
 *    - Dokładny URL, z którego pobierane są metadane
 *    - Status odpowiedzi i nagłówki (w tym CORS)
 *    - Zawartość pobranych danych
 *
 * UWAGA: HTTPS WYMAGANE!
 * Figma wymaga, aby wszystkie żądania zewnętrzne były wykonywane przez HTTPS.
 * Korzystanie z HTTP spowoduje błędy "Mixed Content", ponieważ Figma działa w środowisku HTTPS.
 * Nawet w trybie deweloperskim wszystkie URL powinny używać HTTPS.
 */
// Ustawienia dotyczące paginacji i lazy loadingu
exports.ICONS_PER_PAGE = 100;
exports.INITIAL_LOAD_LIMIT = 50;
// Domyślne ustawienia personalizacji ikon
exports.DEFAULT_ICON_SIZE = 24;
exports.DEFAULT_ICON_COLOR = '#000000';


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
!function() {
var exports = __webpack_exports__;
var __webpack_unused_export__;

/**
 * Główny punkt wejścia pluginu
 * Ten plik importuje właściwą logikę z katalogu backend
 */
__webpack_unused_export__ = ({ value: true });
__webpack_require__(513);

}();
/******/ })()
;