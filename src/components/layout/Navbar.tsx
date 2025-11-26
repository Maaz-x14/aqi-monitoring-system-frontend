import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <Cloud className="w-8 h-8" />
                AQI Monitor
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/settings" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full" title="Settings">
                <Settings className="w-5 h-5" />
            </Link>
            <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
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