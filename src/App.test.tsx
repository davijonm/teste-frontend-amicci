import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { vi } from "vitest";

vi.mock("./services/weatherService", () => ({
  getWeatherByCity: vi.fn().mockResolvedValue({
    cidade: "São Paulo",
    pais: "Brasil",
    temperatura: 25,
    descricao: "Céu limpo",
    umidade: 60,
    vento: 10,
    icone: "01d",
  }),
}));

vi.mock("./services/locationService", () => ({
  getCityFromCoords: vi.fn().mockResolvedValue("São Paulo"),
}));

vi.mock("./components/SearchBar/SearchBar", () => ({
  SearchBar: ({ onPlaceSelected }: any) => (
    <button onClick={() => onPlaceSelected("São Paulo")}>Buscar SP</button>
  ),
}));

beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: (success, error) => {
      success({
        coords: {
          latitude: -23.55,
          longitude: -46.63,
        },
      });
    },
  };
});

describe("App", () => {
  it("deve exibir os dados do clima após buscar por localização", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("São Paulo, Brasil")).not.toBeNull();
      expect(screen.queryByText("Temperatura: 25°C")).not.toBeNull();
    });
  });

  it("deve mostrar erro se cidade não for encontrada", async () => {
    const { getWeatherByCity } = await import("./services/weatherService");
    (getWeatherByCity as any).mockRejectedValueOnce(new Error("Erro"));

    render(<App />);

    const botao = screen.getByText("Buscar SP");
    botao.click();

    await waitFor(() => {
      expect(screen.queryByText("Cidade não encontrada.")).not.toBeNull();
    });
  });
});
