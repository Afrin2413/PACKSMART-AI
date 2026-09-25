import axios from 'axios';
import {
  User, Commodity, PackagingMaterial, AnalysisDetail, AnalysisListItem,
  DashboardSummary, SimulationResult
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Attach JWT token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('packsmart_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Authentication
  auth: {
    login: async (credentials: any) => {
      const res = await apiClient.post('/auth/login', credentials);
      return res.data;
    },
    register: async (userData: any) => {
      const res = await apiClient.post('/auth/register', userData);
      return res.data;
    },
    getProfile: async (): Promise<User> => {
      const res = await apiClient.get('/auth/me');
      return res.data;
    }
  },

  // Commodities
  commodities: {
    getAll: async (category?: string, search?: string): Promise<Commodity[]> => {
      const res = await apiClient.get('/commodities', { params: { category, search } });
      return res.data;
    },
    getById: async (id: number): Promise<Commodity> => {
      const res = await apiClient.get(`/commodities/${id}`);
      return res.data;
    },
    create: async (data: Partial<Commodity>): Promise<Commodity> => {
      const res = await apiClient.post('/commodities', data);
      return res.data;
    },
    update: async (id: number, data: Partial<Commodity>): Promise<Commodity> => {
      const res = await apiClient.put(`/commodities/${id}`, data);
      return res.data;
    },
    delete: async (id: number) => {
      const res = await apiClient.delete(`/commodities/${id}`);
      return res.data;
    }
  },

  // Packaging Materials
  materials: {
    getAll: async (category?: string, search?: string): Promise<PackagingMaterial[]> => {
      const res = await apiClient.get('/materials', { params: { category, search } });
      return res.data;
    },
    getById: async (id: number): Promise<PackagingMaterial> => {
      const res = await apiClient.get(`/materials/${id}`);
      return res.data;
    },
    create: async (data: Partial<PackagingMaterial>): Promise<PackagingMaterial> => {
      const res = await apiClient.post('/materials', data);
      return res.data;
    },
    update: async (id: number, data: Partial<PackagingMaterial>): Promise<PackagingMaterial> => {
      const res = await apiClient.put(`/materials/${id}`, data);
      return res.data;
    },
    delete: async (id: number) => {
      const res = await apiClient.delete(`/materials/${id}`);
      return res.data;
    }
  },

  // Analyses & Recommendation Engine
  analyses: {
    create: async (data: any): Promise<AnalysisDetail> => {
      const res = await apiClient.post('/analyses', data);
      return res.data;
    },
    getAll: async (commodity?: string): Promise<AnalysisListItem[]> => {
      const res = await apiClient.get('/analyses', { params: { commodity } });
      return res.data;
    },
    getById: async (id: number): Promise<AnalysisDetail> => {
      const res = await apiClient.get(`/analyses/${id}`);
      return res.data;
    },
    delete: async (id: number) => {
      const res = await apiClient.delete(`/analyses/${id}`);
      return res.data;
    },
    getReportPdfUrl: (id: number): string => {
      return `${API_BASE_URL}/report/${id}`;
    },
    downloadReportPdf: async (id: number, commodityName: string) => {
      const res = await apiClient.get(`/report/${id}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PackSmart_Report_${commodityName.replace(/\s+/g, '_')}_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  },

  // Compare
  compare: {
    runComparison: async (material_ids: number[]) => {
      const res = await apiClient.post('/compare', { material_ids });
      return res.data;
    }
  },

  // Cost Calculator
  cost: {
    calculate: async (payload: any) => {
      const res = await apiClient.post('/cost-estimate', payload);
      return res.data;
    }
  },

  // Shelf-Life Simulation
  simulation: {
    run: async (payload: any): Promise<SimulationResult> => {
      const res = await apiClient.post('/shelf-life-simulation', payload);
      return res.data;
    }
  },

  // Dashboard
  dashboard: {
    getSummary: async (): Promise<DashboardSummary> => {
      const res = await apiClient.get('/dashboard');
      return res.data;
    }
  }
};

export default api;
