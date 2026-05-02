# Backend Module Example
## Complete Implementation Pattern for "Jaeger" Module

This example shows how to implement a complete backend module following the modular architecture.

---

## File 1: `src/types/models.ts`
```typescript
// Shared TypeScript interfaces for domain models

export interface Jaeger {
  jaeger_id: number;
  vorname: string;
  nachname: string;
  email?: string;
  telefon?: string;
  adresse?: string;
  plz?: string;
  ort?: string;
  geburtsdatum?: Date;
  jagdschein_nummer?: string;
  jagdschein_gueltig_bis?: Date;
  haftpflichtversicherung_nummer?: string;
  versicherung_gueltig_bis?: Date;
  bemerkungen?: string;
  aktiv: boolean;
  erstellt_am: Date;
  aktualisiert_am: Date;
}

export interface CreateJaegerRequest {
  vorname: string;
  nachname: string;
  email?: string;
  telefon?: string;
  adresse?: string;
  plz?: string;
  ort?: string;
  geburtsdatum?: Date;
  jagdschein_nummer?: string;
  jagdschein_gueltig_bis?: Date;
  haftpflichtversicherung_nummer?: string;
  versicherung_gueltig_bis?: Date;
  bemerkungen?: string;
}

export interface UpdateJaegerRequest extends Partial<CreateJaegerRequest> {
  aktiv?: boolean;
}
```

---

## File 2: `src/modules/jaeger/jaeger.validation.ts`
```typescript
// Input validation schemas using Zod

import { z } from 'zod';

export const createJaegerSchema = z.object({
  vorname: z.string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  nachname: z.string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  telefon: z.string().optional().or(z.literal('')),
  adresse: z.string().max(255).optional().or(z.literal('')),
  plz: z.string().max(10).optional().or(z.literal('')),
  ort: z.string().max(100).optional().or(z.literal('')),
  geburtsdatum: z.coerce.date().optional(),
  jagdschein_nummer: z.string().max(50).optional().or(z.literal('')),
  jagdschein_gueltig_bis: z.coerce.date().optional(),
  haftpflichtversicherung_nummer: z.string().max(50).optional().or(z.literal('')),
  versicherung_gueltig_bis: z.coerce.date().optional(),
  bemerkungen: z.string().optional().or(z.literal('')),
});

export const updateJaegerSchema = createJaegerSchema.partial().extend({
  aktiv: z.boolean().optional(),
});

export const jaegerIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid jaeger ID'),
});

export type CreateJaegerInput = z.infer<typeof createJaegerSchema>;
export type UpdateJaegerInput = z.infer<typeof updateJaegerSchema>;
```

---

## File 3: `src/modules/jaeger/jaeger.repository.ts`
```typescript
// Database access layer - handles all SQL queries

import { Pool } from 'pg';
import { Jaeger, CreateJaegerRequest, UpdateJaegerRequest } from '../../types/models';
import { logger } from '../../utils/logger';

export class JaegerRepository {
  constructor(private db: Pool) {}

  /**
   * Fetch all active hunters
   */
  async findAll(): Promise<Jaeger[]> {
    try {
      const query = `
        SELECT * FROM jaeger
        WHERE aktiv = true
        ORDER BY nachname, vorname
      `;
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Error fetching jaeger list', error);
      throw error;
    }
  }

  /**
   * Fetch single hunter by ID
   */
  async findById(jaegerId: number): Promise<Jaeger | null> {
    try {
      const query = 'SELECT * FROM jaeger WHERE jaeger_id = $1';
      const result = await this.db.query(query, [jaegerId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error fetching jaeger ${jaegerId}`, error);
      throw error;
    }
  }

  /**
   * Fetch hunter by email
   */
  async findByEmail(email: string): Promise<Jaeger | null> {
    try {
      const query = 'SELECT * FROM jaeger WHERE email = $1';
      const result = await this.db.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error fetching jaeger by email ${email}`, error);
      throw error;
    }
  }

  /**
   * Create new hunter
   */
  async create(data: CreateJaegerRequest): Promise<Jaeger> {
    try {
      const query = `
        INSERT INTO jaeger (
          vorname, nachname, email, telefon, adresse, plz, ort,
          geburtsdatum, jagdschein_nummer, jagdschein_gueltig_bis,
          haftpflichtversicherung_nummer, versicherung_gueltig_bis,
          bemerkungen
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;
      
      const values = [
        data.vorname,
        data.nachname,
        data.email || null,
        data.telefon || null,
        data.adresse || null,
        data.plz || null,
        data.ort || null,
        data.geburtsdatum || null,
        data.jagdschein_nummer || null,
        data.jagdschein_gueltig_bis || null,
        data.haftpflichtversicherung_nummer || null,
        data.versicherung_gueltig_bis || null,
        data.bemerkungen || null,
      ];

      const result = await this.db.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating jaeger', error);
      throw error;
    }
  }

  /**
   * Update existing hunter
   */
  async update(jaegerId: number, data: UpdateJaegerRequest): Promise<Jaeger | null> {
    try {
      // Build dynamic UPDATE query based on provided fields
      const fields = Object.keys(data).filter(key => data[key as keyof UpdateJaegerRequest] !== undefined);
      if (fields.length === 0) return this.findById(jaegerId);

      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const values = fields.map(field => data[field as keyof UpdateJaegerRequest]);
      
      const query = `
        UPDATE jaeger
        SET ${setClause}, aktualisiert_am = CURRENT_TIMESTAMP
        WHERE jaeger_id = $${fields.length + 1}
        RETURNING *
      `;

      const result = await this.db.query(query, [...values, jaegerId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error updating jaeger ${jaegerId}`, error);
      throw error;
    }
  }

  /**
   * Soft delete - mark hunter as inactive
   */
  async deactivate(jaegerId: number): Promise<Jaeger | null> {
    try {
      const query = `
        UPDATE jaeger
        SET aktiv = false, aktualisiert_am = CURRENT_TIMESTAMP
        WHERE jaeger_id = $1
        RETURNING *
      `;
      const result = await this.db.query(query, [jaegerId]);
      return result.rows[0] || null;
    } catch (error) {
      logger.error(`Error deactivating jaeger ${jaegerId}`, error);
      throw error;
    }
  }

  /**
   * Search hunters by multiple criteria
   */
  async search(criteria: {
    name?: string;
    email?: string;
    plz?: string;
    aktiv?: boolean;
  }): Promise<Jaeger[]> {
    try {
      let query = 'SELECT * FROM jaeger WHERE 1 = 1';
      const values: unknown[] = [];
      let paramCount = 1;

      if (criteria.name) {
        query += ` AND (vorname ILIKE $${paramCount} OR nachname ILIKE $${paramCount})`;
        values.push(`%${criteria.name}%`);
        paramCount++;
      }

      if (criteria.email) {
        query += ` AND email = $${paramCount}`;
        values.push(criteria.email);
        paramCount++;
      }

      if (criteria.plz) {
        query += ` AND plz = $${paramCount}`;
        values.push(criteria.plz);
        paramCount++;
      }

      if (criteria.aktiv !== undefined) {
        query += ` AND aktiv = $${paramCount}`;
        values.push(criteria.aktiv);
        paramCount++;
      }

      query += ' ORDER BY nachname, vorname';

      const result = await this.db.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Error searching jaeger', error);
      throw error;
    }
  }

  /**
   * Get hunter count
   */
  async count(): Promise<number> {
    try {
      const result = await this.db.query('SELECT COUNT(*) as count FROM jaeger WHERE aktiv = true');
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      logger.error('Error counting jaeger', error);
      throw error;
    }
  }
}
```

---

## File 4: `src/modules/jaeger/jaeger.service.ts`
```typescript
// Business logic layer - coordinates between controller and repository

import { JaegerRepository } from './jaeger.repository';
import { Jaeger, CreateJaegerRequest, UpdateJaegerRequest } from '../../types/models';
import { AppError, ValidationError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export class JaegerService {
  constructor(private jaegerRepository: JaegerRepository) {}

  /**
   * Get all hunters
   */
  async getAllJaeger(): Promise<Jaeger[]> {
    try {
      return await this.jaegerRepository.findAll();
    } catch (error) {
      logger.error('Error in getAllJaeger service', error);
      throw new AppError('Failed to fetch hunters', 500);
    }
  }

  /**
   * Get single hunter
   */
  async getJaegerById(jaegerId: number): Promise<Jaeger> {
    try {
      const jaeger = await this.jaegerRepository.findById(jaegerId);
      if (!jaeger) {
        throw new AppError(`Hunter with ID ${jaegerId} not found`, 404);
      }
      return jaeger;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error in getJaegerById service for ID ${jaegerId}`, error);
      throw new AppError('Failed to fetch hunter', 500);
    }
  }

  /**
   * Create new hunter
   */
  async createJaeger(data: CreateJaegerRequest): Promise<Jaeger> {
    try {
      // Check if email already exists (if provided)
      if (data.email) {
        const existingJaeger = await this.jaegerRepository.findByEmail(data.email);
        if (existingJaeger) {
          throw new ValidationError('Email already exists');
        }
      }

      // Validate hunting license expiration date
      if (data.jagdschein_gueltig_bis) {
        if (data.jagdschein_gueltig_bis < new Date()) {
          throw new ValidationError('Hunting license expiration date must be in the future');
        }
      }

      return await this.jaegerRepository.create(data);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error in createJaeger service', error);
      throw new AppError('Failed to create hunter', 500);
    }
  }

  /**
   * Update hunter
   */
  async updateJaeger(jaegerId: number, data: UpdateJaegerRequest): Promise<Jaeger> {
    try {
      // Verify hunter exists
      const existingJaeger = await this.jaegerRepository.findById(jaegerId);
      if (!existingJaeger) {
        throw new AppError(`Hunter with ID ${jaegerId} not found`, 404);
      }

      // If email is being updated, check it's not taken
      if (data.email && data.email !== existingJaeger.email) {
        const emailExists = await this.jaegerRepository.findByEmail(data.email);
        if (emailExists) {
          throw new ValidationError('Email already exists');
        }
      }

      const updated = await this.jaegerRepository.update(jaegerId, data);
      if (!updated) {
        throw new AppError('Failed to update hunter', 500);
      }

      return updated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error in updateJaeger service for ID ${jaegerId}`, error);
      throw new AppError('Failed to update hunter', 500);
    }
  }

  /**
   * Deactivate hunter
   */
  async deactivateJaeger(jaegerId: number): Promise<Jaeger> {
    try {
      const jaeger = await this.jaegerRepository.findById(jaegerId);
      if (!jaeger) {
        throw new AppError(`Hunter with ID ${jaegerId} not found`, 404);
      }

      const deactivated = await this.jaegerRepository.deactivate(jaegerId);
      if (!deactivated) {
        throw new AppError('Failed to deactivate hunter', 500);
      }

      return deactivated;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error(`Error in deactivateJaeger service for ID ${jaegerId}`, error);
      throw new AppError('Failed to deactivate hunter', 500);
    }
  }

  /**
   * Search hunters
   */
  async searchJaeger(criteria: {
    name?: string;
    email?: string;
    plz?: string;
  }): Promise<Jaeger[]> {
    try {
      return await this.jaegerRepository.search({
        ...criteria,
        aktiv: true,
      });
    } catch (error) {
      logger.error('Error in searchJaeger service', error);
      throw new AppError('Failed to search hunters', 500);
    }
  }

  /**
   * Get hunters count
   */
  async getJaegerCount(): Promise<number> {
    try {
      return await this.jaegerRepository.count();
    } catch (error) {
      logger.error('Error in getJaegerCount service', error);
      throw new AppError('Failed to get hunter count', 500);
    }
  }
}
```

---

## File 5: `src/modules/jaeger/jaeger.controller.ts`
```typescript
// HTTP request/response handler

import { Request, Response, NextFunction } from 'express';
import { JaegerService } from './jaeger.service';
import { CreateJaegerInput, UpdateJaegerInput, createJaegerSchema, updateJaegerSchema } from './jaeger.validation';
import { ApiResponse, sendSuccess, sendError } from '../../utils/apiResponse';
import { ValidationError } from '../../utils/errorHandler';
import { logger } from '../../utils/logger';

export class JaegerController {
  constructor(private jaegerService: JaegerService) {}

  /**
   * GET /api/jaeger - Get all hunters
   */
  getAllJaeger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const jaeger = await this.jaegerService.getAllJaeger();
      sendSuccess(res, jaeger, 'Hunters retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/jaeger/:id - Get single hunter
   */
  getJaegerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const jaeger = await this.jaegerService.getJaegerById(parseInt(id, 10));
      sendSuccess(res, jaeger, 'Hunter retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/jaeger - Create new hunter
   */
  createJaeger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      const validatedData = createJaegerSchema.parse(req.body) as CreateJaegerInput;

      const jaeger = await this.jaegerService.createJaeger(validatedData);
      sendSuccess(res, jaeger, 'Hunter created successfully', 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.errors[0].message));
      } else {
        next(error);
      }
    }
  };

  /**
   * PUT /api/jaeger/:id - Update hunter
   */
  updateJaeger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateJaegerSchema.parse(req.body) as UpdateJaegerInput;

      const jaeger = await this.jaegerService.updateJaeger(parseInt(id, 10), validatedData);
      sendSuccess(res, jaeger, 'Hunter updated successfully');
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new ValidationError(error.errors[0].message));
      } else {
        next(error);
      }
    }
  };

  /**
   * DELETE /api/jaeger/:id - Deactivate hunter
   */
  deleteJaeger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const jaeger = await this.jaegerService.deactivateJaeger(parseInt(id, 10));
      sendSuccess(res, jaeger, 'Hunter deactivated successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/jaeger/search - Search hunters
   */
  searchJaeger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, plz } = req.query;
      const jaeger = await this.jaegerService.searchJaeger({
        name: name as string | undefined,
        email: email as string | undefined,
        plz: plz as string | undefined,
      });
      sendSuccess(res, jaeger, 'Search completed successfully');
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/jaeger/stats/count - Get hunters count
   */
  getJaegerCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const count = await this.jaegerService.getJaegerCount();
      sendSuccess(res, { count }, 'Count retrieved successfully');
    } catch (error) {
      next(error);
    }
  };
}
```

---

## File 6: `src/modules/jaeger/jaeger.routes.ts`
```typescript
// Route definitions

import { Router } from 'express';
import { JaegerController } from './jaeger.controller';
import { JaegerService } from './jaeger.service';
import { JaegerRepository } from './jaeger.repository';
import { db } from '../../database/client';

// Initialize dependencies
const jaegerRepository = new JaegerRepository(db);
const jaegerService = new JaegerService(jaegerRepository);
const jaegerController = new JaegerController(jaegerService);

// Create router
const router = Router();

/**
 * GET /api/jaeger - Retrieve all hunters
 * GET /api/jaeger/:id - Retrieve single hunter
 * GET /api/jaeger/search - Search hunters
 * GET /api/jaeger/stats/count - Get hunters count
 * 
 * POST /api/jaeger - Create new hunter
 * PUT /api/jaeger/:id - Update hunter
 * DELETE /api/jaeger/:id - Deactivate hunter
 */

router.get('/', jaegerController.getAllJaeger.bind(jaegerController));
router.get('/search', jaegerController.searchJaeger.bind(jaegerController));
router.get('/stats/count', jaegerController.getJaegerCount.bind(jaegerController));
router.get('/:id', jaegerController.getJaegerById.bind(jaegerController));

router.post('/', jaegerController.createJaeger.bind(jaegerController));
router.put('/:id', jaegerController.updateJaeger.bind(jaegerController));
router.delete('/:id', jaegerController.deleteJaeger.bind(jaegerController));

export default router;
```

---

## File 7: `src/modules/jaeger/jaeger.test.ts`
```typescript
// Unit and integration tests

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { JaegerService } from './jaeger.service';
import { JaegerRepository } from './jaeger.repository';
import { AppError } from '../../utils/errorHandler';

describe('JaegerService', () => {
  let jaegerService: JaegerService;
  let jaegerRepository: JaegerRepository;

  // Mock repository
  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    search: jest.fn(),
    count: jest.fn(),
  };

  beforeAll(() => {
    jaegerRepository = mockRepository as unknown as JaegerRepository;
    jaegerService = new JaegerService(jaegerRepository);
  });

  describe('getAllJaeger', () => {
    it('should return all hunters', async () => {
      const mockJaeger = [
        { jaeger_id: 1, vorname: 'Max', nachname: 'Müller' },
        { jaeger_id: 2, vorname: 'Hans', nachname: 'Schmidt' },
      ];

      mockRepository.findAll.mockResolvedValue(mockJaeger);

      const result = await jaegerService.getAllJaeger();
      expect(result).toEqual(mockJaeger);
      expect(mockRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getJaegerById', () => {
    it('should return a hunter by ID', async () => {
      const mockJaeger = { jaeger_id: 1, vorname: 'Max', nachname: 'Müller' };
      mockRepository.findById.mockResolvedValue(mockJaeger);

      const result = await jaegerService.getJaegerById(1);
      expect(result).toEqual(mockJaeger);
    });

    it('should throw error if hunter not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(jaegerService.getJaegerById(999)).rejects.toThrow(AppError);
    });
  });

  describe('createJaeger', () => {
    it('should create a new hunter', async () => {
      const newJaeger = { vorname: 'Max', nachname: 'Müller' };
      const createdJaeger = { jaeger_id: 1, ...newJaeger };

      mockRepository.findByEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdJaeger);

      const result = await jaegerService.createJaeger(newJaeger as any);
      expect(result).toEqual(createdJaeger);
    });

    it('should throw error if email exists', async () => {
      const newJaeger = { vorname: 'Max', nachname: 'Müller', email: 'max@example.de' };
      mockRepository.findByEmail.mockResolvedValue({ jaeger_id: 2 });

      await expect(jaegerService.createJaeger(newJaeger as any)).rejects.toThrow();
    });
  });
});
```

---

## Integration in Main Router

File: `src/routes/api.routes.ts`

```typescript
// Main API routes aggregator

import { Router } from 'express';
import jaegerRoutes from '../modules/jaeger/jaeger.routes';
import hegeringeRoutes from '../modules/hegeringe/hegeringe.routes';
import revierRoutes from '../modules/reviere/reviere.routes';
import paechterRoutes from '../modules/paechter/paechter.routes';
import mitjaegerRoutes from '../modules/mitjaeger/mitjaeger.routes';

const router = Router();

// Mount all module routes
router.use('/jaeger', jaegerRoutes);
router.use('/hegeringe', hegeringeRoutes);
router.use('/reviere', revierRoutes);
router.use('/paechter', paechterRoutes);
router.use('/mitjaeger', mitjaegerRoutes);

export default router;
```

---

## Key Benefits of This Pattern

1. **Separation of Concerns** - Each layer has single responsibility
2. **Testability** - Easy to mock dependencies and test in isolation
3. **Reusability** - Service and repository can be reused by other controllers
4. **Consistency** - All modules follow same pattern
5. **Scalability** - Easy to add new modules following the pattern
6. **Maintainability** - Clear structure, easy to find and modify code
7. **Type Safety** - Full TypeScript support throughout

---

## Adding a New Module

To add a new module (e.g., `Waidwerkzeug`):

1. Create folder: `src/modules/waidwerkzeug/`
2. Create `waidwerkzeug.validation.ts`
3. Create `waidwerkzeug.repository.ts`
4. Create `waidwerkzeug.service.ts`
5. Create `waidwerkzeug.controller.ts`
6. Create `waidwerkzeug.routes.ts`
7. Create `waidwerkzeug.test.ts`
8. Add interface to `src/types/models.ts`
9. Import and mount routes in `src/routes/api.routes.ts`

That's it! The new module is immediately available with full CRUD operations.
