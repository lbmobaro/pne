const fetch = require("node-fetch");

module.exports = async (event, context) => {
  try {
    const headers = {
      "x-api-key": process.env.MOBARO_API_KEY,
    };

    const offset = event.queryStringParameters.offset || 0; // Get offset from query parameters (default to 0)
    const limit = event.queryStringParameters.limit || 128; // Get limit from query parameters (default to 128)

    const response = await fetch(`https://app.mobaro.com/api/customers/locations?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    const locationsData = await response.json();

    // Create an array to hold location objects with name and id
    const locationList = locationsData.items.map((location) => ({
      name: location.name,
      id: location.id,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(locationList), // Return an array of location objects
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
