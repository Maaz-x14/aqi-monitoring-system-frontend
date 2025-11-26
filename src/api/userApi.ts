import api from './axios';
import { User } from '../types/user';

export const fetchCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');
  return response.data;
};

export const updateUserCity = async (city: string): Promise<User> => {
  const response = await api.put<User>('/users/me/city', { city });
  return response.data;
};