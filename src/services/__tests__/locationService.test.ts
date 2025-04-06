import { getCityFromCoords } from '../locationService';

global.fetch = jest.fn();

const mockFetch = fetch as jest.Mock;

jest.mock("../../utils/env", () => ({
  getEnv: () => ({
    VITE_GOOGLE_MAPS_API_KEY: "fake-api-key",
  }),
}));


describe('getCityFromCoords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o nome da cidade quando os dados forem válidos', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        status: "OK",
        results: [
          {
            types: ["locality"],
            address_components: [
              {
                types: ["locality"],
                long_name: "São Paulo",
              },
            ],
          },
        ],
      }),
    });

    const cidade = await getCityFromCoords(-23.55, -46.63);
    expect(cidade).toBe("São Paulo");
  });

  it('deve retornar "Cidade não encontrada" se nenhum componente for encontrado', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        status: "OK",
        results: [],
      }),
    });

    const cidade = await getCityFromCoords(0, 0);
    expect(cidade).toBe("Cidade não encontrada");
  });

  it('deve lançar erro se o status for diferente de OK', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        status: "ZERO_RESULTS",
        results: [],
      }),
    });

    await expect(getCityFromCoords(0, 0)).rejects.toThrow(
      "Erro ao buscar cidade pela geolocalização."
    );
  });
});
