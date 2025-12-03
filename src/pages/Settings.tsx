import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateUserCity } from '@/api/userApi';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
import { 
  MapPin, 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  ChevronDown,
  Loader2 
} from 'lucide-react';

const CITIES = [
  "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", 
  "Peshawar", "Multan", "Hyderabad", "Islamabad", "Quetta", 
  "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", 
  "Sheikhupura", "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Gujrat"
];

export default function Settings() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const [selectedCity, setSelectedCity] = useState('');

  // Sync state when user data is loaded
  useEffect(() => {
    if (user?.city) {
      setSelectedCity(user.city);
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: updateUserCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('City updated successfully!'); 
    },
    onError: () => {
      toast.error('Failed to update city. Try again.');
    }
  });

  const handleSave = () => {
    if(selectedCity) mutation.mutate(selectedCity);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center mb-8 gap-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
                <SettingsIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your preferences and alert configurations</p>
            </div>
        </div>
        
        {/* Main Card */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-2xl">
          <div className="px-6 py-8 sm:p-10">
            
            {/* Location Section */}
            <div className="flex items-start gap-4 mb-6">
                <div className="mt-1 hidden sm:block">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <span className="sm:hidden"><MapPin className="w-5 h-5 text-blue-600 inline mr-1"/></span>
                        Home City Preference
                    </h3>
                    <div className="mt-2 text-base text-gray-500 max-w-2xl">
                      <p>Select your primary location. We use this to calculate personalized Air Quality Index (AQI) alerts and health recommendations for your dashboard.</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  
                  {/* Custom Select Input */}
                  <div className="relative w-full sm:max-w-md group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    
                    <select
                      value={selectedCity || ''}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 rounded-xl leading-6 bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select your city...</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>

                    {/* Custom Arrow Icon */}
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="sm:flex-shrink-0">
                    <Button 
                        onClick={handleSave} 
                        isLoading={mutation.isPending} 
                        className="w-full sm:w-auto px-8 py-3 h-auto text-base flex items-center justify-center gap-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                        {!mutation.isPending && <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                  </div>
                </div>
            </div>

          </div>
          
          {/* Footer of Card */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm text-gray-500">
                Current location: <span className="font-medium text-gray-900">{user?.city || 'Not set'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}