import { useEffect, useRef } from 'react';

export default function SearchMap({ users = [], center, onUserSelect }) {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {

    if (!window.google) {
      console.error('Google Maps nicht geladen');
      return;
    }

    mapInstance.current =
      new window.google.maps.Map(
        mapRef.current,
        {
          center: center || {
            lat: 48.30639,
            lng: 14.28611
          },
          zoom: 8,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true
        }
      );

  }, []);

  useEffect(() => {

    if (!mapInstance.current) return;

    markersRef.current.forEach(marker =>
      marker.setMap(null)
    );

    markersRef.current = [];

    users.forEach(user => {

      if (!user?.lat || !user?.lng) return;

        const marker =
        new window.google.maps.Marker({
            position: {
            lat: Number(user.lat),
            lng: Number(user.lng)
            },
            map: mapInstance.current,
            icon: {
            url: './favicon.svg',
            scaledSize:
                new window.google.maps.Size(
                40,
                40
                )
            }
        });

        const infoWindow =
        new window.google.maps.InfoWindow({
        content: `
            <div style="
            color:#0ea5e9;
            font-weight:bold;
            font-size:16px;
            margin-bottom:4px;
            ">
            ${
                user.name ||
                user.display_name ||
                user.user_name ||
                'Profil'
            }
            </div>

            <div style="
            color:#0ea5e9;
            margin-bottom:4px;
            ">
            ${
                user.role ||
                user.type ||
                user.gewerk ||
                ''
            }
            </div>

            <div style="
            color:#666;
            font-size:12px;
            ">
            📍 ${
                user.city ||
                user.location ||
                user.ort ||
                ''
            }
            </div>

        </div>
        `
        });


marker.addListener(
  'click',
  () => {

    if (
      typeof onUserSelect === 'function'
    ) {
      onUserSelect(user);
    }

  }
);




        markersRef.current.push(marker);
});





}, [users]);

  useEffect(() => {

    if (
      !mapInstance.current ||
      !center?.lat ||
      !center?.lng
    ) {
      return;
    }

    mapInstance.current.panTo({
      lat: Number(center.lat),
      lng: Number(center.lng)
    });

  }, [center]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '700px'
      }}
    />
  );
}
