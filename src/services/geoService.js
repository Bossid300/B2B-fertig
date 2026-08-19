const API_BASE =
  window.location.hostname === 'localhost'
    ? 'https://gigsda.com/2026/api'
    : '/2026/api';

export async function geocodeAddress(
  address
) {

  const response = await fetch(
    `${API_BASE}/geocode.php?address=${encodeURIComponent(address)}`
  );

  const data =
    await response.json();

  if (
    !data.results ||
    !data.results.length
  ) {
    return null;
  }

  const location =
    data.results[0].geometry.location;

  return {
    lat: location.lat,
    lng: location.lng
  };
}

export function distanceKm(
  lat1,
  lng1,
  lat2,
  lng2
) {

  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
}