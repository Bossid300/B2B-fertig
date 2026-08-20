import { useEffect, useRef } from 'react';

export default function SearchMap() {

  const mapRef = useRef(null);

  useEffect(() => {

    if (!window.google) {
      console.error('Google Maps nicht geladen');
      return;
    }

    new window.google.maps.Map(
      mapRef.current,
      {
        center: {
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