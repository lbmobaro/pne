const express = require("express");
const fetch = require("node-fetch"); // Import the 'node-fetch' library

const app = express();
const PORT = process.env.PORT || 3000;

// Define your Mobaro API key (replace with your actual API key)
const MOBARO_API_KEY = "your_api_key_here";

app.use(express.json());

// Create an endpoint to fetch locations data
app.get("/api/getLocations", async (req, res) => {
  try {
    // Prepare headers for the Mobaro API request, including the 'x-api-key'
    const headers = {
      "x-api-key": MOBARO_API_KEY,
      "Content-Type": "application/json",
    };

    // Fetch Locations data from Mobaro API
    const response = await fetch("https://app.mobaro.com/api/customers/locations", {
      method: "GET",
      headers: headers,
    });

    if (response.ok) {
      const locationsData = await response.json();
      res.json(locationsData); // Send the location data to the client
    } else {
      // Handle error responses from Mobaro API
      const responseBody = await response.text();
      console.error(`Error response from Mobaro API: ${response.status} ${response.statusText}`);
      console.error(`Response Body: ${responseBody}`);
      res.status(response.status).json({ error: "Error fetching location data from Mobaro." });
    }
  } catch (error) {
    // Handle any network or request errors
    console.error("Error fetching location data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
