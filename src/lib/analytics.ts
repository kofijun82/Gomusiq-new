import { create } from 'zustand';
import { supabase } from './supabase';
import { logger } from './logger';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

interface AnalyticsState {
  revenueData: ChartData;
  playsData: ChartData;
  salesData: ChartData;
  isLoading: boolean;
  error: string | null;
  fetchRevenueData: (timeRange: string) => Promise<void>;
  fetchPlaysData: (timeRange: string) => Promise<void>;
  fetchSalesData: (timeRange: string) => Promise<void>;
  generateReport: (type: string, timeRange: string) => Promise<Blob>;
}

export const useAnalytics = create<AnalyticsState>((set) => ({
  revenueData: {
    labels: [],
    datasets: []
  },
  playsData: {
    labels: [],
    datasets: []
  },
  salesData: {
    labels: [],
    datasets: []
  },
  isLoading: false,
  error: null,

  fetchRevenueData: async (timeRange) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_revenue_data', {
        time_range: timeRange
      });

      if (error) throw error;

      const chartData: ChartData = {
        labels: data.map((d: any) => d.date),
        datasets: [{
          label: 'Revenue',
          data: data.map((d: any) => d.amount),
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)'
        }]
      };

      set({ revenueData: chartData });
      logger.info('Revenue data fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch revenue data', error as Error);
      set({ error: 'Failed to fetch revenue data' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchPlaysData: async (timeRange) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_plays_data', {
        time_range: timeRange
      });

      if (error) throw error;

      const chartData: ChartData = {
        labels: data.map((d: any) => d.date),
        datasets: [{
          label: 'Plays',
          data: data.map((d: any) => d.count),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)'
        }]
      };

      set({ playsData: chartData });
      logger.info('Plays data fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch plays data', error as Error);
      set({ error: 'Failed to fetch plays data' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSalesData: async (timeRange) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.rpc('get_sales_data', {
        time_range: timeRange
      });

      if (error) throw error;

      const chartData: ChartData = {
        labels: data.map((d: any) => d.date),
        datasets: [{
          label: 'Sales',
          data: data.map((d: any) => d.count),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      };

      set({ salesData: chartData });
      logger.info('Sales data fetched successfully');
    } catch (error) {
      logger.error('Failed to fetch sales data', error as Error);
      set({ error: 'Failed to fetch sales data' });
    } finally {
      set({ isLoading: false });
    }
  },

  generateReport: async (type, timeRange) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: { type, timeRange }
      });

      if (error) throw error;

      // Convert base64 to Blob
      const byteCharacters = atob(data.report);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: 'application/pdf' });
    } catch (error) {
      logger.error('Failed to generate report', error as Error);
      throw new Error('Failed to generate report');
    }
  }
}));