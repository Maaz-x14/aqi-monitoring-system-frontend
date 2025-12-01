import { FaWind as Wind,FaExclamationCircle as AlertCircle, FaAngleUp as TrendingUp} from "react-icons/fa"
import GradualBlur from "./GradualBlur"

export default function Welcome() {
  return (
    <div className="w-full relative">
      <GradualBlur preset="footer" className="pointer-events-none" />

      <div className="px-8 py-12 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b border-indigo-200">
        <div className="max-w-6xl mx-auto">
          {/* Main Welcome Section */}
          <div className="flex items-start justify-between gap-8 mb-8">
            {/* Left Content */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Wind className="w-8 h-8 text-indigo-600 animate-bounce" />
                <h1 className="text-4xl font-bold text-gray-900">Air Quality Monitoring System</h1>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Welcome to your personal air quality dashboard. Get real-time insights into the air quality around you,
                receive personalized health recommendations, and plan your outdoor activities with confidence.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our advanced monitoring system tracks multiple air pollutants including PM2.5, PM10, and Ozone levels,
                providing you with accurate forecasts and actionable health advice.
              </p>
            </div>

            {/* Right Stats */}
            <div className="flex flex-col gap-4 min-w-fit">
              <div className="bg-white border border-indigo-200 rounded-lg p-4 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/40">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Real-time</p>
                    <p className="text-sm font-semibold text-gray-900">Live Updates</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-indigo-200 rounded-lg p-4 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/40">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Forecast</p>
                    <p className="text-sm font-semibold text-gray-900">48-Hour Trends</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-indigo-200 rounded-lg p-4 card-hover transition-all duration-300 hover:shadow-lg hover:shadow-indigo-200/40">
                <div className="flex items-center gap-3">
                  <Wind className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Personalized</p>
                    <p className="text-sm font-semibold text-gray-900">Health Tips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Features Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-indigo-200">
            <div className="card-hover transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-indigo-200/40 p-4 rounded-lg bg-white/50">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-2">Monitor</h3>
              <p className="text-sm text-gray-700">
                Track air quality metrics and pollutant levels across multiple locations
              </p>
            </div>

            <div className="card-hover transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-indigo-200/40 p-4 rounded-lg bg-white/50">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-2">Understand</h3>
              <p className="text-sm text-gray-700">Learn what each AQI level means and how it affects your health</p>
            </div>

            <div className="card-hover transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-indigo-200/40 p-4 rounded-lg bg-white/50">
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-widest mb-2">Decide</h3>
              <p className="text-sm text-gray-700">
                Make informed decisions about outdoor activities based on AQI forecasts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
