const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  
  // Tylko kod pluginu
  entry: {
    code: './src/code.ts',
  },
  
  resolve: {
    extensions: ['.ts', '.js'],
  },
  
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
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
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/ui/ui.html',
      filename: 'ui.html',
      inject: false
    }),
    // Kopiuje plik icons-metadata.json do katalogu src/
    // Po uruchomieniu `npm run generate-icons` i przed budowaniem
    new CopyPlugin({
      patterns: [
        { 
          from: 'icons-metadata.json', 
          to: 'src/icons-metadata.json',
          noErrorOnMissing: true 
        },
      ],
    }),
  ],
  
  optimization: {
    minimize: false
  },
}; 