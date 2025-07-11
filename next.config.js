// next.config.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Proxy API requests to backend
      },
    ];
  },
};
