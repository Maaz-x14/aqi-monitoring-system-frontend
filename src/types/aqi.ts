export interface AqiData {
    id?: number;
    city: string;
    aqiValue: number;
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    so2: number;
    o3: number;
    timestamp: string;
    isForecast: boolean;
    healthAdvice: string;
}