"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentUser } from "@/api/userApi"
import { fetchCurrentAqi, fetchRecommendation, fetchForecast } from "@/api/aqiApi"
import Navbar from "@/components/layout/Navbar"
import { getAqiColor } from "@/utils/aqiColors"
import { 
  Wind, 
  Droplets, 
  Eye, 
  Activity, 
  TrendingUp, 
  Github, 
  Linkedin, 
  Mail, 
  Heart,
  Loader2,
  Map as MapIcon
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapCard } from "@/components/map-card"
import Welcome from "@/components/Welcome"

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
  })

  const city = user?.city

  useEffect(() => {
    if (!userLoading && user && !user.city) {
      navigate("/settings")
    }
  }, [user, userLoading, navigate])

  const { data: aqi, isLoading: aqiLoading } = useQuery({
    queryKey: ["aqi", city],
    queryFn: () => fetchCurrentAqi(city!),
    enabled: !!city,
    refetchInterval: 900000,
  })

  const { data: recommendation } = useQuery({
    queryKey: ["recommendation", city],
    queryFn: () => fetchRecommendation(city!),
    enabled: !!city,
  })

  const { data: forecast } = useQuery({
    queryKey: ["forecast", city],
    queryFn: () => fetchForecast(city!),
    enabled: !!city,
  })

  if (userLoading || (city && aqiLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center text-blue-600 gap-4">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium text-gray-600">Syncing environmental data for {city || "you"}...</p>
        </div>
      </div>
    )
  }

  if (!city) return null

  const displayAqi = aqi?.aqiValue?.toFixed(0) ?? "--"
  // Ensure aqiColorClass provides a background color class (e.g., bg-green-500)
  const aqiColorClass = aqi?.aqiValue ? getAqiColor(aqi.aqiValue) : "bg-gray-400"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Welcome Section */}
      <Welcome />

      <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20">
        
        {/* Top Grid: Map & AQI Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* MAP CARD - Takes 2/3 width */}
          <div className="lg:col-span-2 h-[400px] bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-white/50 overflow-hidden relative group">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Live Map View</span>
            </div>
            <div className="w-full h-full transition-transform duration-700 group-hover:scale-105">
               <MapCard
                 city={city}
                 aqiValue={Number(displayAqi)}
                 aqiColor={aqiColorClass}
                 healthAdvice={aqi?.healthAdvice}
               />
            </div>
          </div>

          {/* CURRENT AQI CARD - Takes 1/3 width */}
          <div className={`lg:col-span-1 h-[400px] rounded-3xl shadow-xl shadow-blue-900/10 overflow-hidden relative flex flex-col ${aqiColorClass}`}>
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col h-full p-8 text-white">
               <div className="flex justify-between items-start">
                   <div>
                       <p className="text-sm font-bold opacity-80 uppercase tracking-widest">Current Status</p>
                       <h2 className="text-2xl font-bold mt-1">{city}</h2>
                   </div>
                   <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                       <Activity className="w-6 h-6 text-white" />
                   </div>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center py-6">
                   <div className="text-8xl font-black tracking-tighter drop-shadow-md">
                       {displayAqi}
                   </div>
                   <div className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full mt-4 border border-white/30">
                       <span className="text-sm font-bold uppercase tracking-wide">US AQI Index</span>
                   </div>
               </div>

               <div className="mt-auto bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                   <p className="text-sm font-medium leading-relaxed text-center opacity-95">
                       {aqi?.healthAdvice || "Data unavailable"}
                   </p>
               </div>
            </div>
          </div>
        </div>

        {/* Middle: Recommendation Banner */}
        <div className="mb-6 bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-indigo-50 p-6 flex items-start sm:items-center gap-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 transition-opacity group-hover:opacity-80"></div>
            
            <div className="hidden sm:flex shrink-0 p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-8 h-8" />
            </div>
            
            <div className="relative z-10">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">AI Health Insight</p>
                <p className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed">
                   {recommendation?.message || "Analyzing local atmosphere to generate health insights..."}
                </p>
            </div>
        </div>

        {/* Bottom Grid: Pollutants & Forecast */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pollutants Breakdown */}
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-indigo-50 p-8">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Wind className="w-5 h-5 text-gray-400" />
                    Pollutants
                </h3>
                
                <div className="space-y-6">
                    {/* PM 2.5 */}
                    <div className="group p-4 rounded-2xl bg-gray-50 hover:bg-amber-50 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500">
                                    <Wind className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-700">PM 2.5</span>
                             </div>
                             <span className="text-xs font-semibold text-gray-400">Fine Particles</span>
                        </div>
                        <div className="flex items-end gap-1 pl-11">
                            <span className="text-2xl font-bold text-gray-900">{aqi?.pm25?.toFixed(1) ?? "-"}</span>
                            <span className="text-sm text-gray-500 mb-1">µg/m³</span>
                        </div>
                    </div>

                    {/* PM 10 */}
                    <div className="group p-4 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-orange-500">
                                    <Droplets className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-700">PM 10</span>
                             </div>
                             <span className="text-xs font-semibold text-gray-400">Coarse Particles</span>
                        </div>
                        <div className="flex items-end gap-1 pl-11">
                            <span className="text-2xl font-bold text-gray-900">{aqi?.pm10?.toFixed(1) ?? "-"}</span>
                            <span className="text-sm text-gray-500 mb-1">µg/m³</span>
                        </div>
                    </div>

                    {/* Ozone */}
                    <div className="group p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-purple-500">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-gray-700">Ozone (O3)</span>
                             </div>
                             <span className="text-xs font-semibold text-gray-400">Gas</span>
                        </div>
                        <div className="flex items-end gap-1 pl-11">
                            <span className="text-2xl font-bold text-gray-900">{aqi?.o3?.toFixed(1) ?? "-"}</span>
                            <span className="text-sm text-gray-500 mb-1">µg/m³</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forecast Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-indigo-50 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        48-Hour Forecast
                    </h3>
                    <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wide">
                        Predictive Analysis
                    </div>
                </div>
                
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={forecast || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(time) => new Date(time).getHours() + ":00"}
                        minTickGap={30}
                        stroke="#94a3b8"
                        style={{ fontSize: "12px", fontWeight: 500 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        style={{ fontSize: "12px", fontWeight: 500 }} 
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                          color: "#1f2937",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="aqiValue"
                        stroke="#2563eb"
                        strokeWidth={4}
                        dot={{ r: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
                        name="AQI"
                        isAnimationActive={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                  <Activity className="w-6 h-6" />
                  <span className="text-lg font-bold text-gray-900">AQI Monitor</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Empowering communities with accurate, real-time air quality data to breathe safer and live healthier lives.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Platform</h4>
              <ul className="space-y-3">
                <li><a href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Dashboard</a></li>
                <li><a href="/history" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Historical Data</a></li>
                <li><a href="/settings" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Settings</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Health Guidelines</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Connect</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">© 2025 AQI Monitor. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> by the Team
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}