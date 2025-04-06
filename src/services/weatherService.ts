import axios from "axios";
import { getEnv } from "../utils/env";

const API_KEY = getEnv().VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherByCity(city: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "pt_br",
      },
    });

    const data = response.data;

    return {
      cidade: data.name,
      pais: data.sys.country,
      temperatura: data.main.temp,
      descricao: data.weather[0].description,
      umidade: data.main.humidity,
      vento: data.wind.speed,
      icone: data.weather[0].icon,
    };
  } catch {
    throw new Error("Cidade não encontrada ou erro na API");
  }
}
