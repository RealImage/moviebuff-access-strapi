import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const TheatreSearchField = ({ value, onChange, name }) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inputValue.length > 2) {
      fetchTheatreOptions(inputValue);
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const fetchTheatreOptions = async (query) => {
    setIsLoading(true);
    setOptions([]); // Clear previous options before making a new request
    try {
      let response = {};
      if (query.includes("city:") || query.includes("City:")) {
        response = await axios.get(
          `https://dimensions.qubewire.com/v1/facilities/search?&tag=address.city.name:${
            query.split(":")[1]
          }&ps=150&offset=`,
          {
            headers: {
              Authorization: "Bearer a53df5a2-620e-4e7d-bc68-195ba44b843c",
            },
          }
        );
      } else if (query.includes("id:") || query.includes("ID:")) {
        response = await axios.get(
          `https://dimensions.qubewire.com/v1/facilities/search?q=${query}&tag=id:${
            query.split(":")[1]
          }&ps=150&offset=`,
          {
            headers: {
              Authorization: "Bearer a53df5a2-620e-4e7d-bc68-195ba44b843c",
            },
          }
        );
      } else {
        response = await axios.get(
          `https://dimensions.qubewire.com/v1/facilities/search?q=${query}&tag=alternateNames:${query}&ps=150&offset=`,
          {
            headers: {
              Authorization: "Bearer a53df5a2-620e-4e7d-bc68-195ba44b843c",
            },
          }
        );
      }
      var formattedOptions = [];
      try {
        // console.log(`response of ${query}`, response.data.data);
        console.log(`response of ${query}`, response.data.data.length);
        formattedOptions = response.data.data.map((theatre) => ({
          value: theatre.id || null,
          label: theatre.address
            ? `${theatre.name} - ${theatre.address.city.name}`
            : theatre.name,
          description: theatre.name || null,
          address: theatre.address || null,
          auditoriums: theatre.auditoriums || [],
          name: theatre.name || [],
          city: theatre.address ? theatre.address.city.name : "",
        }));
        setOptions(
          formattedOptions.sort((a, b) => a.city.localeCompare(b.city))
        );
      } catch (error) {
        console.log(error);
      }
      console.log(`options in state for ${query}`, options);
      setIsLoading(false);
    } catch (error) {
      console.log("Error fetching theatre names:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  const handleChange = (selectedOption) => {
    if (selectedOption) {
      selectedOption.auditoriums.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );
      const screen_details = selectedOption.auditoriums.map(
        (screen, index) => ({
          audio_device_active_status: false,
          __temp_key__: index,
          name: screen.name,
          screen_id: screen.id,
        })
      );
      onChange({ target: { name, value: selectedOption.label } });
      onChange({
        target: { name: "description", value: selectedOption.description },
      });
      onChange({
        target: { name: "theatre_name", value: selectedOption.name },
      });
      onChange({
        target: { name: "country", value: selectedOption.address.country.name },
      });
      onChange({
        target: { name: "city", value: selectedOption.address.city.name },
      });
      onChange({
        target: {
          name: "province",
          value: selectedOption.address.province.name,
        },
      });
      onChange({
        target: { name: "theatre_display_name", value: selectedOption.name },
      });
      onChange({ target: { name: "theatre_id", value: selectedOption.value } });
      onChange({ target: { name: "Screens", value: screen_details } });
      setInputValue(selectedOption.label);
    } else {
      onChange({ target: { name, value: "" } });
      onChange({ target: { name: "description", value: "" } });
      onChange({ target: { name: "theatre_name", value: "" } });
      onChange({ target: { name: "theatre_display_name", value: "" } });
      onChange({ target: { name: "country", value: "" } });
      onChange({ target: { name: "city", value: "" } });
      onChange({ target: { name: "province", value: "" } });
      onChange({ target: { name: "theatre_id", value: "" } });
      // setInputValue("");
    }
  };

  // Custom styles for react-select components
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(50, 50, 77)",
      color: "white",
      border: "none",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(50, 50, 77)",
      color: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgb(50, 50, 77)" : "rgb(24, 24, 38)",
      color: "white",
    }),
  };

  return (
    <div>
      <label
        htmlFor={name}
        style={{
          color: "white",
          fontSize: "0.75rem",
          marginBottom: "10px",
          display: "block",
        }}
      >
        Theatre Search
      </label>
      <Select
        inputId={name}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        options={options}
        isLoading={isLoading}
        onChange={handleChange}
        placeholder="Search theatre"
        noOptionsMessage={() =>
          inputValue.length > 2 ? "No results found" : "Type to search"
        }
        styles={customStyles}
      />
    </div>
  );
};

export default TheatreSearchField;
