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
import { MyLocation, WbSunny } from "@mui/icons-material"
import CircularProgress from "@mui/material/CircularProgress";


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
  const [loading, setLoading] = useState<boolean>(false);


  const handleSearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeather(data);
    } catch {
      setWeather(null);
      setError("Cidade não encontrada.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetWeatherByLocation = () => {
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const city = await getCityFromCoords(latitude, longitude);
          await handleSearch(city);
        } catch {
          setError("Não foi possível determinar a cidade pela localização.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Permissão negada para acessar a localização.");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    handleGetWeatherByLocation();
  }, []);

  return (
    <div className="app-container">
      <Typography variant="h4" className="app-title" gutterBottom>
        <WbSunny className="title-icon" fontSize="large" />
        Previsão do Tempo
      </Typography>

      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <SearchBar onPlaceSelected={handleSearch} />
        <Button
          variant="contained"
          className="btn-location"
          endIcon={<MyLocation />}
          onClick={handleGetWeatherByLocation}
          sx={{ }}
        >
          Minha localização
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <Paper elevation={3} className="weather-card" sx={{ mt: 4, p: 3, textAlign: 'center' }}>
          <CircularProgress color="inherit" />
          <Typography variant="body2" mt={2}>Carregando dados do clima...</Typography>
        </Paper>
      ) : (
        weather && (
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
        )
      )}
    </div>
  );
}

export default App;
