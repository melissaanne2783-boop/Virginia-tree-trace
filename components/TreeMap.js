"use client"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

export default function TreeMap({ sightings, onMapClick }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, [])

  function LocationMarker() {
    useMapEvents({ click(e) { onMapClick(e.latlng); } })
    return null
  }

  return (
    <MapContainer center={[37.5, -78.5]} zoom={7} className="h-[400px] w-full rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
      {sightings.map((t) => (
        <Marker key={t.id} position={[t.latitude, t.longitude]}>
          <Popup>{t.species}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
