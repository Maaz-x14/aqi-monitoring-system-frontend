import { AqiData } from './aqi';

export interface AdminCityData {
    city: string;
    current: AqiData;
    recommendation: {
        city: string;
        bestTime: string;
        forecastedAqi: number;
        message: string;
    };
    forecast: AqiData[];
}