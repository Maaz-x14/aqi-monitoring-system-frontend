import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  LogOut, 
  Settings, 
  History, 
  LayoutDashboard, 
  MessageSquare, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to determine active styles
  const getLinkStyles = (path: string) => {
    const active = location.pathname === path;
    return {
      container: active 
        ? "bg-blue-600 text-blue-100 shadow-sm ring-1 ring-blue-100" 
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
      icon: active
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700"
    };
  };

  const NavLink = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const styles = getLinkStyles(to);
    return (
      <Link 
        to={to} 
        className={`group flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-300 font-medium text-base ${styles.container}`}
      >
        <div className={`p-2 rounded-full transition-colors duration-300 ${styles.icon}`}>
           <Icon className="w-5 h-5" />
        </div>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-[9999] bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm h-24 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
                    <Cloud className="w-7 h-7 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">AQI Monitor</span>
                    <span className="text-xs font-medium text-blue-600 tracking-wide uppercase">System Active</span>
                </div>
            </Link>
          </div>

           {/* Desktop Navigation - Centered */}
           <div className="hidden lg:flex items-center gap-2">
                <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                <NavLink to="/history" icon={History} label="History" />
                <NavLink to="/chat" icon={MessageSquare} label="AI Assistant" />
           </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            
            <Link 
                to="/settings" 
                className={`hidden md:flex p-3 rounded-full transition-all duration-300 ${location.pathname === '/settings' ? 'bg-gray-100 text-gray-900 rotate-90' : 'text-gray-500 hover:bg-gray-50 hover:text-blue-600 hover:rotate-90'}`}
                title="Settings"
            >
                <Settings className="w-6 h-6" />
            </Link>
            
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
                className="lg:hidden p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-white border-b border-gray-100 shadow-xl lg:hidden animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="px-6 py-6 space-y-3">
                <Link 
                    to="/dashboard" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 text-gray-900 font-medium"
                >
                    <div className="p-2 bg-white rounded-full shadow-sm"><LayoutDashboard className="w-6 h-6 text-blue-600" /></div>
                    Dashboard
                </Link>
                
                <Link 
                    to="/history" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                >
                    <div className="p-2 bg-gray-100 rounded-full"><History className="w-6 h-6" /></div>
                    History
                </Link>

                <Link 
                    to="/chat" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                >
                    <div className="p-2 bg-gray-100 rounded-full"><MessageSquare className="w-6 h-6" /></div>
                    AI Assistant
                </Link>

                <div className="h-px bg-gray-100 my-2"></div>

                <Link 
                    to="/settings" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 text-gray-600 font-medium transition-colors"
                >
                    <div className="p-2 bg-gray-100 rounded-full"><Settings className="w-6 h-6" /></div>
                    Settings
                </Link>

                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-red-50 text-red-600 font-medium"
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