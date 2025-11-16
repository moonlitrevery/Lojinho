const helmet = require('helmet');
const cors = require('cors');

const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:4321',
    'http://127.0.0.1:4321',
    'http://poke_frontend:4321',
    'http://frontend:4321'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  crossOriginEmbedderPolicy: false
});

const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/[<>]/g, '');
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

const preventParameterPollution = (req, res, next) => {
  for (const key in req.query) {
    if (Array.isArray(req.query[key]) && req.query[key].length > 0) {
      req.query[key] = req.query[key][0];
    }
  }
  next();
};

const securityLogger = (req, res, next) => {
  const securityRelevantPaths = ['/users/login', '/users/register', '/teams/create'];
  
  if (securityRelevantPaths.includes(req.path)) {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  }
  next();
};

module.exports = {
  corsOptions,
  helmetConfig,
  sanitizeInput,
  preventParameterPollution,
  securityLogger,
  cors: cors(corsOptions)
};