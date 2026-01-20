const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  // Webpack configuration for production optimizations
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: 'mui',
          chunks: 'all',
          priority: 20,
        },
        charts: {
          test: /[\\/]node_modules[\\/](chart\.js|react-chartjs-2)[\\/]/,
          name: 'charts',
          chunks: 'all',
          priority: 15,
        },
      },
    },
    usedExports: true,
    sideEffects: false,
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
    },
  },

  plugins: [
    // Bundle analyzer for production builds
    ...(process.env.ANALYZE_BUNDLE === 'true' ? [new BundleAnalyzerPlugin()] : []),
  ],

  // Performance hints
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 512000,
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
};