"use client"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { getCityCoordinates } from "@/lib/city-coordinates"

const defaultIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface MapCardProps {
  city: string
  aqiValue?: number
  aqiColor?: string
  healthAdvice?: string
}

export function MapCard({ city, aqiValue, aqiColor = "bg-slate-600", healthAdvice = "Loading..." }: MapCardProps) {
  const coordinates = getCityCoordinates(city)

  if (!coordinates) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="h-80 flex items-center justify-center text-slate-500 font-medium">
          City coordinates not found
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm z-0">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">{city}</h3>
      </div>
      <div className="relative h-96 w-full">
        <MapContainer
          center={[coordinates.lat, coordinates.lng]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%"}}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coordinates.lat, coordinates.lng]} icon={defaultIcon}>
            <Popup className="w-48">
              <div className="space-y-2 p-1">
                <h4 className="font-semibold text-slate-900">{city}</h4>
                <div className={`${aqiColor} text-white rounded-md p-3 text-center`}>
                  <div className="text-xs font-medium opacity-90">AQI Index</div>
                  <div className="text-2xl font-bold mt-1">{aqiValue?.toFixed(0) ?? "--"}</div>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{healthAdvice}</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}
