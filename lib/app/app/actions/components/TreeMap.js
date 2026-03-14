"use client"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

export default function TreeMap({ sightings, onMapClick }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  function LocationMarker() {
    useMapEvents({ click(e) { onMapClick(e.latlng); } });
    return null;
  }

  return (
    <MapContainer center={[37.5, -78.5]} zoom={7} style={{ height: '400px', width: '100%', borderRadius: '1rem' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
      {sightings.map((tree) => (
        <Marker key={tree.id} position={[tree.latitude, tree.longitude]}>
          <Popup>
            <div className="p-1 text-center">
              <p className="font-bold">{tree.species}</p>
              <img src={tree.image_url} className="w-20 h-20 object-cover mx-auto rounded" />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
