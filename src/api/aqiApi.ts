import api from './axios';
import { AqiData } from '../types/aqi';
import { RunRecommendation } from '../types/recommendation';

export const fetchCurrentAqi = async (city: string): Promise<AqiData> => {
  const response = await api.get<AqiData>(`/aqi/${city}`);
  return response.data;
};

export const fetchForecast = async (city: string): Promise<AqiData[]> => {
  const response = await api.get<AqiData[]>(`/aqi/${city}/forecast`);
  return response.data;
};

export const fetchHistory = async (city: string): Promise<AqiData[]> => {
    const response = await api.get<AqiData[]>(`/aqi/${city}/history`);
    return response.data;
  };

export const fetchRecommendation = async (city: string): Promise<RunRecommendation> => {
  const response = await api.get<RunRecommendation>(`/aqi/${city}/recommendation`);
  return response.data;
};