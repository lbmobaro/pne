async function createMobaroFile(file) {
  try {
    // Generate a unique boundary string
    const boundary = 'mobaro-file-boundary-' + Date.now();

    // Build the request body
    const body = [];
    body.push(`--${boundary}`);
    body.push(`Content-Disposition: form-data; name="fileData"; filename="${file.name}"`);
    body.push('Content-Type: application/octet-stream'); // Use the appropriate content type

    // Read the file as binary data
    const fileData = await readFileAsBinary(file);

    // Encode the binary data as ISO-8859-1
    const iso8859Data = new TextEncoder('iso-8859-1').encode(fileData);

    // Add the binary data to the request body
    body.push('');
    body.push(iso8859Data);

    // Add boundary for the end of the part
    body.push(`--${boundary}--`);
    
    // Join the body parts with CRLF
    const requestBody = body.join('\r\n');

    const headers = {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    };

    const createFileResponse = await fetch("https://app.mobaro.com/api/customers/files/create", {
      method: "POST",
      body: requestBody,
      headers: headers,
    });

    if (createFileResponse.ok) {
      const fileData = await createFileResponse.json();
      console.log("File created in Mobaro:", fileData);
      return fileData;
    } else {
      console.error(
        "Error creating file in Mobaro:",
        createFileResponse.status,
        createFileResponse.statusText
      );
      throw new Error("Error creating file in Mobaro.");
    }
  } catch (error) {
    console.error("Error creating file in Mobaro:", error);
    throw error;
  }
}

// Function to read a file as binary data
function readFileAsBinary(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        resolve(event.target.result);
      } else {
        reject(new Error("Failed to read file as binary data."));
      }
    };
    reader.readAsBinaryString(file);
  });
}
