import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cloud, LogOut, Settings, History, LayoutDashboard, MessageSquare, Menu, X } from 'lucide-react';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 relative z-[9999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <Cloud className="w-8 h-8" />
                <span className="hidden sm:inline">AQI Monitor</span>
            </Link>
            
            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden md:flex items-center gap-2 ml-8">
                           <h1 className='px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2'>ADMIN DASHBOARD</h1>

            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
            <button 
                onClick={handleLogout} 
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
      )}
    </nav>
  );
}


export {Navbar}