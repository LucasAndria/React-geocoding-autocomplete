import axios from "axios";

function handleError(err) {
  if (err.message === "Network Error") {
    return {
      handledError: true,
      statusText: "fail",
      message: "unable to connect !",
    };
  }

  return {
    handledError: false,
    statusText: "fail",
    message: "Error occured !",
  };
}

async function openrouteservice(text) {
  try {
    /* Call the openrouteservice api to get the geocoding with the text */
    const res = await axios({
      method: "GET",
      url: `https://api.openrouteservice.org/geocode/autocomplete?api_key=${
        import.meta.env.VITE_OPEN_ROUTE_SERVICE_KEY
      }&text=${text}`,
    });

    const data = res?.data;

    /* filter the data that are needed */
    const features = data?.features.map((feature) => {
      if (feature.geometry.type !== "Point") {
        return {
          geometry: feature.geometry,
          label: feature.properties.label,
          name: feature.properties.name,
          id: feature.properties.id,
        };
      }
      return {
        coordinates: feature.geometry.coordinates,
        label: feature.properties.label,
        name: feature.properties.name,
        id: feature.properties.id,
      };
    });

    return { features, bbox: data?.bbox, text: data?.geocoding?.query?.text };
  } catch (err) {
    return handleError(err);
  }
}

export { openrouteservice };
