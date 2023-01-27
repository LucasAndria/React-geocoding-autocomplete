import { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "../autocomplete.module.css";

const AutocompleteInput = () => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  function isOptionSelected(option) {
    return option === 1;
  }

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      onClick={() => inputRef.current.focus()}
      onBlur={() => setIsOpen(false)} // Excécute a fonction when somewhere else is clicked
      tabIndex={0} // To enable the unFocus style when somewhere else is clicked
      className={styles.container}
    >
      <input ref={inputRef} type="text" className={styles.value} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current.value = "";
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {[
          { label: "one", value: 1 },
          { label: "two", value: 2 },
        ].map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              console.log(`${option} has been selected`);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={option.value}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${index === highlightedIndex ? styles.highlighted : ""}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteInput;
