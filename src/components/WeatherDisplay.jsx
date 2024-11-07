import React, { useState, useEffect } from "react";
import axios from "axios";
import Search from "./Search";
import TemperatureToggle from "./TemperatureToggle";
import clear from "../assets/clear-sky.png";
import rain from "../assets/rain.gif";
import sun from "../assets/sun.gif";
import cloud from "../assets/clouds.gif";
import snow from "../assets/snow.gif";
import mist from "../assets/mist.png";

const WeatherDisplay = () => {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [submittedValue, setSubmittedValue] = useState("");
  const [forecast, setForecast] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [todayWeather, setTodayWeather] = useState(null);
  const [tempUnit, setTempUnit] = useState("Celsius");
  const [forecastImage, setforecastImage] = useState("");
  const [weatherResponse, setWeatherResponse] = useState(null);
  const convertToFahrenheit = (temp) => (temp * 9) / 5 + 32;
  const displayTemp = (temp) =>
    tempUnit === "Celsius" ? temp : convertToFahrenheit(temp);

  const handleToggleUnit = (newUnit) => {
    setTempUnit(newUnit);
  };

  useEffect(() => {
    const FetchLocation = async () => {
      if (!submittedValue) return;
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${submittedValue}&limit=1&appid=d1440630b41bfa9d5aa53f7c0ae3e5a5`
        );

        if (response.data && response.data.length > 0) {
          const locationData = response.data[0];
          setLatitude(locationData.lat);
          setLongitude(locationData.lon);
        } else {
          // Show alert if city is not found and reset submitted value
          alert("City not found. Please enter a valid city name.");
        }
      } catch (error) {
        console.log("Error fetching the longitude and latitude:", error);
      }
    };

    FetchLocation();
  }, [submittedValue]);

  useEffect(() => {
    const FetchForecast = async () => {
      if (latitude === null || longitude === null) return;
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&cnt=40&appid=d1440630b41bfa9d5aa53f7c0ae3e5a5&units=metric`
        );
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${submittedValue}&appid=d1440630b41bfa9d5aa53f7c0ae3e5a5&units=metric`
        );
        setWeatherResponse(weatherResponse.data.name);
        const filteredData = response.data.list.filter(
          (item) => new Date(item.dt_txt).getHours() === 9
        );
        const { city } = response.data;
        setCityData(city);
        setForecast(filteredData);
        for (let index = 0; index < filteredData.length; index++) {
          switchimages(filteredData[index].weather[0].main.toLowerCase());
        }
        const todayDate = new Date().toLocaleDateString();
        const todayForecast = response.data.list.find(
          (item) => new Date(item.dt_txt).toLocaleDateString() === todayDate
        );

        if (todayForecast) {
          setTodayWeather(todayForecast);
        }
      } catch (error) {
        console.log("Error fetching the weather forecast:", error);
      }
    };

    FetchForecast();
  }, [latitude, longitude]);

  const formatTime = (timestamp, timezoneOffset) => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString();
  };
  const switchimages = (src) => {
    switch (src.toLowerCase()) {
      case "clear":
        return clear;
      case "rain":
        return rain;
      case "sun":
        return sun;
      case "clouds":
        return cloud;
      case "snow":
        return snow;
      default:
        return mist;
    }
  };

  return (
    <div className="weather-container">
      <div className="main-content">
        <Search onSubmit={setSubmittedValue} />
        {cityData && <TemperatureToggle onToggle={handleToggleUnit} />}
        {todayWeather && (
          <div className="weather-card shadow-box">
            <h3 className="city-name">{weatherResponse}</h3>
            <div>
              <p>{new Date(todayWeather.dt * 1000).toLocaleDateString()}</p>
              <img
                src={switchimages(todayWeather.weather[0].main)}
                className="todayweatherimage"
                alt="img1"
              />
              <p className="temperature">
                Temperature: {displayTemp(todayWeather.main.temp).toFixed(1)}°
                {tempUnit === "Celsius" ? "C" : "F"}
              </p>
              <p>
                Feels Like:{" "}
                {displayTemp(todayWeather.main.feels_like).toFixed(1)}°
              </p>
            </div>
            <div className="box">
              <div>
                <p>Weather: {todayWeather.weather[0].description}</p>
                <p>Humidity: {todayWeather.main.humidity}%</p>
                <p>Pressure: {todayWeather.main.pressure} hPa</p>
              </div>
              <div>
                <p>
                  Max Temp: {displayTemp(todayWeather.main.temp_max).toFixed(1)}
                  °
                </p>
                <p>
                  Min Temp: {displayTemp(todayWeather.main.temp_min).toFixed(1)}
                  °
                </p>
              </div>
              {cityData && (
                <div className="additional-info">
                  <p>Timezone: UTC {cityData.timezone / 3600}</p>
                  <p>
                    Sunrise: {formatTime(cityData.sunrise, cityData.timezone)}
                  </p>
                  <p>
                    Sunset: {formatTime(cityData.sunset, cityData.timezone)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="forecast-section">
        {forecast && <h3 className="forecast-heading">5-Day Forecast</h3>}
        <div className="forecast-cards">
          {forecast &&
            forecast.map((item, index) => (
              <div className="forecast-card shadow-box" key={index}>
                <p>{new Date(item.dt * 1000).toLocaleDateString()}</p>
                <img
                  src={switchimages(item.weather[0].main)}
                  className="todayweatherimage"
                  alt="img1"
                />
                <p>Temp: {displayTemp(item.main.temp).toFixed(1)}°</p>
                <p>Max: {displayTemp(item.main.temp_max).toFixed(1)}°</p>
                <p>Min: {displayTemp(item.main.temp_min).toFixed(1)}°</p>
                <p>{item.weather[0].description}</p>
                <p>Humidity: {item.main.humidity}%</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
