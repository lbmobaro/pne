const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer"); // For handling file uploads
const app = express();

app.use(bodyParser.json());

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage });

app.post("/api/sendToMobaro", upload.single("attachment"), (req, res) => {
    const projectData = JSON.parse(req.body.projectData);

    // Access uploaded file data from req.file
    const attachmentData = req.file;

    // Here, you can implement the logic to send projectData and attachmentData to Mobaro using an API
    // Example: Send projectData and attachmentData to Mobaro's API

    // Respond to the client
    res.json({ message: "Project data and file sent to Mobaro successfully!" });
});

const port = process.env.PORT || 3000; // Use the port defined in environment variables or default to 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
