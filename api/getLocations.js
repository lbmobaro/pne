const fetch = require("node-fetch");

module.exports = async (event, context) => {
  try {
    const headers = {
      "x-api-key": process.env.MOBARO_API_KEY,
    };

    const response = await fetch("https://app.mobaro.com/api/customers/locations", {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    const locationsData = await response.json();

    // Create a mapping between name and ID
    const nameToIdMap = {};
    locationsData.items.forEach((location) => {
      nameToIdMap[location.name] = location.id;
    });

    // Retrieve the selected location name from the request (modify as needed)
    const selectedLocationName = event.queryStringParameters.target;

    // Use the name-to-ID mapping to get the corresponding ID
    const selectedLocationId = nameToIdMap[selectedLocationName];

    return {
      statusCode: 200,
      body: JSON.stringify({ target: selectedLocationId }), // Return the ID as the target
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
