import { useRef } from "react";
import {
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import TextField from "@mui/material/TextField";

type Props = {
  onPlaceSelected: (place: string) => void;
};

const libraries = ["places"];

export function SearchBar({ onPlaceSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ("places")[],
  });

  const handlePlaceChanged = () => {
    if (inputRef.current) {
      const selectedCity = inputRef.current.value;
      onPlaceSelected(selectedCity);
    }
  };

  if (!isLoaded) return <p>Carregando autocomplete...</p>;

  return (
    <Autocomplete onPlaceChanged={handlePlaceChanged}>
      <TextField
        inputRef={inputRef}
        label="Digite o nome da cidade"
        variant="outlined"
        fullWidth
        size="small"
        sx={{ mb: 2 }}
      />
    </Autocomplete>
  );
}
