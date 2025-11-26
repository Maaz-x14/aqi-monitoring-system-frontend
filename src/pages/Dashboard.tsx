import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/api/userApi';
import { fetchCurrentAqi, fetchRecommendation, fetchForecast } from '@/api/aqiApi';
import Navbar from '@/components/layout/Navbar';
import { getAqiColor, getAqiTextColor } from '@/utils/aqiColors';
import { Activity, Wind, Thermometer, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = useQuery({ queryKey: ['user'], queryFn: fetchCurrentUser });

  const city = user?.city;

  // Force redirect if no city set
  useEffect(() => {
    if (!userLoading && user && !user.city) {
      navigate('/settings');
    }
  }, [user, userLoading, navigate]);

  const { data: aqi, isLoading: aqiLoading } = useQuery({
    queryKey: ['aqi', city],
    queryFn: () => fetchCurrentAqi(city!),
    enabled: !!city,
    refetchInterval: 900000, // 15 mins
  });

  const { data: recommendation } = useQuery({
    queryKey: ['recommendation', city],
    queryFn: () => fetchRecommendation(city!),
    enabled: !!city,
  });

  const { data: forecast } = useQuery({
    queryKey: ['forecast', city],
    queryFn: () => fetchForecast(city!),
    enabled: !!city,
  });

  if (userLoading || (city && aqiLoading)) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!city) return null; // Handled by useEffect redirect

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* Current AQI Hero */}
        <div className="px-4 py-6 sm:px-0">
           <div className={`rounded-2xl shadow-lg overflow-hidden ${aqi ? getAqiColor(aqi.aqiValue) : 'bg-gray-200'} text-white transition-colors duration-500`}>
              <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold opacity-90">Current Air Quality in {city}</h2>
                <div className="mt-4 text-9xl font-bold tracking-tighter">
                    {aqi?.aqiValue.toFixed(0)}
                </div>
                <p className="mt-2 text-xl font-medium opacity-90">{aqi?.healthAdvice}</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-0 mb-6">
            {/* Recommendation Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg col-span-1 md:col-span-2">
                <div className="p-5">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Activity className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">Activity Guide</dt>
                                <dd className="text-lg font-medium text-gray-900">
                                    {recommendation?.message || "Analyzing forecast..."}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
             <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Pollutant Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-500">PM2.5</span>
                            <span className="font-bold">{aqi?.pm25.toFixed(1)} <span className="text-xs text-gray-400">µg/m³</span></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">PM10</span>
                            <span className="font-bold">{aqi?.pm10.toFixed(1)} <span className="text-xs text-gray-400">µg/m³</span></span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ozone</span>
                            <span className="font-bold">{aqi?.o3?.toFixed(1) || 'N/A'} <span className="text-xs text-gray-400">µg/m³</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Forecast Chart */}
        <div className="px-4 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">48-Hour Forecast</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecast}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={(time) => new Date(time).getHours() + ':00'} 
                                minTickGap={30}
                            />
                            <YAxis />
                            <Tooltip 
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="aqiValue" 
                                stroke="#2563eb" 
                                strokeWidth={2}
                                dot={false}
                                name="AQI"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}