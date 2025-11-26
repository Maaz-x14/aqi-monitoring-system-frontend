import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateUserCity } from '@/api/userApi';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';

const CITIES = [
  "Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Gujranwala", 
  "Peshawar", "Multan", "Hyderabad", "Islamabad", "Quetta", 
  "Bahawalpur", "Sargodha", "Sialkot", "Sukkur", "Larkana", 
  "Sheikhupura", "Rahim Yar Khan", "Jhang", "Dera Ghazi Khan", "Gujrat"
];

export default function Settings() {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({ queryKey: ['user'], queryFn: fetchCurrentUser });
  const [selectedCity, setSelectedCity] = useState(user?.city || '');
  const [msg, setMsg] = useState('');

  const mutation = useMutation({
    mutationFn: updateUserCity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setMsg('City updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    },
  });

  const handleSave = () => {
    if(selectedCity) mutation.mutate(selectedCity);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="city-label">Home City Preference</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Select your home city to receive personalized AQI alerts and recommendations.</p>
            </div>
            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full sm:max-w-xs">
                <select
                  aria-labelledby="city-label" // Fixes the accessibility error
                  value={selectedCity || user?.city || ''}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>Select a city</option>
                  {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:flex-shrink-0">
                <Button onClick={handleSave} isLoading={mutation.isPending} className="w-auto px-6">Save</Button>
              </div>
            </div>
            {msg && <p className="mt-2 text-green-600 text-sm">{msg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}