import { useRef } from "react";
import {
  useLoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import TextField from "@mui/material/TextField";
import { getEnv } from "../../utils/env";

type Props = {
  onPlaceSelected: (place: string) => void;
};

const libraries = ["places"];

export function SearchBar({ onPlaceSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: getEnv().VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as ("places")[],
  });

  const handlePlaceChanged = () => {
    if (inputRef.current) {
      const selectedCity = inputRef.current.value;
      onPlaceSelected(selectedCity);
    }
  };

  if (!isLoaded) return <p>Carregando serviço...</p>;

  return (
    <Autocomplete onPlaceChanged={handlePlaceChanged}>
      <TextField
        inputRef={inputRef}
        sx={{
          mb: 1,
          input: { color: "white" },
          label: { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white",
            },
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        }}
      />
    </Autocomplete>
  );
}
