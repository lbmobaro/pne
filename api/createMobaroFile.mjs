// Import necessary modules using ES module syntax
import fetch from 'node-fetch'; // Use 'node-fetch' for making HTTP requests in AWS Lambda

// Your createMobaroFile function
async function createMobaroFile() {
  try {
    const attachmentsInput = document.getElementById('attachments');
    const file = attachmentsInput.files[0]; // Get the first selected file

    if (!file) {
      // Handle the case where no file is selected
      console.error('No file selected.');
      return;
    }

    // Get the file name and create a FormData object
    const fileName = file.name;
    const formData = new FormData();
    formData.append('File', file, { filename: fileName, contentType: file.type });

    // Construct the headers for the request
    const headers = {
      "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
      "x-api-key": process.env.MOBARO_API_KEY,
    };

    // Send the request to Mobaro
    const response = await fetch('https://app.mobaro.com/api/customers/files/create', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.ok) {
      const fileData = await response.text(); // You can adjust this based on the expected response
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

export { createMobaroFile }; // Export your function for use in other modules
