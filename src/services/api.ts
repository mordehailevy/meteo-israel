export interface City {
  city_name_he: string;
  city_name_en: string;
}

export async function fetchCities(): Promise<City[]> {
  const res = await fetch(
    "https://data.gov.il/api/3/action/datastore_search?resource_id=8f714b6f-c35c-4b40-a0e7-547b675eee0e&limit=2000"
  );
  if (!res.ok) throw new Error(`Cities API error: ${res.status}`);
  const json = await res.json();
  return json.result.records as City[];
}
