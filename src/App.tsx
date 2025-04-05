import "./App.css";
import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { getWeatherByCity } from "./services/weatherService";
import { getCityFromCoords } from "./services/locationService";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type WeatherData = {
  cidade: string;
  pais: string;
  temperatura: number;
  descricao: string;
  umidade: number;
  vento: number;
  icone: string;
};

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (city: string) => {
    try {
      setError(null);
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch {
      setWeather(null);
      setError("Cidade não encontrada.");
    }
  };

  const handleGetWeatherByLocation = () => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const city = await getCityFromCoords(latitude, longitude);
          handleSearch(city);
        } catch {
          setError("Não foi possível determinar a cidade pela localização.");
        }
      },
      () => {
        setError("Permissão negada para acessar a localização.");
      }
    );
  };

  useEffect(() => {
    handleGetWeatherByLocation();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Consulta do Clima
      </Typography>

      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <SearchBar onPlaceSelected={handleSearch} />
        <Button variant="contained" onClick={handleGetWeatherByLocation}>
          Minha localização
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {weather && (
        <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: "rgb(218, 218, 218)", backdropFilter: "blur(4px)" }}>
          <Typography variant="h6">
            {weather.cidade}, {weather.pais}
          </Typography>
          <Typography>Temperatura: {weather.temperatura}°C</Typography>
          <Typography>Clima: {weather.descricao}</Typography>
          <Typography>Umidade: {weather.umidade}%</Typography>
          <Typography>Vento: {weather.vento} km/h</Typography>
          <Box mt={2}>
            <img
              src={`http://openweathermap.org/img/wn/${weather.icone}@2x.png`}
              alt={weather.descricao}
            />
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default App;
