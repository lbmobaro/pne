const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // For handling file uploads
const fetch = require('node-fetch');
const app = express();

app.use(bodyParser.json());

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage });

// Define the generateDescription function on the server-side
function generateDescription(req) {
    // Get values from req.body
    const name = req.body.name;
    const department = req.body.department;
    const description = req.body.description;
    const siteContact = req.body.siteContact;
    const startDate = req.body.startDate;
    const completionDate = req.body.completionDate;
    const glCode = req.body.glCode;
    const costCenterCode = req.body.costCenterCode;
    const costUnitCode = req.body.costUnitCode;
    const projectCode = req.body.projectCode;
    const projectBudget = req.body.projectBudget;

    // Create the description with bold titles and input values
    const formattedDescription = `
        Name: ${name}
        Department: ${department}
        Description: ${description}
        Site Contact: ${siteContact}
        Start Date: ${startDate}
        End Date: ${completionDate}
        GL Code: ${glCode}
        Cost Center Code: ${costCenterCode}
        Cost Unit Code: ${costUnitCode}
        Project Code: ${projectCode}
        Project Budget: ${projectBudget}
    `;

    return formattedDescription;
}

app.post("/api/sendToMobaro", upload.single("attachment"), async (req, res) => {
    // Call generateDescription with the req object to get the formatted description
    const newDescription = generateDescription(req);

    const projectData = {
        name: req.body.description,
        description: newDescription,
        assignee: "users/112899-C",
        start: req.body.startDate,
        end: req.body.completionDate,
        target: "locations/109477-A",
        attachments: req.file ? [req.file.buffer.toString("base64")] : [], // Convert file to base64 if available
    };

    // Prepare headers for the Mobaro API request
    const headers = {
        "x-api-key": process.env.MOBARO_API_KEY, // Use your API key stored in environment variables
        "Content-Type": "application/json",
    };

    // Perform the POST request to the Mobaro API
    try {
        const response = await fetch("https://app.mobaro.com/api/customers/assignments", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(projectData),
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
