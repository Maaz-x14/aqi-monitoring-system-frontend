import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/api/userApi';
import { fetchHistory } from '@/api/aqiApi';
import Navbar from '@/components/layout/Navbar';
import { getAqiColor } from '@/utils/aqiColors';
import { 
  Calendar, 
  TrendingUp, 
  History as HistoryIcon, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Loader2,
  Clock
} from 'lucide-react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Get User
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

  // 3. Process Data
  const sortedHistory = useMemo(() => {
    if (!history) return [];
    // Sort ascending for Chart
    return [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [history]);

  // Table data needs to be reverse chronological (newest first)
  const reversedHistory = useMemo(() => {
     return [...sortedHistory].reverse();
  }, [sortedHistory]);

  // 4. Pagination Logic
  const totalPages = Math.ceil(reversedHistory.length / itemsPerPage);
  const paginatedData = reversedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  if (userLoading || (city && historyLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-blue-600 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium text-gray-600">Loading historical archives...</p>
        </div>
      </div>
    );
  }

  if (!city) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-sans text-slate-900">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-blue-100">
                <HistoryIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Pollution History</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Historical air quality trends for <span className="font-semibold text-blue-600">{city}</span>
                </p>
            </div>
        </div>

        {/* --- CHART SECTION --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-indigo-50 p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">AQI Trend Over Time</h3>
                </div>
                {/* Optional Time Filter Badge */}
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wide">
                    Last 30 Days
                </span>
            </div>
            
            <div className="h-[400px] w-full">
                {sortedHistory.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sortedHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={(time) => new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                minTickGap={50}
                                stroke="#94a3b8"
                                style={{ fontSize: '12px', fontWeight: 500 }}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                style={{ fontSize: '12px', fontWeight: 500 }} 
                                tickLine={false}
                                axisLine={false}
                                dx={-10}
                            />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                    padding: '12px'
                                }}
                                labelFormatter={(label) => new Date(label).toLocaleString()}
                                formatter={(value: number) => [
                                    <span className="font-bold text-blue-600">{value.toFixed(0)}</span>, 
                                    <span className="text-gray-500">AQI</span>
                                ]}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="aqiValue" 
                                stroke="#2563eb" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorAqi)" 
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#1d4ed8' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p>Collecting data points...</p>
                    </div>
                )}
            </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-indigo-50 overflow-hidden flex flex-col">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                 <Filter className="w-5 h-5 text-gray-400" />
                 Detailed Records
             </h3>
             <span className="text-sm text-gray-500">
                Total Records: <span className="font-semibold text-gray-900">{reversedHistory.length}</span>
             </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/80">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Timestamp
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">AQI Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PM 2.5</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">PM 10</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">NO₂</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ozone</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedData.map((record, index) => (
                  <tr key={index} className="hover:bg-blue-50/50 transition-colors duration-200 group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                      {new Date(record.timestamp).toLocaleString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric', 
                          hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* Status Pill */}
                      <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs font-bold rounded-full text-white shadow-sm ${getAqiColor(record.aqiValue)}`}>
                        {record.aqiValue.toFixed(0)} US AQI
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.pm25?.toFixed(1) || '-'} <span className="text-xs text-gray-400">µg/m³</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.pm10?.toFixed(1) || '-'} <span className="text-xs text-gray-400">µg/m³</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.no2?.toFixed(1) || '-'} <span className="text-xs text-gray-400">µg/m³</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.o3?.toFixed(1) || '-'} <span className="text-xs text-gray-400">µg/m³</span>
                    </td>
                  </tr>
                ))}
                
                {reversedHistory.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No records found for this location yet.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
             <div className="text-sm text-gray-500">
                 Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, reversedHistory.length)}</span> of <span className="font-semibold text-gray-900">{reversedHistory.length}</span> results
             </div>
             
             <div className="flex items-center gap-2">
                 <button 
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                 >
                     <ChevronLeft className="w-5 h-5" />
                 </button>
                 <span className="text-sm font-medium text-gray-700 px-2">
                     Page {currentPage} of {totalPages || 1}
                 </span>
                 <button 
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                 >
                     <ChevronRight className="w-5 h-5" />
                 </button>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
}