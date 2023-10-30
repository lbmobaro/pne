import fetch from 'node-fetch';

import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';

const app = express();

const upload = multer();

app.use(bodyParser.json());

app.post("/api/sendToMobaro", upload.single("attachments"), async (req, res) => {
    try {
        console.log("Received POST request to /api/sendToMobaro with body:", req.body);

        const projectData = {
            name: req.body.userDescription,
            description: req.body.formattedDescription,
            assignees: ["users/112899-C"],
            target: req.body.locationId, // Use locationId from the form data
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

        console.log("Received response from Mobaro API:", response.status, response.statusText, responseBody);

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
