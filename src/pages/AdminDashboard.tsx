import { useQuery } from "@tanstack/react-query"
import { fetchAdminDashboard } from "@/api/adminApi"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FiMapPin, FiActivity, FiWind, FiAlertTriangle } from "react-icons/fi"
import { Navbar } from "@/components/layout/NavbarAdmin"
// FIX: Use standard default import for Navbar

interface CityData {
  city: string
  latitude: number
  longitude: number
  current: {
    aqiValue: number
    pm25: number
    pm10: number
    o3: number
    healthAdvice: string
  }
  recommendation: {
    message: string
  } | null 
  forecast: Array<{
    aqiValue: number
    timestamp: string
  }>
}

export default function AdminDashboard() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const markersRef = useRef<L.Marker[]>([])

  const {
    data: cities,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => (await fetchAdminDashboard()) as unknown as CityData[],
    refetchInterval: 60000,
  })

  // 1. Initialize Map
  useEffect(() => {
    // Safety: Ensure container exists and map isn't already initialized
    if (!mapContainerRef.current || mapRef.current) return;

    console.log("Initializing Map...")

    const mapInstance = L.map(mapContainerRef.current).setView([30.3753, 69.3451], 5)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(mapInstance)

    mapRef.current = mapInstance

    // Force resize after mount to prevent gray tiles
    setTimeout(() => {
        mapInstance.invalidateSize();
    }, 200);

    // Cleanup: DESTROY map on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // 2. Update Markers
  useEffect(() => {
    if (!cities || !mapRef.current) return

    // Clear old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const bounds = L.latLngBounds([])

    cities.forEach((city: CityData) => {
      // Safety: Skip if lat/lon is missing
      if (!city.latitude || !city.longitude) return;

      const color = getAqiColorHex(city.current.aqiValue)
      
      const html = `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          font-size: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          ${city.current.aqiValue.toFixed(0)}
        </div>
      `

      const customIcon = L.divIcon({
        html: html,
        className: "custom-aqi-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })

      const marker = L.marker([city.latitude, city.longitude], { icon: customIcon })
        .addTo(mapRef.current!)
        .on("click", () => setSelectedCity(city))

      markersRef.current.push(marker)
      bounds.extend([city.latitude, city.longitude])
    })

    if (bounds.isValid() && markersRef.current.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [cities])

  const getAqiColorHex = (aqiValue: number): string => {
    if (aqiValue <= 50) return "#22c55e"
    if (aqiValue <= 100) return "#eab308"
    if (aqiValue <= 150) return "#f97316"
    if (aqiValue <= 200) return "#ef4444"
    if (aqiValue <= 300) return "#a855f7"
    return "#7c2d12"
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-500 animate-pulse">Loading global monitoring data...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <FiAlertTriangle className="w-12 h-12 mx-auto mb-4" />
          Failed to load admin dashboard.
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Floating Stats Card */}
        <div className="absolute left-4 bottom-4 z-[400] bg-white/90 backdrop-blur-sm px-6 py-4 shadow-md rounded-xl border border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">National Monitor</h1>
            <p className="text-xs text-gray-500">Tracking {cities?.length || 0} cities</p>
          </div>
        </div>

        {/* MAP CONTAINER - Explicit Styles added to force visibility */}
        <div 
            ref={mapContainerRef} 
            className="w-full flex-grow z-0"
            style={{ height: '100%', minHeight: '500px', background: '#e5e7eb' }} 
        />

        {/* City Details Sidebar */}
        {selectedCity && (
            <div className="w-[400px] bg-white shadow-2xl flex flex-col h-full border-l border-gray-200 z-[500] absolute right-0 top-0">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiMapPin className="text-blue-600" />
                {selectedCity.city}
                </h2>
                <button 
                onClick={() => setSelectedCity(null)} 
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                ×
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                <div 
                className="rounded-xl p-6 text-white shadow-sm relative overflow-hidden"
                style={{ backgroundColor: getAqiColorHex(selectedCity.current.aqiValue) }}
                >
                <div className="relative z-10">
                    <div className="text-sm font-semibold opacity-90 uppercase tracking-wide">Current AQI</div>
                    <div className="text-5xl font-bold mt-2">{selectedCity.current.aqiValue.toFixed(0)}</div>
                    <div className="text-sm mt-3 font-medium border-t border-white/20 pt-3">
                    {selectedCity.current.healthAdvice}
                    </div>
                </div>
                </div>

                <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <FiWind className="text-blue-500" />
                    Live Pollutants
                </h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                    { label: 'PM2.5', val: selectedCity.current.pm25 },
                    { label: 'PM10', val: selectedCity.current.pm10 },
                    { label: 'Ozone', val: selectedCity.current.o3 }
                    ].map((p) => (
                    <div key={p.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <div className="text-[10px] text-gray-500 font-bold uppercase">{p.label}</div>
                        <div className="text-lg font-bold text-gray-900 mt-1">{p.val ? p.val.toFixed(1) : '-'}</div>
                        <div className="text-[10px] text-gray-400">µg/m³</div>
                    </div>
                    ))}
                </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                    <FiActivity className="text-blue-600" />
                    Smart Recommendation
                </h3>
                <p className="text-sm text-blue-800 leading-relaxed">
                    {selectedCity.recommendation ? selectedCity.recommendation.message : "No recommendation available."}
                </p>
                </div>

                <div>
                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    48h Forecast Trend
                </h3>
                <div className="h-48 w-full bg-white border border-gray-100 rounded-xl p-2 shadow-sm">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCity.forecast}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        tickFormatter={(time) => new Date(time).getHours() + 'h'}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={20}
                        />
                        <YAxis 
                        tick={{ fontSize: 10, fill: '#9ca3af' }} 
                        axisLine={false}
                        tickLine={false}
                        width={30}
                        />
                        <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        labelFormatter={(label) => new Date(label).toLocaleString()}
                        />
                        <Line 
                        type="monotone" 
                        dataKey="aqiValue" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={false} 
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </div>
                </div>
            </div>
            </div>
        )}
      </div>
    </div>
  )
}