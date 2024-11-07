import React, { useState } from "react";

const TemperatureToggle = ({ onToggle }) => {
  const [tempUnit, setTempUnit] = useState("Celsius");

  const handleToggle = () => {
    const newUnit = tempUnit === "Celsius" ? "Fahrenheit" : "Celsius";
    setTempUnit(newUnit);
    onToggle(newUnit); // Pass the new unit back to WeatherDisplay
  };

  return (
    <button onClick={handleToggle}>
      Switch to {tempUnit === "Celsius" ? "Fahrenheit" : "Celsius"}
    </button>
  );
};

export default TemperatureToggle;
