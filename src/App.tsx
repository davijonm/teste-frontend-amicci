import "./App.css";
import { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar/SearchBar";
import { getWeatherByCity } from "./services/weatherService";
import { getCityFromCoords } from "./services/locationService";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { MyLocation } from "@mui/icons-material";

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
    <div className="app-container">
      <Typography variant="h4" className="app-title" gutterBottom>
        Previsão do Tempo
      </Typography>

      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <SearchBar onPlaceSelected={handleSearch} />
        <Button
          variant="contained"
          endIcon={<MyLocation />}
          onClick={handleGetWeatherByLocation}
          sx={{
            backgroundColor: "rgba(99, 99, 99, 0.842)",
            "&:hover": {
              backgroundColor: "rgba(196, 196, 196, 0.3)",
            },
          }}
        >
          Minha localização
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {weather && (
        <Paper elevation={3} className="weather-card" sx={{ mt: 4, p: 3 }}>
          <Typography className="weather-card-city">
            {weather.cidade}, {weather.pais}
          </Typography>
          <Typography className="weather-card-description">Temperatura: {weather.temperatura}°C</Typography>
          <Typography className="weather-card-description">Clima: {weather.descricao}</Typography>
          <Typography className="weather-card-description">Umidade: {weather.umidade}%</Typography>
          <Typography className="weather-card-description">Vento: {weather.vento} km/h</Typography>
          <Box mt={2} className="weather-icon">
            <img src={`http://openweathermap.org/img/wn/${weather.icone}@2x.png`} alt={weather.descricao} />
          </Box>
        </Paper>
      )}
    </div>
  );
}

export default App;
