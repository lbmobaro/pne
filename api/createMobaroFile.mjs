import express from 'express';
import multer from 'multer';
import fetch from 'node-fetch';

const app = express();
const upload = multer();

app.use(express.json());

app.post("/api/sendFileToMobaro", upload.single("fileData"), async (req, res) => {
  try {
    const fileData = req.file; // This contains the uploaded file data
    const mobaroApiUrl = 'https://app.mobaro.com/api/customers/files/create'; // Replace with Mobaro API URL
    const mobaroApiKey = process.env.MOBARO_API_KEY;

    if (!fileData) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Convert the file buffer to a binary string
    const fileBinaryString = fileData.buffer.toString("binary");

    // Construct the headers for the Mobaro API request
    const headers = {
      "x-api-key": mobaroApiKey,
      "Content-Type": "application/json",
    };

    // Construct the request body for creating the file in Mobaro
    const mobaroFileData = {
      file: fileBinaryString,
      filename: fileData.originalname, // Include the filename if needed
      // Add any other required fields here
    };

    // Send the file to Mobaro
    const response = await fetch(mobaroApiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(mobaroFileData),
    });

    if (response.ok) {
      // File successfully sent to Mobaro
      res.json({ message: "File sent to Mobaro successfully!" });
    } else {
      const responseBody = await response.text();
      console.error(`Error response from Mobaro API: ${response.status} ${response.statusText}`);
      console.error(`Response Body: ${responseBody}`);
      res.status(response.status).json({ error: "Error sending file to Mobaro." });
    }
  } catch (error) {
    console.error("Error sending file to Mobaro:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
