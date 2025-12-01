import api from './axios';
import { AdminCityData } from '../types/admin';

export const fetchAdminDashboard = async (): Promise<AdminCityData[]> => {
  const response = await api.get<AdminCityData[]>('/admin/dashboard');
  return response.data;
};