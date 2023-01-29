import React, { useState, useEffect, useRef } from "react";
import styles from "../autocomplete.module.css";
import { openrouteservice } from "../assets/API_calls";

const AutocompleteInput = ({ children }) => {
  const containerRef = useRef(null);
  const [autocomplete_response, setAutocomplete_response] = useState([]);

  // autocomplete_response = [{label: "", value: ""}];
  let autocomplete_timeout;

  const handleChange = (e) => {
    const value = e.target.value;
    if (value === "") return;
    if (autocomplete_timeout) clearTimeout(autocomplete_timeout);

    autocomplete_timeout = setTimeout(async () => {
      const response = await openrouteservice(value);
      console.log("called");
      setAutocomplete_response(response.features);
    }, 300);
  };

  return (
    <div ref={containerRef}>
      {React.cloneElement(children, { onChange: handleChange })}
      {autocomplete_response.map((response) => (
        <div key={response.id} onClick={() => console.log(response)}>
          {response.label}
        </div>
      ))}
    </div>
  );
};

export default AutocompleteInput;
