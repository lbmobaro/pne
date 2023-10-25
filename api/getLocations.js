const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  try {
    let offset = 0;
    let allLocations = [];

    while (true) {
      // Fetch Locations data from Mobaro API with the current offset
      const response = await fetch(`https://app.mobaro.com/api/customers/locations?offset=${offset}`);
      const locationsData = await response.json();

      if (locationsData.length === 0) {
        // No more data, break the loop
        break;
      }

      allLocations = allLocations.concat(locationsData);
      offset += 128; // Increase offset for the next request
    }

    return {
      statusCode: 200,
      body: JSON.stringify(allLocations),
    };
  } catch (error) {
    console.error("Error fetching Locations data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
