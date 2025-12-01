export interface CityLocation {
  name: string
  lat: number
  lng: number
}

export const CITIES: CityLocation[] = [
  { name: "Karachi", lat: 24.8607, lng: 67.0011 },
  { name: "Lahore", lat: 31.5497, lng: 74.3436 },
  { name: "Faisalabad", lat: 31.4504, lng: 73.135 },
  { name: "Rawalpindi", lat: 33.5651, lng: 73.0169 },
  { name: "Gujranwala", lat: 32.1603, lng: 74.1882 },
  { name: "Peshawar", lat: 34.0151, lng: 71.5249 },
  { name: "Multan", lat: 30.1575, lng: 71.5249 },
  { name: "Hyderabad", lat: 25.396, lng: 68.3578 },
  { name: "Islamabad", lat: 33.6844, lng: 73.0479 },
  { name: "Quetta", lat: 30.1798, lng: 66.975 },
  { name: "Bahawalpur", lat: 29.3956, lng: 71.6836 },
  { name: "Sargodha", lat: 32.0836, lng: 72.6711 },
  { name: "Sialkot", lat: 32.4945, lng: 74.5229 },
  { name: "Sukkur", lat: 27.7131, lng: 68.8492 },
  { name: "Larkana", lat: 27.557, lng: 68.2028 },
  { name: "Sheikhupura", lat: 31.7167, lng: 73.9833 },
  { name: "Rahim Yar Khan", lat: 28.4195, lng: 70.2952 },
  { name: "Jhang", lat: 31.2714, lng: 72.3166 },
  { name: "Dera Ghazi Khan", lat: 30.0459, lng: 70.6403 },
  { name: "Gujrat", lat: 32.5742, lng: 74.0754 },
]

export function getCityCoordinates(cityName: string): CityLocation | undefined {
  return CITIES.find((city) => city.name.toLowerCase() === cityName.toLowerCase())
}

// Additional updates can be added here if necessary
