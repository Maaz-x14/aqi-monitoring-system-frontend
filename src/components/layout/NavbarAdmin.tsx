import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Cloud, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  LayoutDashboard 
} from 'lucide-react';

 function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-[9999] bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm h-24 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link to="/admin" className="group flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                    <Cloud className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">AQI Monitor</span>
                    <span className="text-xs font-medium text-blue-600 tracking-wide uppercase">Admin Portal</span>
                </div>
            </Link>
            
            {/* Admin Badge - Desktop */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">Administrator Mode</span>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-3 pl-4 pr-6 py-2.5 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="p-1.5 bg-white rounded-full group-hover:scale-110 transition-transform">
                  <LogOut className="w-4 h-4" />
              </div>
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="px-6 py-6 space-y-3">
                {/* Mobile Admin Badge */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <ShieldCheck className="w-5 h-5 text-slate-600" />
                    </div>
                    <span className="font-bold text-slate-700">Admin Dashboard</span>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                >
                    <div className="p-2 bg-white rounded-full"><LogOut className="w-6 h-6" /></div>
                    Logout
                </button>
            </div>
        </div>
      )}
    </nav>
  );
}


export { Navbar };