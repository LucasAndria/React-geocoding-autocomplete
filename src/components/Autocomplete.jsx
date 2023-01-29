import React, { useState, useEffect, useRef } from "react";
import styles from "../autocomplete.module.css";
import { api_openrouteservice } from "../assets/API_calls";

const AutocompleteInput = ({ children }) => {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  /* 
  autocomplete_response = {
    coordinates: [23.406583, 54.66178],
    id: "relation/6251178",
    label: "Antanavo tv, MA, Lituanie",
    name: "Antanavo tv",
  }; 
  */
  const [autocomplete_response, setAutocomplete_response] = useState([]);
  const [inputValue, setInputValue] = useState("");

  /* for the waiting before calling the API */
  const [autocomplete_timeout, setAutocomplete_timeout] = useState(null);

  useEffect(() => {
    /* get away of the extra space */
    const value = inputValue.trim();

    /* remove the error */
    setError(null);

    if (autocomplete_timeout) clearTimeout(autocomplete_timeout);

    if (value === "") return setAutocomplete_response([]);

    const new_autocomplete_timeout = setTimeout(async () => {
      const response = await api_openrouteservice(value);

      response.statusText === "success"
        ? setAutocomplete_response(response.data.features)
        : setError(response);
    }, 1000);

    setAutocomplete_timeout(new_autocomplete_timeout);
  }, [inputValue]);

  return (
    <div ref={containerRef}>
      {React.cloneElement(children, {
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
      })}
      {error ? (
        <div>{error.message}</div>
      ) : (
        autocomplete_response?.map((response) => (
          <div key={response.id} onClick={() => console.log(response)}>
            {response.label}
          </div>
        ))
      )}
    </div>
  );
};

export default AutocompleteInput;
