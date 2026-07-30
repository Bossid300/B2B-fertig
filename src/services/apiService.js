export async function getProfiles() {
  const response = await fetch(
    '/2026/api/getProfiles.php'
  );

  const data = await response.json();

  return data.profiles || [];
}

export async function getEvents() {
  const response = await fetch(
    '/2026/api/getEvents.php'
  );
  const data = await response.json();
  return data.events || [];
}

export async function createProfile(profile) {

  const response = await fetch(
    '/2026/api/createProfile.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profile)
    }
  );

  return await response.json();
}

export async function createAuthUser(user) {

  const response = await fetch(
    '/2026/api/createAuthUser.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    }
  );

  return await response.json();
}

export async function getLoginUser(email, password) {

  const response = await fetch(
    '/2026/api/getLoginUser.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  return await response.json();
}

export async function getProfileById(id) {

  const response = await fetch(
    '/2026/api/getProfileById.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    }
  );

  return await response.json();
}

export async function saveProfile(
  profileId,
  profile
) {

  const response = await fetch(
    '/2026/api/saveProfile.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: profileId,
        profile
      })
    }
  );

  return await response.json();
}

export async function getProfilesDb() {

  const response = await fetch(
    '/2026/api/getProfiles.php'
  );

  const data = await response.json();

  return data.profiles || [];
}

export async function getCrewRequests() {
  const response = await fetch(
    '/2026/api/getCrewRequests.php'
  );

  const data = await response.json();

  return data.requests || [];
}


export async function saveCrewRequest(request) {
  const response = await fetch(
    '/2026/api/saveCrewRequest.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }
  );

  return await response.json();
}


export async function updateCrewRequest(
  requestId,
  updates
) {
  const response = await fetch(
    '/2026/api/updateCrewRequest.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId,
        updates
      })
    }
  );

  return await response.json();
}

export async function saveEvent(event) {
  const response = await fetch(
    '/2026/api/saveEvent.php',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }
  );

  return await response.json();
}