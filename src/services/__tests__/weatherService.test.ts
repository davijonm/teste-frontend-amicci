import axios from "axios";
import { getWeatherByCity } from "../weatherService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../../utils/env", () => ({
  getEnv: () => ({
    VITE_OPENWEATHER_API_KEY: "fake-weather-key",
  }),
}));

describe("getWeatherByCity", () => {
  it("deve retornar os dados climáticos quando a cidade for encontrada", async () => {
    mockedAxios.get.mockResolvedValueOnce({
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
  });

  it("deve lançar erro se a API retornar erro", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Erro"));

    await expect(getWeatherByCity("Cidade Inexistente")).rejects.toThrow(
      "Cidade não encontrada ou erro na API"
    );
  });
});
