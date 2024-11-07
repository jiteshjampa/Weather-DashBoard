import { useState } from "react";
import WeatherDisplay from "./components/WeatherDisplay";
import Favorites from "./components/Favorites";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="body">
      <div className="weather-container">
        <WeatherDisplay />
      </div>
      <div className="favorites-container">
        <Favorites />
      </div>
    </div>
  );
}

export default App;
