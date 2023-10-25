const fetch = require("node-fetch");

module.exports = async (event, context) => {
  try {
    const headers = {
      "x-api-key": process.env.MOBARO_API_KEY,
    };

    // Array to hold the promises for fetching location data
    const locationPromises = [];

    // Define the offsets and the number of requests you want to make in parallel
    const numRequests = 5; // You can adjust this number as needed
    for (let offset = 0; offset < numRequests * 128; offset += 128) {
      // Push each promise into the array
      locationPromises.push(
        fetch(`https://app.mobaro.com/api/customers/locations?offset=${offset}`, {
          method: "GET",
          headers: headers,
        })
      );
    }

    // Use Promise.all to wait for all requests to complete
    const responses = await Promise.all(locationPromises);

    // Process the responses and aggregate the data
    const locationsData = [];
    for (const response of responses) {
      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }
      const locationData = await response.json();
      locationsData.push(...locationData.items);
    }

    // Create a mapping between name and ID
    const nameToIdMap = {};
    locationsData.forEach((location) => {
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
