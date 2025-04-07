import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCityFromCoords } from "../locationService";

vi.mock("../utils/env", () => ({
  getEnv: () => ({ VITE_GOOGLE_MAPS_API_KEY: "fake-api-key" }),
}));

describe('getCityFromCoords', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar o nome da cidade quando os dados forem válidos', async () => {
    const mockJson = {
      status: "OK",
      results: [
        {
          types: ["locality"],
          address_components: [
            {
              long_name: "São Paulo",
              types: ["locality"],
            },
          ],
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockJson),
      } as Response)
    );

    const cidade = await getCityFromCoords(-23.5505, -46.6333);
    expect(cidade).toBe("São Paulo");
  });

  it('deve retornar "Cidade não encontrada" se nenhum componente for encontrado', async () => {
    const mockJson = {
      status: "OK",
      results: [
        {
          types: ["locality"],
          address_components: [],
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockJson),
      } as Response)
    );

    const cidade = await getCityFromCoords(-23.5505, -46.6333);
    expect(cidade).toBe("Cidade não encontrada");
  });

  it("lança erro se a resposta não for OK", async () => {
    const mockJson = {
      status: "ZERO_RESULTS",
      results: [],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockJson),
      } as Response)
    );

    await expect(getCityFromCoords(-23.5505, -46.6333)).rejects.toThrow(
      "Erro ao buscar cidade pela geolocalização."
    );
  });

  it("lança erro se a requisição falhar", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    await expect(getCityFromCoords(-23.5505, -46.6333)).rejects.toThrow(
      "Network error"
    );
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });
});
