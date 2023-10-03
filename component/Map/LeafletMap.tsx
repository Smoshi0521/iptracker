// components/LeafletMap.js
import style from '@/styles/Home.module.css';
import L from 'leaflet';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { Popup } from 'react-leaflet/Popup';
const LeafletMap = ({ ipAddress, isp }: any) => {

  const customIcon = new L.Icon({
    iconRetinaUrl: iconRetina.src,
    iconUrl: iconMarker.src,
    shadowUrl: iconShadow.src,
  });

  return (
    <MapContainer className={style.map} center={ipAddress} zoom={15} scrollWheelZoom={false} zoomControl={false} >
      <TileLayer
        url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {
        isp && (
          <Marker position={ipAddress} icon={customIcon}>
            <Popup>
              {isp}
            </Popup>
          </Marker>
        )
      }
    </MapContainer>

  );
};

export default LeafletMap;
