const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    try {
        const headers = {
            "x-api-key": process.env.MOBARO_API_KEY
            "Content-Type": "application/json",
        };

        const response = await fetch("https://app.mobaro.com/api/customers/locations", {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Error fetching location data: ${response.statusText}`);
        }

        const locationsData = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(locationsData),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
