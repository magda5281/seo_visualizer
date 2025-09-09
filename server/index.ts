import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import { setupVite, serveStatic, log } from './vite';

// Validate critical environment variables and dependencies
function validateEnvironment(): void {
  const requiredVars = ['NODE_ENV'];
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
    process.exit(1);
  }

  // SESSION_SECRET is recommended but not required for this SEO analysis app
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === 'production') {
    console.warn(
      'WARNING: SESSION_SECRET environment variable is not set. This is recommended for production deployments.'
    );
    // Generate a default session secret for basic functionality
    process.env.SESSION_SECRET = 'default-session-secret-' + Date.now();
  }

  console.log(`Environment validated: NODE_ENV=${process.env.NODE_ENV}`);
}

// Validate critical startup dependencies
async function validateDependencies(): Promise<void> {
  try {
    // Test storage initialization
    const { storage } = await import('./storage');
    if (!storage) {
      throw new Error('Storage service failed to initialize');
    }
    console.log('Storage service initialized successfully');

    // Test schema imports
    await import('@shared/schema');
    console.log('Shared schemas loaded successfully');
  } catch (error) {
    console.error('❌ Critical dependency validation failed:', error);
    throw new Error(
      `Dependency validation failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + '…';
      }

      log(logLine);
    }
  });

  next();
});

// Initialize server with comprehensive error handling
(async () => {
  try {
    // Validate environment variables first
    validateEnvironment();

    // Validate critical dependencies
    await validateDependencies();

    console.log('Starting server initialization...');

    // Register routes
    const server = await registerRoutes(app);
    console.log('Routes registered successfully');

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';

      console.error('Request error:', { status, message, stack: err.stack });
      res.status(status).json({ message });
    });

    // Setup development or production environment
    if (app.get('env') === 'development') {
      console.log('Setting up Vite for development...');
      await setupVite(app, server);
    } else {
      console.log('Setting up static file serving for production...');
      serveStatic(app);
    }

    // Parse port with validation
    // Parse port with validation
    const portEnv = process.env.PORT || '5000';
    const PORT = parseInt(portEnv, 10);
    if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
      throw new Error(`Invalid PORT value: ${portEnv}. Port must be 1–65535.`);
    }

    // Detect Replit / common cloud envs
    const isReplit = !!process.env.REPL_ID; // Replit sets REPL_ID
    const isCloud =
      isReplit ||
      !!process.env.K_SERVICE || // Cloud Run
      !!process.env.GAE_SERVICE || // App Engine
      !!process.env.FLY_APP_NAME; // Fly.io

    // Use provided HOST, else 0.0.0.0 in cloud, 127.0.0.1 locally
    const HOST = process.env.HOST ?? (isCloud ? '0.0.0.0' : '127.0.0.1');

    // ✅ Use classic signature; DO NOT pass reusePort (causes ENOTSUP locally)
    server.listen(PORT, HOST, () => {
      console.log(`✅ Server successfully started`);
      console.log(`🌐 Listening on http://${HOST}:${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      log(`serving on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (err: any) => {
      console.error('❌ Server error:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(
          `Port ${port} is already in use. Please use a different port.`
        );
      } else if (err.code === 'EACCES') {
        console.error(
          `Permission denied for port ${port}. Try using a port number above 1024.`
        );
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Fatal error during server startup:');
    console.error(error);
    console.error(
      'Server failed to start. Please check your configuration and try again.'
    );
    process.exit(1);
  }
})();

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
