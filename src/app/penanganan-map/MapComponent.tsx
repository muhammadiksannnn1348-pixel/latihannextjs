"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// @ts-ignore: side-effect import for Leaflet CSS
import 'leaflet/dist/leaflet.css';
import L from "leaflet"

// Fix icon default untuk Leaflet
delete (L.Icon.Default.prototype as any)._getIconurl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
    userLocation: [number, number] | null;
}

export default function MapComponent({ userLocation }: MapComponentProps) {
    return (
        <MapContainer
            center={userLocation || [-6.2088, 106.8456]}
            zoom={userLocation ? 13 : 5}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {userLocation && (
                <Marker position={userLocation}>
                    <Popup>
                        Lokasi Andaa
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}