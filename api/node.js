const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // For handling file uploads
const fetch = require("node-fetch"); // For making HTTP requests
const app = express();

app.use(bodyParser.json());

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage });

app.post("/api/sendToMobaro", upload.single("attachment"), async (req, res) => {
    const projectData = JSON.parse(req.body.projectData);

    // Access uploaded file data from req.file
    const attachmentData = req.file;

    // Prepare headers for the Mobaro API request
    const headers = {
        "x-api-key": process.env.MOBARO_API_KEY, // Use your API key stored in environment variables
        "Content-Type": "application/json",
    };

    // Prepare the data to be sent to the Mobaro API
    const mobaroData = {
        name: projectData.name,
        description: projectData.description,
        assignees: [/* Include assignee data here if available */],
        target: projectData.target,
        priority: projectData.priority,
        start: projectData.startDate,
        end: projectData.completionDate,
        categories: [/* Include categories data here if available */],
        attachments: [/* Include file data here if available */],
    };

    // Perform the POST request to the Mobaro API
    try {
        const response = await fetch("https://app.mobaro.com/api/customers/assignments", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(mobaroData),
        });

        if (response.ok) {
            // Success response from Mobaro API
            res.json({ message: "Project data and file sent to Mobaro successfully!" });
        } else {
            // Error response from Mobaro API
            const errorMessage = await response.text();
            res.status(response.status).json({ error: errorMessage });
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

