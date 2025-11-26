import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cloud, LogOut, Settings, History, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <Cloud className="w-8 h-8" />
                AQI Monitor
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/dashboard')}`}>
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                </Link>
                <Link to="/history" className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isActive('/history')}`}>
                    <History className="w-4 h-4" />
                    History
                </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/settings" className={`p-2 rounded-full ${isActive('/settings')}`} title="Settings">
                <Settings className="w-5 h-5" />
            </Link>
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}