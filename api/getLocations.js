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

    // Check the Content-Type of the response
    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else if (contentType && contentType.includes("text/plain")) {
      responseData = await response.text();
      console.log(`Received plain text response: ${responseData}`);
      // Handle the plain text data as necessary. For example, you might decide to log it, or send it back to the client.
      // For the sake of this example, we'll return early:
      return {
        statusCode: 200,
        body: responseData
      };
    } else {
      throw new Error(`Unhandled response content type: ${contentType || "unknown"}`);
    }

    const nameToIdMap = {};
    responseData.items.forEach(location => {
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
