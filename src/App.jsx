import { useState } from "react";
import Autocomplete from "./components/Autocomplete";

function App() {
  const [selectedValue, setSelectedValue] = useState(null);

  console.log("App : ", selectedValue);
  return (
    <Autocomplete getSelected={setSelectedValue}>
      <input type="text" />
    </Autocomplete>
  );
}

export default App;
