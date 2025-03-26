const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * ARCHITEKTURA PROJEKTU
 * --------------------
 * assets/ - katalog z ikonami i metadanymi, hostowany na Vercel
 *   ├─ icons/ - folder zawierający pliki SVG ikon
 *   └─ icons-metadata.json - plik z metadanymi ikon, generowany przez generate-icons.js
 * 
 * plugin/ - kod źródłowy pluginu Figma
 *   ├─ dist/ - skompilowany plugin (nie zawiera ikon)
 *   └─ src/ - kod źródłowy pluginu
 * 
 * PRZEPŁYW DANYCH
 * --------------
 * 1. generate-icons.js skanuje katalog assets/icons/ i generuje plik assets/icons-metadata.json
 * 2. Plik assets/icons-metadata.json jest hostowany na Vercel razem z katalogiem icons
 * 3. Plugin Figma pobiera ikony z zewnętrznego URL (np. https://moje-adres-vercel.app/icons/...)
 * 4. Ikony NIE są częścią samego pluginu, co pozwala na ich aktualizację bez konieczności aktualizacji pluginu
 */

module.exports = {
  mode: 'development',
  
  // Wejściowy plik pluginu
  entry: {
    code: './src/code.ts',
  },
  
  // Obsługiwane rozszerzenia plików
  resolve: {
    extensions: ['.ts', '.js'],
  },
  
  // Konfiguracja wyjścia
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Katalog wyjściowy dla zbudowanego pluginu
    clean: true, // Czyści katalog dist przed budowaniem
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false
    }
  },
  
  // Konfiguracja przetwarzania plików
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              target: 'es5',
              module: 'commonjs'
            }
          }
        },
        exclude: /node_modules/,
      }
    ],
  },
  
  // Wtyczki używane podczas budowania
  plugins: [
    // Generuje plik HTML dla interfejsu pluginu
    new HtmlWebpackPlugin({
      template: './src/ui/ui.html',
      filename: 'ui.html',
      inject: false
    }),
    
    // UWAGA: Usunięto CopyWebpackPlugin
    // Ikony i metadane są teraz hostowane oddzielnie w katalogu assets/ na Vercel
    // Plugin pobiera je z zewnętrznego URL, np. https://moje-adres-vercel.app/icons/...
    // Dzięki temu ikony można aktualizować niezależnie od pluginu
  ],
  
  // Wyłącza minimalizację kodu dla lepszej czytelności
  optimization: {
    minimize: false
  },
}; 