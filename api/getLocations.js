let fetch;
import('node-fetch').then(module => {
    fetch = module.default;
});

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
      console.error(`Error fetching location data: ${response.status} ${response.statusText}`);
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error fetching location data' }),
      };
    }

    const locationsData = await response.json();
    const nameToIdMap = {};

    locationsData.items.forEach(location => {
      nameToIdMap[location.name] = location.id;
    });

    const selectedLocationName = event.queryStringParameters.target;
    const selectedLocationId = nameToIdMap[selectedLocationName];

    return {
      statusCode: 200,
      body: JSON.stringify({ target: selectedLocationId }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
