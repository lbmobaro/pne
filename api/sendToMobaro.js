const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();

app.use(bodyParser.json());

app.post("/api/sendToMobaro", async (req, res) => {
    try {
        const projectData = {
            name: req.body.userDescription,
            description: req.body.formattedDescription,
            assignees: ["users/112899-C"],
            target: req.body.location.id,
            priority: req.body.highPriority,
            start: new Date(req.body.startDate).toISOString(),
            end: new Date(req.body.completionDate).toISOString(),
            attachments: req.file ? [req.file.buffer.toString("base64")] : [],
        };

        console.log("Sending projectData to Mobaro API:", projectData);

        // Prepare headers for the Mobaro API request
        const headers = {
            "x-api-key": process.env.MOBARO_API_KEY, // Use your API key stored in environment variables
            "Content-Type": "application/json",
        };

        // Perform the POST request to the Mobaro API
        const response = await fetch("https://app.mobaro.com/api/customers/assignments", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(projectData),
        });

        const locationResponse = await fetch("https://app.mobaro.com/api/customers/locations", {
            method: "GET",
            headers: headers,
        });

        const responseBody = await response.text(); // Read the response as text

        if (response.ok) {
            // Success response from Mobaro API
            res.json({ message: "Project data sent to Mobaro successfully!" });
        } else {
            // Error response from Mobaro API
            console.error(`Error response from Mobaro API: ${response.status} ${response.statusText}`);
            console.error(`Response Body: ${responseBody}`);

            // Send an error response to the client
            res.status(response.status).json({ error: "Error sending project data to Mobaro." });
        }
    } catch (error) {
        // Handle any network or request errors
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const port = process.env.PORT || 3000; // Use the port defined in environment variables or default to 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
