module.exports = {
  "custom-dashboard": {
    enabled: true,
    resolve: "./src/plugins/custom-dashboard",
  },
  "theatre-search": {
    enabled: true,
    resolve: "./src/plugins/theatre-search",
  },
  "location-plugin": {
    enabled: true,
  },
  "location-field": {
    enabled: true,
    config: {
      // fields: ["movies", "theatres"], // optional
      // You need to enable "Autocomplete API" and "Places API" in your Google Cloud Console
      googleMapsApiKey: "AIzaSyAjU0xmpkWIkzz8nRldFsqVh-qAn5hfBNs",
      // See https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
      autocompletionRequestOptions: {
        language: "es",
        locationBias: "IP_BIAS",
      },
    },
  },
};
