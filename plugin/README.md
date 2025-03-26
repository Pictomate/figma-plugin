# Figma Icon Plugin

Plugin do Figma umożliwiający wyszukiwanie, personalizację i wstawianie ikon SVG do projektów Figma.

## Funkcjonalności

- Wyszukiwanie ikon po nazwie, kategoriach i tagach
- Zaawansowana personalizacja (kolor, rozmiar, obrót, odbicie)
- Lazy loading dla dużej liczby ikon
- Wsparcie dla ikon premium/płatnych

## Instalacja i uruchamianie

### Wymagania

- Node.js (wersja 14+)
- NPM lub Yarn

### Konfiguracja dla deweloperów

1. Sklonuj repozytorium:
   ```
   git clone https://github.com/twoj-username/figma-icon-plugin.git
   cd figma-icon-plugin
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

3. Uruchom w trybie deweloperskim:
   ```
   npm run dev
   ```

4. W Figma Desktop, załaduj plugin z manifestu:
   - Otwórz Figma
   - Przejdź do menu Plugins > Development > Import plugin from manifest...
   - Wybierz plik `manifest.json` z katalogu projektu

### Budowanie produkcyjne

```
npm run build
```

## Struktura projektu

- `src/backend/` - Kod odpowiedzialny za komunikację z Figma API
- `src/ui/` - Interfejs użytkownika (komponenty React)
- `src/config/` - Pliki konfiguracyjne
- `src/types/` - Definicje typów TypeScript
- `src/icons/` - Przykładowe ikony SVG (tylko w trybie deweloperskim)

## Konfiguracja źródła ikon

Plugin domyślnie korzysta z ikon hostowanych na Vercel. Możesz zmienić źródło w pliku `src/config/config.ts`.

## Struktura pliku JSON z metadanymi ikon

Plik JSON z metadanymi ikon (`icons-metadata.json`) ma następującą strukturę:

```json
{
  "lastUpdated": "2023-06-15T12:00:00Z",  // Data ostatniej aktualizacji zbioru ikon
  "totalCount": 1821,                     // Całkowita liczba dostępnych ikon
  "categories": ["Kategoria1", "Kategoria2", ...],  // Lista wszystkich kategorii
  "icons": [
    {
      "id": "icon-001",                   // Unikalny identyfikator ikony
      "name": "Nazwa ikony",              // Nazwa wyświetlana w interfejsie
      "categories": ["Kategoria1"],       // Kategorie, do których należy ikona
      "tags": ["tag1", "tag2"],           // Tagi ułatwiające wyszukiwanie
      "svgUrl": "ścieżka/do/ikony.svg",   // Ścieżka do pliku SVG
      "premium": false                    // Flaga określająca, czy ikona jest premium
    },
    // ...
  ]
}
```

## Licencja

MIT 