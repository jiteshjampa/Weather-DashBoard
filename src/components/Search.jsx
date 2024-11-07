import React, { useState } from "react";
import search from "../assets/search.gif";
import { FaSearch } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
const Search = ({ onSubmit }) => {
  const [city, setCity] = useState("");

  const handleSubmit = () => {
    if (city) {
      onSubmit(city); // Pass the city name to the parent component

      // Save the city to local storage as the last searched city
      localStorage.setItem("lastSearchedCity", city);
    }
  };

  return (
    <div>
      <div className="topbox">
        <input
          type="text"
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          className="search"
        />
        <div className="add-button-container">
          <button className="search-btn" onClick={handleSubmit}>
            <FaSearch className="search-icon" />
          </button>
        </div>
      </div>
      <p className="searched-city">
        The last Searched City <MdHistory className="history" />{" "}
        {localStorage.getItem("lastSearchedCity")}
      </p>
    </div>
  );
};

export default Search;
