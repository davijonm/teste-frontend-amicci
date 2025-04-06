import { getEnv } from "../utils/env";

export const getCityFromCoords = async (lat: number, lng: number): Promise<string> => {
  const apiKey = getEnv().VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    const result = data.results.find((r: any) =>
      r.types.includes("locality") || r.types.includes("administrative_area_level_2")
    );
    const cityComponent = result?.address_components.find((c: any) =>
      c.types.includes("locality") || c.types.includes("administrative_area_level_2")
    );
    return cityComponent?.long_name || "Cidade não encontrada";
  }

  throw new Error("Erro ao buscar cidade pela geolocalização.");
};
