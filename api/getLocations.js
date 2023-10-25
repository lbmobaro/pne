const fetch = require("node-fetch");

module.exports = async (req, res) => {
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

        // Sort the locations alphabetically by the `name` property
        allLocations.sort((a, b) => a.name.localeCompare(b.name));

        res.status(200).json(allLocations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
