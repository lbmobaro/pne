import fetch from 'node-fetch';

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();

const upload = multer(); // Use multer's memory storage for handling file uploads

app.use(bodyParser.json());

app.post("/api/sendToMobaro", upload.single("attachments"), async (req, res) => {
    try {
        const projectData = {
            name: req.body.userDescription,
            description: req.body.formattedDescription,
            assignees: ["users/112899-C"],
            // Assuming you'll send the location's name and then fetch its ID server-side
            // (You might need to adjust this part if you intend to send the ID directly)
            target: req.body.locationName, // Adjust this as per your requirements
            priority: req.body.highPriority,
            start: new Date(req.body.startDate).toISOString(),
            end: new Date(req.body.completionDate).toISOString(),
            attachments: req.file ? [req.file.buffer.toString("base64")] : [],
        };

        console.log("Sending projectData to Mobaro API:", projectData);

        const headers = {
            "x-api-key": process.env.MOBARO_API_KEY,
            "Content-Type": "application/json",
        };

        const response = await fetch("https://app.mobaro.com/api/customers/assignments", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(projectData),
        });

        const responseBody = await response.text();

        if (response.ok) {
            res.json({ message: "Project data sent to Mobaro successfully!" });
        } else {
            console.error(`Error response from Mobaro API: ${response.status} ${response.statusText}`);
            console.error(`Response Body: ${responseBody}`);
            res.status(response.status).json({ error: "Error sending project data to Mobaro." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
