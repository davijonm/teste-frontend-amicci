import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "./SearchBar";
import { useLoadScript } from "@react-google-maps/api";
import { getEnv } from "../../utils/env";

vi.mock("@react-google-maps/api", () => ({
  useLoadScript: vi.fn(),
  Autocomplete: ({ children, onPlaceChanged }: { children: React.ReactNode; onPlaceChanged: () => void }) => (
    <div data-testid="autocomplete" onClick={onPlaceChanged}>
      {children}
    </div>
  ),
}));

vi.mock("../../utils/env", () => ({
  getEnv: vi.fn(),
}));

describe("SearchBar", () => {
  const onPlaceSelectedMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(getEnv).mockReturnValue({
      VITE_GOOGLE_MAPS_API_KEY: "fake-api-key",
      VITE_OPENWEATHER_API_KEY: "fake-openweather-key",
    });
  });

  it("exibe mensagem de carregamento quando a API não está carregada", () => {
    vi.mocked(useLoadScript).mockReturnValue({
      isLoaded: false,
      loadError: undefined,
      url: "https://maps.googleapis.com/maps/api/js",
    });

    render(<SearchBar onPlaceSelected={onPlaceSelectedMock} />);
    
    expect(screen.getByText("Carregando serviço...")).toBeInTheDocument();
    expect(screen.queryByTestId("autocomplete")).not.toBeInTheDocument();
  });

  it("renderiza o componente Autocomplete quando a API está carregada", () => {
    vi.mocked(useLoadScript).mockReturnValue({
      isLoaded: true,
      loadError: undefined,
      url: "https://maps.googleapis.com/maps/api/js",
    });

    render(<SearchBar onPlaceSelected={onPlaceSelectedMock} />);
    
    expect(screen.queryByText("Carregando serviço...")).not.toBeInTheDocument();
    expect(screen.getByTestId("autocomplete")).toBeInTheDocument();
  });

  it("chama onPlaceSelected com o valor do input quando um local é selecionado", () => {
    vi.mocked(useLoadScript).mockReturnValue({
      isLoaded: true,
      loadError: undefined,
      url: "https://maps.googleapis.com/maps/api/js",
    });

    render(<SearchBar onPlaceSelected={onPlaceSelectedMock} />);
    
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "São Paulo" } });
    
    const autocompleteElement = screen.getByTestId("autocomplete");
    fireEvent.click(autocompleteElement);
    
    expect(onPlaceSelectedMock).toHaveBeenCalledWith("São Paulo");
  });

  it("usa a chave API do Google Maps corretamente", () => {
    render(<SearchBar onPlaceSelected={onPlaceSelectedMock} />);
    
    expect(useLoadScript).toHaveBeenCalledWith({
      googleMapsApiKey: "fake-api-key",
      libraries: ["places"],
    });
  });
});