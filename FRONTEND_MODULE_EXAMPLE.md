# Frontend Module Example
## Complete Implementation Pattern for "Jaeger" Feature

This example shows how to implement a complete frontend feature following the modular architecture.

---

## File 1: `src/services/jaeger.service.ts`
```typescript
// API service layer - handles all HTTP communication with backend

import { api } from './api';
import { Jaeger, CreateJaegerRequest, UpdateJaegerRequest } from '../types/models';

export const jaegerService = {
  /**
   * Get all hunters
   */
  getAll: async (): Promise<Jaeger[]> => {
    const response = await api.get('/jaeger');
    return response.data.data;
  },

  /**
   * Get single hunter by ID
   */
  getById: async (id: number): Promise<Jaeger> => {
    const response = await api.get(`/jaeger/${id}`);
    return response.data.data;
  },

  /**
   * Create new hunter
   */
  create: async (data: CreateJaegerRequest): Promise<Jaeger> => {
    const response = await api.post('/jaeger', data);
    return response.data.data;
  },

  /**
   * Update existing hunter
   */
  update: async (id: number, data: UpdateJaegerRequest): Promise<Jaeger> => {
    const response = await api.put(`/jaeger/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete (deactivate) hunter
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/jaeger/${id}`);
  },

  /**
   * Search hunters
   */
  search: async (criteria: {
    name?: string;
    email?: string;
    plz?: string;
  }): Promise<Jaeger[]> => {
    const response = await api.get('/jaeger/search', { params: criteria });
    return response.data.data;
  },

  /**
   * Get hunters count
   */
  getCount: async (): Promise<number> => {
    const response = await api.get('/jaeger/stats/count');
    return response.data.data.count;
  },
};
```

---

## File 2: `src/store/slices/jaeger.slice.ts`
```typescript
// State management with Zustand

import { create } from 'zustand';
import { Jaeger, CreateJaegerRequest, UpdateJaegerRequest } from '../../types/models';
import { jaegerService } from '../../services/jaeger.service';

export interface JaegerState {
  // State
  jaeger: Jaeger[];
  selectedJaeger: Jaeger | null;
  loading: boolean;
  error: string | null;
  filter: {
    searchText: string;
    sortBy: 'name' | 'createdAt';
    sortOrder: 'asc' | 'desc';
  };

  // Actions
  fetchAllJaeger: () => Promise<void>;
  fetchJaegerById: (id: number) => Promise<void>;
  createJaeger: (data: CreateJaegerRequest) => Promise<void>;
  updateJaeger: (id: number, data: UpdateJaegerRequest) => Promise<void>;
  deleteJaeger: (id: number) => Promise<void>;
  searchJaeger: (criteria: any) => Promise<void>;
  setSelectedJaeger: (jaeger: Jaeger | null) => void;
  setFilter: (filter: Partial<JaegerState['filter']>) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  jaeger: [],
  selectedJaeger: null,
  loading: false,
  error: null,
  filter: {
    searchText: '',
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
  },
};

export const useJaegerStore = create<JaegerState>((set, get) => ({
  ...initialState,

  fetchAllJaeger: async () => {
    set({ loading: true, error: null });
    try {
      const data = await jaegerService.getAll();
      set({ jaeger: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch hunters',
        loading: false,
      });
    }
  },

  fetchJaegerById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await jaegerService.getById(id);
      set({ selectedJaeger: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch hunter',
        loading: false,
      });
    }
  },

  createJaeger: async (data: CreateJaegerRequest) => {
    set({ loading: true, error: null });
    try {
      const newJaeger = await jaegerService.create(data);
      set((state) => ({
        jaeger: [...state.jaeger, newJaeger],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create hunter',
        loading: false,
      });
      throw error;
    }
  },

  updateJaeger: async (id: number, data: UpdateJaegerRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await jaegerService.update(id, data);
      set((state) => ({
        jaeger: state.jaeger.map((j) => (j.jaeger_id === id ? updated : j)),
        selectedJaeger: state.selectedJaeger?.jaeger_id === id ? updated : state.selectedJaeger,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update hunter',
        loading: false,
      });
      throw error;
    }
  },

  deleteJaeger: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await jaegerService.delete(id);
      set((state) => ({
        jaeger: state.jaeger.filter((j) => j.jaeger_id !== id),
        selectedJaeger: state.selectedJaeger?.jaeger_id === id ? null : state.selectedJaeger,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete hunter',
        loading: false,
      });
      throw error;
    }
  },

  searchJaeger: async (criteria: any) => {
    set({ loading: true, error: null });
    try {
      const data = await jaegerService.search(criteria);
      set({ jaeger: data, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search hunters',
        loading: false,
      });
    }
  },

  setSelectedJaeger: (jaeger: Jaeger | null) => {
    set({ selectedJaeger: jaeger });
  },

  setFilter: (filter: Partial<JaegerState['filter']>) => {
    set((state) => ({
      filter: { ...state.filter, ...filter },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
```

---

## File 3: `src/hooks/useJaeger.ts`
```typescript
// Custom hook for easy state access

import { useCallback } from 'react';
import { useJaegerStore } from '../store/slices/jaeger.slice';
import { Jaeger, CreateJaegerRequest, UpdateJaegerRequest } from '../types/models';

export const useJaeger = () => {
  const store = useJaegerStore();

  const handleFetchAll = useCallback(() => {
    store.fetchAllJaeger();
  }, [store]);

  const handleFetchById = useCallback((id: number) => {
    store.fetchJaegerById(id);
  }, [store]);

  const handleCreate = useCallback(
    async (data: CreateJaegerRequest) => {
      await store.createJaeger(data);
    },
    [store]
  );

  const handleUpdate = useCallback(
    async (id: number, data: UpdateJaegerRequest) => {
      await store.updateJaeger(id, data);
    },
    [store]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      await store.deleteJaeger(id);
    },
    [store]
  );

  const handleSearch = useCallback(
    async (criteria: any) => {
      await store.searchJaeger(criteria);
    },
    [store]
  );

  return {
    // State
    jaeger: store.jaeger,
    selectedJaeger: store.selectedJaeger,
    loading: store.loading,
    error: store.error,
    filter: store.filter,

    // Actions
    fetchAll: handleFetchAll,
    fetchById: handleFetchById,
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
    search: handleSearch,
    setSelected: store.setSelectedJaeger,
    setFilter: store.setFilter,
    clearError: store.clearError,
    reset: store.reset,
  };
};
```

---

## File 4: `src/components/features/jaeger/JaegerList.tsx`
```typescript
// Main list component

import React, { useEffect, useState } from 'react';
import { useJaeger } from '../../../hooks/useJaeger';
import { useToast } from '../../../hooks/useToast';
import Table from '../../common/Table/Table';
import Button from '../../common/Button/Button';
import Loading from '../../common/Loading/Spinner';
import Modal from '../../common/Modal/Modal';
import JaegerForm from './JaegerForm';
import styles from './jaeger.module.css';

const JaegerList: React.FC = () => {
  const jaeger = useJaeger();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Load hunters on component mount
  useEffect(() => {
    jaeger.fetchAll();
  }, []);

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      await jaeger.search({ name: searchText });
      toast.success('Search completed');
    }
  };

  // Reset search
  const handleReset = () => {
    setSearchText('');
    jaeger.fetchAll();
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this hunter?')) {
      try {
        await jaeger.delete(id);
        toast.success('Hunter deleted successfully');
      } catch (error) {
        toast.error('Failed to delete hunter');
      }
    }
  };

  // Handle form submit
  const handleFormSubmit = async (data: any) => {
    try {
      await jaeger.create(data);
      toast.success('Hunter created successfully');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to create hunter');
    }
  };

  // Table columns
  const columns = [
    { key: 'vorname', label: 'First Name' },
    { key: 'nachname', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'telefon', label: 'Phone' },
    { key: 'jagdschein_nummer', label: 'License #' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => jaeger.setSelected(row)}
          >
            View
          </Button>
          <Button
            variant="danger"
            size="small"
            onClick={() => handleDelete(row.jaeger_id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (jaeger.loading) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Hunters Management</h1>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Hunter
        </Button>
      </div>

      {jaeger.error && (
        <div className={styles.error}>
          {jaeger.error}
          <Button
            variant="secondary"
            size="small"
            onClick={jaeger.clearError}
          >
            Dismiss
          </Button>
        </div>
      )}

      <div className={styles.search}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="secondary" type="submit">
            Search
          </Button>
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </form>
      </div>

      <Table columns={columns} data={jaeger.jaeger} />

      <Modal
        title="Add New Hunter"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <JaegerForm
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default JaegerList;
```

---

## File 5: `src/components/features/jaeger/JaegerForm.tsx`
```typescript
// Form component for creating/editing hunters

import React, { useState } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useToast } from '../../../hooks/useToast';
import Button from '../../common/Button/Button';
import FormField from '../../common/Form/FormField';
import { validateEmail, validateDate } from '../../../utils/validators';
import styles from './jaeger.module.css';

interface JaegerFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const JaegerForm: React.FC<JaegerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const form = useForm({
    initialValues: {
      vorname: initialData?.vorname || '',
      nachname: initialData?.nachname || '',
      email: initialData?.email || '',
      telefon: initialData?.telefon || '',
      adresse: initialData?.adresse || '',
      plz: initialData?.plz || '',
      ort: initialData?.ort || '',
      geburtsdatum: initialData?.geburtsdatum || '',
      jagdschein_nummer: initialData?.jagdschein_nummer || '',
      jagdschein_gueltig_bis: initialData?.jagdschein_gueltig_bis || '',
      haftpflichtversicherung_nummer: initialData?.haftpflichtversicherung_nummer || '',
      versicherung_gueltig_bis: initialData?.versicherung_gueltig_bis || '',
      bemerkungen: initialData?.bemerkungen || '',
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.vorname?.trim()) errors.vorname = 'First name is required';
      if (!values.nachname?.trim()) errors.nachname = 'Last name is required';
      if (values.email && !validateEmail(values.email)) errors.email = 'Invalid email format';
      if (values.jagdschein_gueltig_bis && !validateDate(values.jagdschein_gueltig_bis)) {
        errors.jagdschein_gueltig_bis = 'Invalid date format';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className={styles.form}>
      <div className={styles.row}>
        <FormField
          label="First Name"
          required
          error={form.errors.vorname}
          fullWidth
        >
          <input
            type="text"
            name="vorname"
            value={form.values.vorname}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>

        <FormField
          label="Last Name"
          required
          error={form.errors.nachname}
          fullWidth
        >
          <input
            type="text"
            name="nachname"
            value={form.values.nachname}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Email" error={form.errors.email} fullWidth>
          <input
            type="email"
            name="email"
            value={form.values.email}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Phone" fullWidth>
          <input
            type="tel"
            name="telefon"
            value={form.values.telefon}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Address" fullWidth>
          <input
            type="text"
            name="adresse"
            value={form.values.adresse}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="ZIP Code" fullWidth>
          <input
            type="text"
            name="plz"
            value={form.values.plz}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="City" fullWidth>
          <input
            type="text"
            name="ort"
            value={form.values.ort}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Date of Birth" fullWidth>
          <input
            type="date"
            name="geburtsdatum"
            value={form.values.geburtsdatum}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Hunting License #" fullWidth>
          <input
            type="text"
            name="jagdschein_nummer"
            value={form.values.jagdschein_nummer}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="License Valid Until" error={form.errors.jagdschein_gueltig_bis} fullWidth>
          <input
            type="date"
            name="jagdschein_gueltig_bis"
            value={form.values.jagdschein_gueltig_bis}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <div className={styles.row}>
        <FormField label="Liability Insurance #" fullWidth>
          <input
            type="text"
            name="haftpflichtversicherung_nummer"
            value={form.values.haftpflichtversicherung_nummer}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>

        <FormField label="Insurance Valid Until" fullWidth>
          <input
            type="date"
            name="versicherung_gueltig_bis"
            value={form.values.versicherung_gueltig_bis}
            onChange={form.handleChange}
            disabled={isLoading}
          />
        </FormField>
      </div>

      <FormField label="Notes" fullWidth>
        <textarea
          name="bemerkungen"
          value={form.values.bemerkungen}
          onChange={form.handleChange}
          rows={4}
          disabled={isLoading}
        />
      </FormField>

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="primary"
          disabled={!form.isValid || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default JaegerForm;
```

---

## File 6: `src/components/features/jaeger/JaegerDetail.tsx`
```typescript
// Detail view component

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useJaeger } from '../../../hooks/useJaeger';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import Loading from '../../common/Loading/Spinner';
import styles from './jaeger.module.css';

const JaegerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const jaeger = useJaeger();

  useEffect(() => {
    if (id) {
      jaeger.fetchById(parseInt(id, 10));
    }
  }, [id]);

  if (jaeger.loading) return <Loading />;
  if (!jaeger.selectedJaeger) return <div>Hunter not found</div>;

  const j = jaeger.selectedJaeger;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.header}>
        <h1>
          {j.vorname} {j.nachname}
        </h1>
        <Button variant="secondary">Edit</Button>
      </div>

      <div className={styles.grid}>
        <Card title="Personal Information">
          <p><strong>Email:</strong> {j.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {j.telefon || 'N/A'}</p>
          <p><strong>Address:</strong> {j.adresse || 'N/A'}</p>
          <p><strong>City:</strong> {j.ort || 'N/A'}</p>
          <p><strong>ZIP:</strong> {j.plz || 'N/A'}</p>
          <p><strong>Date of Birth:</strong> {j.geburtsdatum || 'N/A'}</p>
        </Card>

        <Card title="Hunting License">
          <p><strong>License #:</strong> {j.jagdschein_nummer || 'N/A'}</p>
          <p><strong>Valid Until:</strong> {j.jagdschein_gueltig_bis || 'N/A'}</p>
        </Card>

        <Card title="Insurance">
          <p><strong>Policy #:</strong> {j.haftpflichtversicherung_nummer || 'N/A'}</p>
          <p><strong>Valid Until:</strong> {j.versicherung_gueltig_bis || 'N/A'}</p>
        </Card>

        {j.bemerkungen && (
          <Card title="Notes">
            <p>{j.bemerkungen}</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JaegerDetail;
```

---

## File 7: `src/components/features/jaeger/jaeger.module.css`
```css
/* Scoped styles for Jaeger feature components */

.container {
  padding: 2rem;
  background: var(--color-background);
  border-radius: 8px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.search {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 8px;
}

.search form {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.search input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
}

.error {
  padding: 1rem;
  background: var(--color-error-light);
  border-left: 4px solid var(--color-error);
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-error);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.row:last-child {
  grid-template-columns: 1fr;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.detailContainer {
  padding: 2rem;
}

.detailContainer .header {
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .search form {
    flex-direction: column;
  }

  .search input {
    width: 100%;
  }
}
```

---

## File 8: `src/pages/JaegerPage.tsx`
```typescript
// Page component

import React from 'react';
import Layout from '../components/layout/Layout';
import JaegerList from '../components/features/jaeger/JaegerList';

const JaegerPage: React.FC = () => {
  return (
    <Layout>
      <JaegerList />
    </Layout>
  );
};

export default JaegerPage;
```

---

## File 9: `src/Router.tsx`
```typescript
// Route configuration

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import JaegerPage from './pages/JaegerPage';
import HegeringePage from './pages/HegeringePage';
import RevierePage from './pages/RevierePage';
import PaechterPage from './pages/PaechterPage';
import MitjaegerPage from './pages/MitjaegerPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jaeger" element={<JaegerPage />} />
        <Route path="/jaeger/:id" element={<JaegerPage />} />
        <Route path="/hegeringe" element={<HegeringePage />} />
        <Route path="/reviere" element={<RevierePage />} />
        <Route path="/paechter" element={<PaechterPage />} />
        <Route path="/mitjaeger" element={<MitjaegerPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
```

---

## Key Benefits of This Pattern

1. **Separation of Concerns** - Services, store, and components are separate
2. **Reusability** - Services and hooks can be used in multiple components
3. **State Management** - Zustand provides global state with minimal boilerplate
4. **Type Safety** - Full TypeScript throughout
5. **Scalability** - Easy to add new features by following the pattern
6. **Testability** - Services and stores can be easily mocked and tested
7. **Performance** - Zustand's granular subscriptions prevent unnecessary re-renders

---

## Adding a New Feature

To add a new feature (e.g., `Waidwerkzeug`):

1. Create service: `src/services/waidwerkzeug.service.ts`
2. Create store slice: `src/store/slices/waidwerkzeug.slice.ts`
3. Create custom hook: `src/hooks/useWaidwerkzeug.ts`
4. Create components in: `src/components/features/waidwerkzeug/`
5. Create page: `src/pages/WaidwerkzeugPage.tsx`
6. Add route in: `src/Router.tsx`
7. Update navigation if needed

That's it! The feature is immediately integrated into the application with full data management.
