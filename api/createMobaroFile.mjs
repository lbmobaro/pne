// serverSide.js

import fetch from 'node-fetch';

export async function createMobaroFile(fileBuffer, fileName) {
  try {
    // Generate a unique boundary string
    const boundary = `------------------------${Math.random().toString(16)}`;

    // Construct the body payload as a Buffer
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="File"; filename="${fileName}"\r\n`),
      Buffer.from('Content-Type: application/octet-stream\r\n\r\n'),
      Buffer.from(fileBuffer),
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);

    // Construct the headers for the request, including API key
    const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'x-api-key': process.env.MOBARO_API_KEY,
    };

    // Send the request to Mobaro
    const response = await fetch('https://app.mobaro.com/api/customers/files/create', {
      method: 'POST',
      headers,
      body,
    });

    if (response.ok) {
      const fileData = await response.text();
      console.log('File created in Mobaro:', fileData);
      return fileData;
    } else {
      console.error('Error creating file in Mobaro:', response.status, response.statusText);
      throw new Error('Error creating file in Mobaro.');
    }
  } catch (error) {
    console.error('Error creating file in Mobaro:', error);
    throw error;
  }
}
