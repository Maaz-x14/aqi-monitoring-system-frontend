import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/api/userApi';
import { fetchHistory } from '@/api/aqiApi';
import Navbar from '@/components/layout/Navbar';
import { getAqiColor } from '@/utils/aqiColors';
import { Calendar, TrendingUp } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function History() {
  const navigate = useNavigate();
  
  // 1. Get User to find their city
  const { data: user, isLoading: userLoading } = useQuery({ 
    queryKey: ['user'], 
    queryFn: fetchCurrentUser 
  });

  const city = user?.city;

  // Redirect if no city
  useEffect(() => {
    if (!userLoading && user && !city) {
      navigate('/settings');
    }
  }, [user, userLoading, city, navigate]);

  // 2. Fetch History Data
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['history', city],
    queryFn: () => fetchHistory(city!),
    enabled: !!city,
  });

  if (userLoading || (city && historyLoading)) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading historical data...</div>;
  }

  if (!city) return null;

  // Sort history by timestamp just in case the API sends it unordered
  const sortedHistory = history ? [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Pollution History</h1>
                <p className="text-gray-500">Historical air quality trends for {city}</p>
            </div>
        </div>

        {/* --- NEW CHART SECTION --- */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-medium text-gray-900">AQI Trend Over Time</h3>
            </div>
            
            <div className="h-[350px] w-full">
                {sortedHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sortedHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/> {/* Red-ish hue */}
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' })}
                                minTickGap={50}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                                formatter={(value: number) => [value.toFixed(0), 'AQI']}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="aqiValue" 
                                stroke="#ef4444" 
                                fillOpacity={1} 
                                fill="url(#colorAqi)" 
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        Not enough data points to display chart yet.
                    </div>
                )}
            </div>
        </div>
        {/* ------------------------- */}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AQI (US)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM2.5</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PM10</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NO₂</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ozone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedHistory.slice().reverse().map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAqiColor(record.aqiValue)} bg-opacity-20`}>
                        {record.aqiValue.toFixed(0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.pm25?.toFixed(1) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.pm10?.toFixed(1) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.no2?.toFixed(1) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.o3?.toFixed(1) || '-'}
                    </td>
                  </tr>
                ))}
                {!history?.length && (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                            No history available yet. Wait for the next polling cycle!
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}