const MEDIA_API = '/api/media.php';

async function readResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('Die Medien-API hat eine ungültige Antwort geliefert.');
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Medien-API fehlgeschlagen (HTTP ${response.status}).`);
  }

  return data;
}

export async function getMediaAssets() {
  const response = await fetch(MEDIA_API, {
    credentials: 'same-origin'
  });
  const data = await readResponse(response);
  return data.assets || [];
}

export async function setProfileAvatar(mediaAssetId) {
  const response = await fetch(`${MEDIA_API}?action=set-avatar`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      media_asset_id: mediaAssetId
    })
  });

  return readResponse(response);
}

async function postMediaFile(file, eventId) {
  const formData = new FormData();
  formData.append('file', file);
  if (eventId != null) formData.append('event_id', eventId);

  const response = await fetch(eventId != null ? `${MEDIA_API}?action=event-banner` : MEDIA_API, {
    method: 'POST',
    credentials: 'same-origin',
    body: formData
  });

  const data = await readResponse(response);
  return data.asset;
}

export async function uploadMediaFile(file) {
  return postMediaFile(file);
}

export async function uploadEventBanner(file, eventId) {
  if (eventId == null || String(eventId).trim() === '') {
    throw new Error('Die Event-ID für den Banner-Upload fehlt.');
  }
  return postMediaFile(file, eventId);
}

export function getMediaDownloadUrl(assetId) {
  return `${MEDIA_API}?id=${encodeURIComponent(assetId)}`;
}

export function getMediaPreviewUrl(assetId) {
  return `${MEDIA_API}?preview=${encodeURIComponent(assetId)}`;
}

export function getMediaAvatarUrl(assetId) {
  return `${MEDIA_API}?avatar_asset=${encodeURIComponent(assetId)}`;
}

export async function deleteMediaAsset(assetId) {
  const response = await fetch(
    `${MEDIA_API}?id=${encodeURIComponent(assetId)}`,
    {
      method: 'DELETE',
      credentials: 'same-origin'
    }
  );

  return readResponse(response);
}