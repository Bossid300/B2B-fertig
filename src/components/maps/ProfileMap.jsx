import { useEffect, useRef, useState } from 'react';
import GoogleMapsConsent from './GoogleMapsConsent';

let googleMapsApiPromise;

function loadGoogleMapsApi() {
  if (typeof window.google?.maps?.Map === 'function') {
    return Promise.resolve();
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  if (!apiKey) {
    return Promise.reject(new Error('VITE_GOOGLE_MAPS_KEY ist nicht konfiguriert.'));
  }

  if (!googleMapsApiPromise) {
    googleMapsApiPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const url = new URL('https://maps.googleapis.com/maps/api/js');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('loading', 'async');
      url.searchParams.set('callback', 'gigsdaGoogleMapsReady');
      script.src = url.toString();
      script.async = true;
      script.defer = true;

      let timeoutId;
      const cleanup = () => {
        window.gigsdaGoogleMapsReady = undefined;
        window.clearTimeout(timeoutId);
        script.onerror = null;
      };

      window.gigsdaGoogleMapsReady = () => {
        if (typeof window.google?.maps?.Map === 'function') {
          cleanup();
          resolve();
        } else {
          cleanup();
          googleMapsApiPromise = undefined;
          reject(new Error('Google Maps wurde geladen, aber die Karten-API ist nicht verfügbar.'));
        }
      };

      script.onerror = () => {
        cleanup();
        googleMapsApiPromise = undefined;
        reject(new Error('Die Google Maps API konnte nicht geladen werden.'));
      };

      timeoutId = window.setTimeout(() => {
        cleanup();
        googleMapsApiPromise = undefined;
        reject(new Error('Zeitüberschreitung beim Laden der Google Maps API.'));
      }, 15000);

      document.head.appendChild(script);
    });
  }

  return googleMapsApiPromise;
}

function LoadedSearchMap({ center }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const [apiReady, setApiReady] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;

    loadGoogleMapsApi()
      .then(() => {
        if (isMounted) {
          setApiReady(true);
        }
      })
      .catch((error) => {
        console.error('Google Maps konnte nicht geladen werden:', error);
        if (isMounted) {
          setLoadError(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!apiReady || mapInstance.current) return;

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: center || {
        lat: 48.30639,
        lng: 14.28611
      },
      zoom: 15,
      styles: [
        {
          elementType: 'geometry',
          stylers: [{ color: '#0b1020' }]
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#7dd3fc' }]
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#0b1020' }]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#1e293b' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#020617' }]
        },
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true
    });
  }, [apiReady, center]);

  useEffect(() => {
    if (!apiReady || !mapInstance.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const marker = new window.google.maps.Marker({
      position: {
        lat: Number(center.lat),
        lng: Number(center.lng),
      },
      map: mapInstance.current,

      icon: {
        url: './favicon.svg',
        scaledSize: new window.google.maps.Size(40, 40),
      },
    });
  }, [apiReady, center]);

  useEffect(() => {
    if (!mapInstance.current || !center?.lat || !center?.lng) {
      return;
    }

    mapInstance.current.panTo({
      lat: Number(center.lat),
      lng: Number(center.lng),
    });
  }, [apiReady, center]);

  if (loadError) {
    return (
      <div className="flex h-[500px] items-center justify-center bg-slate-900 px-6 text-center text-red-300">
        {loadError}
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '500px'
      }}
    />
  );
}

export default function ProfileMap({ center }) {
  return (
    <GoogleMapsConsent>
      <LoadedSearchMap
        users={[]}
        center={center}
      />
    </GoogleMapsConsent>
  );
}
