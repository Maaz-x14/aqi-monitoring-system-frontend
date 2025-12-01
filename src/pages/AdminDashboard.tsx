import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard } from '@/api/adminApi';
import Navbar from '@/components/layout/Navbar';
import { getAqiColor, getAqiTextColor } from '@/utils/aqiColors';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Wind, Activity } from 'lucide-react';

export default function AdminDashboard() {
  // --- FIX: REACT QUERY V5 OBJECT SYNTAX ---
  const { data: cities, isLoading, isError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
    refetchInterval: 60000, // Auto-refresh every minute
  });
  // -----------------------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-lg text-gray-500 animate-pulse">Loading global monitoring data...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="p-8 text-center text-red-600">
          Failed to load admin dashboard. Please check backend connection.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">National Monitor</h1>
            <p className="text-sm text-gray-500">Real-time tracking of {cities?.length || 0} major cities</p>
          </div>
          <div className="text-xs text-gray-400">
             Auto-refreshing (1m)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {cities?.map((cityData) => (
            <div 
              key={cityData.city} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{cityData.city}</h3>
                  <p className={`text-sm font-medium mt-1 ${getAqiTextColor(cityData.current.aqiValue)}`}>
                    {cityData.current.healthAdvice.split('.')[0]}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-white text-sm font-bold ${getAqiColor(cityData.current.aqiValue)}`}>
                  {cityData.current.aqiValue.toFixed(0)}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="p-5 grid grid-cols-3 gap-4 bg-gray-50/50">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">PM2.5</p>
                  <p className="font-semibold text-gray-700">{cityData.current.pm25.toFixed(1)}</p>
                </div>
                <div className="text-center border-l border-gray-200">
                  <p className="text-xs text-gray-500 uppercase">PM10</p>
                  <p className="font-semibold text-gray-700">{cityData.current.pm10.toFixed(1)}</p>
                </div>
                <div className="text-center border-l border-gray-200">
                  <p className="text-xs text-gray-500 uppercase">Ozone</p>
                  <p className="font-semibold text-gray-700">{cityData.current.o3.toFixed(1)}</p>
                </div>
              </div>

              {/* Recommendation & Chart */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="mb-4">
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {cityData?.recommendation?.message}
                    </p>
                  </div>
                </div>
                
                {/* Mini Forecast Sparkline */}
                <div className="h-16 w-full mt-auto">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={cityData.forecast}>
                        <defs>
                          <linearGradient id={`grad-${cityData.city}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="aqiValue" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          fill={`url(#grad-${cityData.city})`} 
                        />
                      </AreaChart>
                   </ResponsiveContainer>
                   <p className="text-[10px] text-center text-gray-400 mt-1">48h Forecast Trend</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}