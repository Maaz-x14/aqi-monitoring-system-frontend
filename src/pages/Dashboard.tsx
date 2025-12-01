"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchCurrentUser } from "@/api/userApi"
import { fetchCurrentAqi, fetchRecommendation, fetchForecast } from "@/api/aqiApi"
import Navbar from "@/components/layout/Navbar"
import { getAqiColor } from "@/utils/aqiColors"
import {  FaReact as Activity, FaWind as Wind,FaEyeDropper as Droplets,FaEye as Eye,FaAngleUp as TrendingUp, FaGithub as Github, FaLinkedin as Linkedin,FaMailchimp as Mail, FaHeart as Heart  } from "react-icons/fa"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { MapCard } from "@/components/map-card"
import Welcome from "@/components/Welcome"
// const styleSheet = document.createElement("style")
// styleSheet.textContent = `
//   @keyframes gradientRise {
//     from {
//       background-position: 0% 100%;
//     }
//     to {
//       background-position: 0% 50%;
//     }
//   }
//   .card-hover {
//     position: relative;
//     overflow: hidden;
//   }
//   .card-hover::before {
//     content: '';
//     position: absolute;
//     inset: 0;
//     background: linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 50%);
//     opacity: 0;
//     transition: opacity 0.6s ease-out;
//     pointer-events: none;
//   }
//   .card-hover:hover::before {
//     opacity: 1;
//     animation: gradientRise 0.6s ease-out forwards;
//   }
//   .icon-animate {
//     transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
//   }
//   .card-hover:hover .icon-animate {
//     transform: scale(1.15) rotate(-5deg);
//   }
// `
// if (typeof document !== "undefined") {
//   document.head.appendChild(styleSheet)
// }

// export default function Dashboard() {
//   const navigate = useNavigate()
//   const { data: user, isLoading: userLoading } = useQuery({
//     queryKey: ["user"],
//     queryFn: fetchCurrentUser,
//   })

//   const city = user?.city

//   useEffect(() => {
//     if (!userLoading && user && !user.city) {
//       navigate("/settings")
//     }
//   }, [user, userLoading, navigate])

//   const { data: aqi, isLoading: aqiLoading } = useQuery({
//     queryKey: ["aqi", city],
//     queryFn: () => fetchCurrentAqi(city!),
//     enabled: !!city,
//     refetchInterval: 900000,
//   })

//   const { data: recommendation } = useQuery({
//     queryKey: ["recommendation", city],
//     queryFn: () => fetchRecommendation(city!),
//     enabled: !!city,
//   })

//   const { data: forecast } = useQuery({
//     queryKey: ["forecast", city],
//     queryFn: () => fetchForecast(city!),
//     enabled: !!city,
//   })

//   if (userLoading || (city && aqiLoading)) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
//         <Navbar />
//         <div className="flex-1 flex justify-center items-center text-indigo-400 text-lg font-light">
//           Loading data for {city || "you"}...
//         </div>
//       </div>
//     )
//   }

//   if (!city) return null

//   const displayAqi = aqi?.aqiValue?.toFixed(0) ?? "--"
//   const aqiColorClass = aqi?.aqiValue ? getAqiColor(aqi.aqiValue) : "bg-gradient-to-br from-gray-200 to-gray-300"

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
//       <Navbar />
//       <Welcome/>
//       <main className="w-full flex-1">
//         <div className="grid grid-cols-4 gap-0">
//           {/* MAP CARD - Spans 3 columns */}
//           <div className="col-span-3 border-r border-b border-indigo-200 card-hover bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/40">
//             <div className="h-96 overflow-hidden -z-10">
//               <MapCard
//                 city={city}
//                 aqiValue={Number(displayAqi)}
//                 aqiColor={aqiColorClass}
//                 healthAdvice={aqi?.healthAdvice}
//               />
//             </div>
//           </div>

//           {/* CURRENT AQI BIG CARD - Spans 1 column */}
//           <div
//             className={`border-r border-b border-indigo-200 card-hover transition-all ${aqiColorClass} duration-300 hover:shadow-xl hover:shadow-blue-200/50`}
//           >
//             <div className="h-96 flex flex-col justify-between p-6">
//               <div>
//                 <p className="text-xs font-bold opacity-75 uppercase tracking-widest text-gray-100">Current AQI</p>
//                 <h2 className="text-sm font-semibold opacity-90 mt-1 line-clamp-2 text-gray-100">{city}</h2>
//               </div>
//               <div className="flex flex-col items-center justify-center flex-1">
//                 <div className="text-7xl font-black tracking-tighter text-gray-100">{displayAqi}</div>
//                 <p className="text-xs font-medium opacity-70 mt-2 text-center max-w-xs text-gray-100">
//                   {aqi?.healthAdvice || "No data"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* RECOMMENDATION CARD - Spans 2 columns */}
//           <div className="col-span-2 border-r border-indigo-200 bg-gradient-to-br from-blue-50 to-cyan-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-cyan-200/40">
//             <div className="h-56 flex flex-col justify-between p-8">
//               <div>
//                 <div className="flex items-center gap-3 mb-4">
//                   <Activity className="w-6 h-6 text-cyan-500 icon-animate" />
//                   <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Activity Guide</p>
//                 </div>
//                 <p className="text-lg font-semibold text-gray-900 leading-tight">
//                   {recommendation?.message || "Analyzing forecast..."}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* POLLUTANTS CARD - Spans 2 columns */}
//           <div className="col-span-2 border-b border-indigo-200 bg-gradient-to-br from-amber-50 to-orange-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-orange-200/40">
//             <div className="h-56 flex flex-col justify-between p-8">
//               <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">Pollutant Breakdown</p>
//               <div className="space-y-4 flex-1 flex flex-col justify-center">
//                 {/* PM2.5 */}
//                 <div className="flex justify-between items-center pb-2 border-b border-amber-200">
//                   <div className="flex items-center gap-2">
//                     <Wind className="w-4 h-4 text-amber-500 icon-animate" />
//                     <span className="text-sm text-gray-700 font-medium">PM2.5</span>
//                   </div>
//                   <span className="text-lg font-bold text-gray-900">
//                     {aqi?.pm25?.toFixed(1) ?? "-"}
//                     <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
//                   </span>
//                 </div>
//                 {/* PM10 */}
//                 <div className="flex justify-between items-center pb-2 border-b border-amber-200">
//                   <div className="flex items-center gap-2">
//                     <Droplets className="w-4 h-4 text-orange-500 icon-animate" />
//                     <span className="text-sm text-gray-700 font-medium">PM10</span>
//                   </div>
//                   <span className="text-lg font-bold text-gray-900">
//                     {aqi?.pm10?.toFixed(1) ?? "-"}
//                     <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
//                   </span>
//                 </div>
//                 {/* Ozone */}
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <Eye className="w-4 h-4 text-amber-600 icon-animate" />
//                     <span className="text-sm text-gray-700 font-medium">Ozone</span>
//                   </div>
//                   <span className="text-lg font-bold text-gray-900">
//                     {aqi?.o3?.toFixed(1) ?? "-"}
//                     <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* FORECAST CHART - Spans full width */}
//           <div className="col-span-4 border-t border-indigo-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/40">
//             <div className="p-8">
//               <div className="flex items-center gap-2 mb-6">
//                 <TrendingUp className="w-5 h-5 text-indigo-500 icon-animate" />
//                 <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">48-Hour Forecast</p>
//               </div>
//               <div className="h-80 w-full">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={forecast || []}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
//                     <XAxis
//                       dataKey="timestamp"
//                       tickFormatter={(time) => new Date(time).getHours() + ":00"}
//                       minTickGap={30}
//                       stroke="#818cf8"
//                       style={{ fontSize: "12px" }}
//                     />
//                     <YAxis stroke="#818cf8" style={{ fontSize: "12px" }} />
//                     <Tooltip
//                       labelFormatter={(label) => new Date(label).toLocaleString()}
//                       contentStyle={{
//                         backgroundColor: "#ffffff",
//                         border: "2px solid #e0e7ff",
//                         borderRadius: "8px",
//                         color: "#1f2937",
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="aqiValue"
//                       stroke="#6366f1"
//                       strokeWidth={3}
//                       dot={false}
//                       name="AQI"
//                       isAnimationActive={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <footer className="border-t border-indigo-200 bg-gradient-to-r from-blue-50 to-indigo-50 mt-auto">
//         <div className="w-full px-8 py-12">
//           <div className="grid grid-cols-4 gap-8 mb-12">
//             {/* About Section */}
//             <div className="col-span-1">
//               <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">About</h3>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 Monitor air quality in real-time and make informed decisions about your health and outdoor activities.
//               </p>
//             </div>

//             {/* Quick Links */}
//             <div className="col-span-1">
//               <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a
//                     href="/dashboard"
//                     className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
//                   >
//                     Dashboard
//                   </a>
//                 </li>
//                 <li>
//                   <a
//                     href="/settings"
//                     className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
//                   >
//                     Settings
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     Privacy Policy
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     Terms of Service
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Resources */}
//             <div className="col-span-1">
//               <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Resources</h3>
//               <ul className="space-y-2">
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     Air Quality Guide
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     Health Tips
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     Blog
//                   </a>
//                 </li>
//                 <li>
//                   <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
//                     FAQ
//                   </a>
//                 </li>
//               </ul>
//             </div>

//             {/* Social Links */}
//             <div className="col-span-1">
//               <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Follow Us</h3>
//               <div className="flex gap-4">
//                 <a
//                   href="#"
//                   className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
//                 >
//                   <Github className="w-4 h-4 icon-animate" />
//                 </a>
//                 <a
//                   href="#"
//                   className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
//                 >
//                   <Linkedin className="w-4 h-4 icon-animate" />
//                 </a>
//                 <a
//                   href="#"
//                   className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
//                 >
//                   <Mail className="w-4 h-4 icon-animate" />
//                 </a>
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-indigo-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-sm text-gray-600">© 2025 Air Quality Dashboard. All rights reserved.</p>
//             <div className="flex items-center gap-1 text-sm text-gray-600">
//               Made with
//               <Heart className="w-4 h-4 text-red-500 icon-animate" />
//               by the AHTISAM,MAAZ,ZAEEM,HUSSNAIN,HAMZA,TAYYAB
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }

const styleSheet = document.createElement("style")
styleSheet.textContent = `
  @keyframes gradientRise {
    from {
      background-position: 0% 100%;
    }
    to {
      background-position: 0% 50%;
    }
  }
  .card-hover {
    position: relative;
    overflow: hidden;
  }
  .card-hover::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(255,255,255,0.1) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.6s ease-out;
    pointer-events: none;
  }
  .card-hover:hover::before {
    opacity: 1;
    animation: gradientRise 0.6s ease-out forwards;
  }
  .icon-animate {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
  }
  .card-hover:hover .icon-animate {
    transform: scale(1.15) rotate(-5deg);
  }
`
if (typeof document !== "undefined") {
  document.head.appendChild(styleSheet)
}

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
        <div className="flex-1 flex justify-center items-center text-indigo-400 text-lg font-light">
          Loading data for {city || "you"}...
        </div>
      </div>
    )
  }

  if (!city) return null

  const displayAqi = aqi?.aqiValue?.toFixed(0) ?? "--"
  const aqiColorClass = aqi?.aqiValue ? getAqiColor(aqi.aqiValue) : "bg-gradient-to-br from-gray-200 to-gray-300"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      <Navbar />
      <Welcome />
      <main className="w-full flex-1">
        <div className="grid grid-cols-4 gap-0">
          {/* MAP CARD - Spans 3 columns */}
          <div className="col-span-3 border-r border-b border-indigo-200 card-hover bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/40">
            <div className="h-96 overflow-hidden -z-10">
              <MapCard
                city={city}
                aqiValue={Number(displayAqi)}
                aqiColor={aqiColorClass}
                healthAdvice={aqi?.healthAdvice}
              />
            </div>
          </div>

          {/* CURRENT AQI BIG CARD - Spans 1 column */}
          <div
            className={`border-r border-indigo-200 card-hover ${aqiColorClass} transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/50`}
          >
            <div className="h-96 flex flex-col justify-between p-6">
              <div>
                <p className="text-xs font-bold opacity-75 uppercase tracking-widest text-white">Current AQI</p>
                <h2 className="text-sm font-semibold opacity-90 mt-1 line-clamp-2 text-white">{city}</h2>
              </div>
              <div className="flex flex-col items-center justify-center flex-1">
                <div className="text-7xl font-black tracking-tighter text-white">{displayAqi}</div>
                <p className="text-xs font-medium opacity-70 mt-2 text-center max-w-xs text-white">
                  {aqi?.healthAdvice || "No data"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0">
          {/* RECOMMENDATION CARD */}
          <div className="border-b border-indigo-200 bg-gradient-to-br from-blue-50 to-cyan-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-cyan-200/40">
            <div className="p-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-6 h-6 text-cyan-500 icon-animate" />
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Activity Guide</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 leading-tight">
                  {recommendation?.message || "Analyzing forecast..."}
                </p>
              </div>
            </div>
          </div>

          {/* POLLUTANTS CARD */}
          <div className="border-b border-indigo-200 bg-gradient-to-br from-amber-50 to-orange-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-orange-200/40">
            <div className="p-8">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-4">Pollutant Breakdown</p>
              <div className="space-y-4">
                {/* PM2.5 */}
                <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-amber-500 icon-animate" />
                    <span className="text-sm text-gray-700 font-medium">PM2.5</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {aqi?.pm25?.toFixed(1) ?? "-"}
                    <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
                  </span>
                </div>
                {/* PM10 */}
                <div className="flex justify-between items-center pb-2 border-b border-amber-200">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-orange-500 icon-animate" />
                    <span className="text-sm text-gray-700 font-medium">PM10</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {aqi?.pm10?.toFixed(1) ?? "-"}
                    <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
                  </span>
                </div>
                {/* Ozone */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-600 icon-animate" />
                    <span className="text-sm text-gray-700 font-medium">Ozone</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {aqi?.o3?.toFixed(1) ?? "-"}
                    <span className="text-xs text-gray-500 font-normal ml-1">µg/m³</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* FORECAST CHART */}
          <div className="border-b border-indigo-200 bg-gradient-to-br from-white via-blue-50 to-indigo-50 card-hover transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/40">
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-indigo-500 icon-animate" />
                <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">48-Hour Forecast</p>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecast || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                    <XAxis
                      dataKey="timestamp"
                      tickFormatter={(time) => new Date(time).getHours() + ":00"}
                      minTickGap={30}
                      stroke="#818cf8"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis stroke="#818cf8" style={{ fontSize: "12px" }} />
                    <Tooltip
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "2px solid #e0e7ff",
                        borderRadius: "8px",
                        color: "#1f2937",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="aqiValue"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={false}
                      name="AQI"
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-indigo-200 bg-gradient-to-r from-blue-50 to-indigo-50 mt-auto">
        <div className="w-full px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-12">
            {/* About Section */}
            <div className="col-span-1">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Monitor air quality in real-time and make informed decisions about your health and outdoor activities.
              </p>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/dashboard"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="/settings"
                    className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    Air Quality Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    Health Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-300">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="col-span-1">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <Github className="w-4 h-4 icon-animate" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <Linkedin className="w-4 h-4 icon-animate" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <Mail className="w-4 h-4 icon-animate" />
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-indigo-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">© 2025 Air Quality Dashboard. All rights reserved.</p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              Made with
              <Heart className="w-4 h-4 text-red-500 icon-animate" />
              by the AQ Team
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
