import './App.css'
import { SearchBar } from "./components/SearchBar/SearchBar";

function App() {
  const handleSearch = (city: string) => {
    console.log("Buscar cidade:", city);
  };

  return (
    <div>
      <h1>Clima</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}

export default App
