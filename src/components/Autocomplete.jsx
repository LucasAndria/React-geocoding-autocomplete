import React, { useState, useEffect, useRef } from "react";
import styles from "../autocomplete.module.css";
import { api_openrouteservice } from "../assets/API_calls";

const AutocompleteInput = ({ children, getSelected }) => {
  const containerRef = useRef(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const [error, setError] = useState(null);
  const [autocomplete_response, setAutocomplete_response] = useState([]);
  const [isSelectedText, setIsSelectedText] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  /* for the waiting before calling the API */
  const [autocomplete_timeout, setAutocomplete_timeout] = useState(null);

  // useEffect when there is an input
  useEffect(() => {
    /* get away of the extra space */
    const value = inputValue.trim();

    /* remove the error */
    setError(null);

    if (autocomplete_timeout) clearTimeout(autocomplete_timeout);

    if (value === "" || isSelectedText)
      return setIsSelectedText(false), setAutocomplete_response([]);

    const new_autocomplete_timeout = setTimeout(async () => {
      const response = await api_openrouteservice(value);
      response.statusText === "success"
        ? setAutocomplete_response(response.data.features)
        : setError(response);
    }, 1000);

    setAutocomplete_timeout(new_autocomplete_timeout);
  }, [inputValue]);

  // function when an option is selected
  useEffect(() => {
    if (selectedValue) {
      setInputValue(selectedValue.label);
      getSelected(selectedValue);
      setIsSelectedText(false);
    }
  }, [selectedValue]);

  // Select the first element when open
  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  // handle the opening of the liste or error
  useEffect(() => {
    if (error !== null || autocomplete_response.length !== 0)
      return setIsOpen(true);

    setIsOpen(false);
  }, [error, autocomplete_response]);

  /* Adding keyboard manipulation */
  useEffect(() => {
    const keyHandler = (e) => {
      if (e.target.parentNode !== containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          if (!isOpen) break;
          setSelectedValue(autocomplete_response[highlightedIndex]);
          setIsOpen(false);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) break;
          const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < autocomplete_response.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", keyHandler);

    /* remove the eventListener when the component is unmounted */
    return () => {
      containerRef.current?.removeEventListener("keydown", keyHandler);
    };
  }, [isOpen, highlightedIndex, autocomplete_response]);

  // Component used to display error
  const Error = () => {
    return (
      <li
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
        className={`${styles.option} ${styles.error}`}
      >
        {error.message}
      </li>
    );
  };

  /* Component used for the liste */
  const Listes = () => {
    return (
      <>
        {autocomplete_response?.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              setSelectedValue(option);
              setIsOpen(false);
            }}
            key={option.id}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`${styles.option} ${
              index === highlightedIndex ? styles.highlighted : ""
            }`}
          >
            {option.label}
          </li>
        ))}
      </>
    );
  };

  return (
    <div
      ref={containerRef}
      onBlur={(e) =>
        e.relatedTarget !== containerRef.current && setIsOpen(false)
      } // Excécute a fonction when somewhere else is clicked
      tabIndex={0} // To enable the unFocus style when somewhere else is clicked
      className={styles.container}
    >
      {React.cloneElement(children, {
        value: inputValue,
        onChange: (e) => setInputValue(e.target.value),
      })}
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {error ? <Error /> : <Listes />}
      </ul>
    </div>
  );
};

export default AutocompleteInput;
