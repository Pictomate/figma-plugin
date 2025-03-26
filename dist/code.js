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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Main plugin file - handles communication with Figma API
 */
var types_1 = __webpack_require__(799);
var icons_metadata_json_1 = __importDefault(__webpack_require__(897));
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
        var iconSize, gap, cols, nodes, rgbColor, windowSize, zoom, center, startX, startY, i, icon, svgResponse, svgText, node, frame, paths, _i, paths_1, path, row, col, error_1, fallbackFrame, fallbackNode, vectorPath, row, col;
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
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < icons.length)) return [3 /*break*/, 7];
                    icon = icons[i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    // Pobierz SVG z serwera
                    if (!icon.svgUrl) {
                        throw new Error("SVG URL is missing for icon ".concat(icon.name));
                    }
                    return [4 /*yield*/, fetch(icon.svgUrl)];
                case 3:
                    svgResponse = _a.sent();
                    if (!svgResponse.ok) {
                        throw new Error("Failed to fetch SVG from ".concat(icon.svgUrl));
                    }
                    return [4 /*yield*/, svgResponse.text()];
                case 4:
                    svgText = _a.sent();
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
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
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
                    return [3 /*break*/, 6];
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    // Wybierz wszystkie ikony
                    figma.currentPage.selection = nodes;
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Nasłuchiwanie wiadomości z UI
 */
figma.ui.onmessage = function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, icons, categories, icons, color, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = msg.type;
                switch (_a) {
                    case types_1.MessageType.UI_READY: return [3 /*break*/, 1];
                    case types_1.MessageType.INSERT_ICONS: return [3 /*break*/, 2];
                }
                return [3 /*break*/, 7];
            case 1:
                console.log('UI is ready, sending initial data');
                try {
                    icons = icons_metadata_json_1.default.icons;
                    categories = icons_metadata_json_1.default.categories;
                    // Wyślij dane do UI
                    figma.ui.postMessage({
                        type: types_1.MessageType.INIT_DATA,
                        icons: icons,
                        categories: categories
                    });
                }
                catch (error) {
                    console.error('Error initializing plugin:', error);
                    figma.notify('Error initializing plugin', { error: true });
                }
                return [3 /*break*/, 8];
            case 2:
                console.log('Inserting icons:', msg.icons);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                icons = msg.icons;
                color = msg.color || '#000000';
                // Wstaw ikony
                return [4 /*yield*/, insertIcons(icons, color)];
            case 4:
                // Wstaw ikony
                _b.sent();
                // Powiadom UI o sukcesie
                figma.ui.postMessage({
                    type: types_1.MessageType.ICONS_INSERTED,
                    success: true
                });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                // Obsługa błędów
                console.error('Error inserting icons:', error_2);
                // Powiadom UI o błędzie
                figma.ui.postMessage({
                    type: types_1.MessageType.ICONS_INSERTED,
                    success: false,
                    details: error_2 instanceof Error ? error_2.message : 'Unknown error'
                });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                console.log('Unknown message type:', msg.type);
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };


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

/***/ 897:
/***/ (function(module) {

module.exports = /*#__PURE__*/JSON.parse('{"lastUpdated":"2024-03-25T12:00:00Z","totalCount":7,"categories":["Interfejs","Media","Komunikacja","Finanse","Biznes","Transport","Edukacja","Zdrowie","Sport","Pogoda","Design","Ecommerce"],"icons":[{"id":"icon-001","name":"Home","categories":["Interfejs"],"tags":["dom","strona główna","dashboard","menu"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Interfejs/home.svg","premium":false},{"id":"icon-002","name":"Search","categories":["Interfejs"],"tags":["szukaj","lupa","wyszukiwanie"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Interfejs/search.svg","premium":false},{"id":"icon-003","name":"Settings","categories":["Interfejs"],"tags":["ustawienia","konfiguracja","opcje","preferencje"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Interfejs/settings.svg","premium":false},{"id":"icon-004","name":"Play","categories":["Media"],"tags":["odtwarzanie","wideo","film","start"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Media/play.svg","premium":false},{"id":"icon-005","name":"Pause","categories":["Media"],"tags":["pauza","przerwa","wideo","film"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Media/pause.svg","premium":false},{"id":"icon-006","name":"Message","categories":["Komunikacja"],"tags":["wiadomość","czat","komunikacja","rozmowa"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Komunikacja/message.svg","premium":false},{"id":"icon-007","name":"Mail","categories":["Komunikacja"],"tags":["email","poczta","wiadomość","koperta"],"svgUrl":"https://figma-plugin-indol.vercel.app/icons/Komunikacja/mail.svg","premium":false}]}');

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