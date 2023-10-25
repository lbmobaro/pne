const fetchLocations = async (offset, limit) => {
  const headers = {
    "x-api-key": process.env.MOBARO_API_KEY,
  };

  const response = await fetch(`https://app.mobaro.com/api/customers/locations?offset=${offset}&limit=${limit}`, {
    method: "GET",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error(`Error fetching location data: ${response.statusText}`);
  }

  const locationsData = await response.json();

  return locationsData.items; // Return only the locations
};

module.exports = async (event, context) => {
  try {
    const allLocations = [];
    let offset = 0;
    const limit = 128; // Adjust the limit as needed

    // Fetch locations in chunks until all are retrieved
    while (true) {
      const locationsChunk = await fetchLocations(offset, limit);

      if (locationsChunk.length === 0) {
        // No more locations to fetch
        break;
      }

      allLocations.push(...locationsChunk);
      offset += limit;
    }

    // Now you have all locations in the allLocations array
    // Create a mapping between name and ID
    const nameToIdMap = {};
    allLocations.forEach((location) => {
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
