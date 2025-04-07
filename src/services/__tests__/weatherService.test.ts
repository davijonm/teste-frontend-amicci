import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getWeatherByCity } from "../weatherService";

vi.mock("process", () => ({
  env: {
    VITE_OPENWEATHER_API_KEY: "fake-api-key"
  }
}));

vi.mock("axios");

describe("getWeatherByCity", () => {
  const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar os dados climáticos quando a cidade for encontrada", async () => {
    mockedAxios.get = vi.fn().mockResolvedValue({
      data: {
        name: "Rio de Janeiro",
        sys: { country: "BR" },
        main: { temp: 30, humidity: 60 },
        weather: [{ description: "ensolarado", icon: "01d" }],
        wind: { speed: 10 },
      },
    });

    const clima = await getWeatherByCity("Rio de Janeiro");

    expect(clima).toEqual({
      cidade: "Rio de Janeiro",
      pais: "BR",
      temperatura: 30,
      descricao: "ensolarado",
      umidade: 60,
      vento: 10,
      icone: "01d",
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({
          q: "Rio de Janeiro",
          units: "metric",
          lang: "pt_br",
        }),
      })
    );
  });

  it("deve lançar erro se a API retornar erro", async () => {
    mockedAxios.get = vi.fn().mockRejectedValue(new Error("Not Found"));

    await expect(getWeatherByCity("Cidade Inexistente")).rejects.toThrow(
      "Cidade não encontrada ou erro na API"
    );
  });
});
