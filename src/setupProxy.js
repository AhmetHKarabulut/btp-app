const { createProxyMiddleware } = require('http-proxy-middleware');

// Geliştirme için açık hedef. Üretimde burayı kullanmayın; .env veya config ile yönetin.
const TARGET = process.env.REACT_APP_API_BASE_URL || 'https://jelsoft-logo-interval-fountain.trycloudflare.com';

module.exports = function(app) {
  console.info('[setupProxy] Proxying /api ->', TARGET);
  app.use(
    '/api',
    createProxyMiddleware({
      target: TARGET,
      changeOrigin: true,
      secure: false, // development: self-signed / TLS sorunları varsa false yapın. Prod için true olmalı.
      logLevel: 'debug', // terminalde proxy loglarını görürsünüz
      onError(err, req, res) {
        console.error('[setupProxy] Proxy error:', err && err.message);
        if (!res.headersSent) {
          res.writeHead(502, { 'Content-Type': 'text/plain' });
        }
        res.end('Proxy error: ' + (err && err.message));
      },
    })
  );
};