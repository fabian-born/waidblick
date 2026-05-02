/**
 * API Routes Aggregator
 * Mounts all module routes
 */

import { Router } from 'express';

export const router = Router();

/**
 * Module Routes (will be imported when modules are created)
 */

// Import module routes here as they are created:
// import jaegerRoutes from '../modules/jaeger/jaeger.routes.js';
// import hegeringeRoutes from '../modules/hegeringe/hegeringe.routes.js';
// import revierRoutes from '../modules/reviere/reviere.routes.js';
// import paechterRoutes from '../modules/paechter/paechter.routes.js';
// import mitjaegerRoutes from '../modules/mitjaeger/mitjaeger.routes.js';

/**
 * Mount routes
 */
// router.use('/jaeger', jaegerRoutes);
// router.use('/hegeringe', hegeringeRoutes);
// router.use('/reviere', revierRoutes);
// router.use('/paechter', paechterRoutes);
// router.use('/mitjaeger', mitjaegerRoutes);

/**
 * API Info endpoint
 */
router.get('/', (req, res) => {
  res.json({
    name: 'Waidblick API',
    version: '1.0.0',
    description: 'Hunting Management System API',
    endpoints: {
      jaeger: '/api/jaeger',
      hegeringe: '/api/hegeringe',
      reviere: '/api/reviere',
      paechter: '/api/paechter',
      mitjaeger: '/api/mitjaeger',
    },
  });
});

export default router;
