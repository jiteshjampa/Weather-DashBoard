import React, { useState, useEffect } from "react";
import axios from "axios";
import clear from "../assets/clear-sky.png";
import rain from "../assets/rain.gif";
import sun from "../assets/sun.gif";
import cloud from "../assets/clouds.gif";
import snow from "../assets/snow.gif";
import mist from "../assets/mist.png";
import { IoIosAddCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";

const Favorites = () => {
  const [newCity, setNewCity] = useState("");
  const [favorites, setFavorites] = useState([]);
  const weatherApiKey = "d1440630b41bfa9d5aa53f7c0ae3e5a5";
  const jsonServerUrl = "http://localhost:3001/favorites";

  // Fetch favorites from JSON server on component mount and when changes are made
  const fetchFavorites = async () => {
    try {
      const response = await axios.get(jsonServerUrl);
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Add a city to favorites
  const addCityToFavorites = async () => {
    if (!newCity) return;

    // Check if city is already in favorites
    const isCityAlreadyFavorite = favorites.some(
      (city) => city.name.toLowerCase() === newCity.toLowerCase()
    );
    if (isCityAlreadyFavorite) {
      alert("City is already in favorites.");
      return;
    }

    try {
      // Fetch weather data for the new city
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${weatherApiKey}&units=metric`
      );

      const cityData = {
        id: new Date().getTime(), // Unique ID for JSON server
        name: newCity,
        weather: weatherResponse.data,
      };

      // Add city to JSON server and fetch updated favorites list
      await axios.post(jsonServerUrl, cityData);
      setNewCity(""); // Clear input field
      fetchFavorites(); // Fetch updated list after adding
    } catch (error) {
      console.error("Error adding city:", error);
      alert("City not found. Please try again.");
    }
  };

  // Remove a city from favorites
  const removeCityFromFavorites = async (cityName) => {
    try {
      const city = favorites.find((fav) => fav.name === cityName);
      if (city && city.id) {
        await axios.delete(`${jsonServerUrl}/${city.id}`);
        fetchFavorites(); // Fetch updated list after deletion
      }
    } catch (error) {
      console.error("Error removing city:", error);
    }
  };

  // Select image based on weather condition
  const imageSelector = (condition) => {
    switch (condition.toLowerCase()) {
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
        return mist; // Default image
    }
  };

  return (
    <div className="favorites-container">
      <h2>Your Favorite Cities</h2>

      {/* Add City Section */}
      <div className="add-city">
        <input
          type="text"
          placeholder="Add a city"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <button onClick={addCityToFavorites} className="add-button">
          <IoIosAddCircle className="add-icon" />
        </button>
      </div>

      {/* Favorites List */}
      <div className="favorites-list">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="favorite-city shadow-box">
            <h3>{favorite.name}</h3>
            <img
              src={imageSelector(favorite.weather.weather[0].main)}
              alt={favorite.weather.weather[0].main}
              className="weather-icon"
            />
            <p>Temperature: {favorite.weather.main.temp}°C</p>
            <p>Weather: {favorite.weather.weather[0].description}</p>
            <button
              onClick={() => removeCityFromFavorites(favorite.name)}
              className="delete-button"
            >
              <MdDelete className="delete-icon" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
