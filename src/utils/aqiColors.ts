export const getAqiColor = (aqi: number): string => {
    if (aqi <= 50) return 'bg-green-500'; 
    if (aqi <= 100) return 'bg-yellow-500'; 
    if (aqi <= 150) return 'bg-orange-500'; 
    if (aqi <= 200) return 'bg-red-600'; 
    if (aqi <= 300) return 'bg-purple-600'; 
    return 'bg-rose-900'; 
};

export const getAqiTextColor = (aqi: number): string => {
    if (aqi <= 50) return 'text-green-600'; 
    if (aqi <= 100) return 'text-yellow-600'; 
    if (aqi <= 150) return 'text-orange-600'; 
    if (aqi <= 200) return 'text-red-600'; 
    if (aqi <= 300) return 'text-purple-600'; 
    return 'text-rose-900'; 
};