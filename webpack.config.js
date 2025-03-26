const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

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
    
    // Kopiuje pliki ikon i metadanych do katalogu dist
    // Dzięki temu pliki będą dostępne pod adresem URL: https://twoja-aplikacja.vercel.app/icons/...
    new CopyPlugin({
      patterns: [
        // Kopiuje cały katalog icons do dist/icons
        { 
          from: 'icons',
          to: 'icons',
          globOptions: {
            ignore: ['**/.DS_Store', '**/.gitkeep']  // Ignoruje pliki systemowe
          }
        },
        // Kopiuje plik icons-metadata.json do katalogu dist
        { 
          from: 'icons-metadata.json', 
          to: 'icons-metadata.json',
          noErrorOnMissing: true 
        },
        // Kopiuje również plik icons-metadata.json do katalogu src dla użycia podczas developmentu
        { 
          from: 'icons-metadata.json', 
          to: 'src/icons-metadata.json',
          noErrorOnMissing: true 
        }
      ],
    }),
  ],
  
  // Wyłącza minimalizację kodu dla lepszej czytelności
  optimization: {
    minimize: false
  },
}; 