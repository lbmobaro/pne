// server.js

import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// POST route to create a file in Mobaro
app.post('/api/createMobaroFile', async (req, res) => {
  try {
    // Ensure you have the MOBARO_API_KEY stored securely in your environment variables
    const mobaroApiKey = process.env.MOBARO_API_KEY;

    // Check if the API key is available
    if (!mobaroApiKey) {
      return res.status(500).json({ error: 'MOBARO_API_KEY is not configured.' });
    }

    // You can use req.body to get data from the client (e.g., file data and metadata)
    const fileData = req.body.fileData;
    const metadata = req.body.metadata;

    // Make a request to create the file in Mobaro
    const createFileResponse = await fetch('https://app.mobaro.com/api/customers/files/create', {
      method: 'POST',
      headers: {
        'x-api-key': mobaroApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileData, metadata }),
    });

    if (createFileResponse.ok) {
      // Parse the response and send the file identifier (e.g., file ID) back to the client
      const fileData = await createFileResponse.json();
      const fileIdentifier = fileData.fileIdentifier;

      res.json({ fileIdentifier });
    } else {
      const errorMessage = await createFileResponse.text();
      res.status(createFileResponse.status).json({ error: errorMessage });
    }
  } catch (error) {
    console.error('Error creating file in Mobaro:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
