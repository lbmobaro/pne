const fetch = require("node-fetch");

exports.handler = async (event, context) => {
    try {
        const headers = {
            "x-api-key": process.env.MOBARO_API_KEY
        };

        const allLocations = [];

        let offset = 0;
        let total = 0;
        let amount = 0;

        do {
            // Fetch location data from Mobaro API with the current offset
            const response = await fetch(`https://app.mobaro.com/api/customers/locations?offset=${offset}`, {
                method: "GET",
                headers: headers,
            });

            if (!response.ok) {
                throw new Error(`Error fetching location data: ${response.statusText}`);
            }

            const responseData = await response.json();

            if (responseData.items) {
                // Extract and push `id` and `name` properties from each item to allLocations
                responseData.items.forEach((item) => {
                    allLocations.push({
                        id: item.id,
                        name: item.name,
                    });
                });
            }

            // Update pagination variables
            total = responseData.total;
            amount = responseData.amount;
            offset += amount;
        } while (offset < total);

        return {
            statusCode: 200,
            body: JSON.stringify(allLocations),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
