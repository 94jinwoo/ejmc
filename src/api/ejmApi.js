const baseURL = 'https://dev-api.wooriga.kr/api/web/bizZone';

export async function getDistrictList(level, bounds) {
  const {
    _ne: { _lat: neLat, _lng: neLng },
    _sw: { _lat: swLat, _lng: swLng },
  } = bounds;

  const param = { level, neLat, neLng, swLat, swLng };

  return await fetch(`${baseURL}/list/district`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(param),
  })
    .then((res) => res.json())
    .then((data) => data);
}
