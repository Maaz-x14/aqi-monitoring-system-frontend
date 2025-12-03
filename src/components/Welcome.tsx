import { 
  Wind, 
  Activity, 
  ShieldCheck, 
  ThermometerSun, 
  MapPin, 
  Info,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function Welcome() {
  return (
    <div className="relative w-full overflow-hidden bg-slate-900 text-slate-200">
      
      {/* Dark Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-40 mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 lg:px-8 lg:py-24">
        
        {/* Main Hero Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left: Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-400 text-xs font-bold tracking-widest uppercase shadow-lg shadow-cyan-900/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System Active
            </div>

            <div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
                Air Quality <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-sm">
                  Monitoring
                </span>
              </h1>
              {/* Punch Line */}
              <p className="mt-6 text-2xl font-medium text-slate-400 border-l-4 border-cyan-500 pl-6 italic">
                "Invisible threats, <span className="text-white font-semibold">visible control.</span>"
              </p>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Your personal environmental command center. We track invisible pollutants like PM2.5 and Ozone with precision sensors, giving you the power to breathe safer and live healthier.
            </p>
          </div>

          {/* Right: Dark Glass Stats Panel */}
          <div className="relative">
            {/* Background Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl blur-2xl opacity-20 transform scale-95 translate-y-4"></div>
            
            <div className="relative bg-slate-900/80 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-6">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
                      <Wind className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Live Monitoring </h3>
                      <p className="text-sm text-slate-400">20 Station across Pakistan</p>
                    </div>
                 </div>
                
                
              </div>

              {/* Stats Grid */}
              <div className="space-y-4">
                <div className="group p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-colors duration-300 flex items-center gap-5">
                  <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
                    <Activity className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Live Tracking</p>
                    <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">PM2.5 & PM10 Levels</p>
                  </div>
                </div>

                <div className="group p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-colors duration-300 flex items-center gap-5">
                  <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
                    <ThermometerSun className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Forecast</p>
                    <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">48-Hour Predictive Trends</p>
                  </div>
                </div>

                <div className="group p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors duration-300 flex items-center gap-5">
                  <div className="p-3 bg-slate-900 rounded-lg group-hover:bg-slate-800 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Advisory</p>
                    <p className="text-lg font-semibold text-slate-200 group-hover:text-white transition-colors">Health Recommendations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          
          <div className="group relative bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Monitor</h3>
            <p className="text-slate-400 leading-relaxed">
              Real-time heatmap tracking of air quality metrics across multiple locations. Visualize the invisible.
            </p>
          </div>

          <div className="group relative bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Info className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Understand</h3>
            <p className="text-slate-400 leading-relaxed">
              Demystify the numbers. Interactive guides on what AQI levels mean for your specific age group.
            </p>
          </div>

          <div className="group relative bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Decide</h3>
            <p className="text-slate-400 leading-relaxed">
              AI-driven insights help you choose the safest times for outdoor activities. Plan with confidence.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
