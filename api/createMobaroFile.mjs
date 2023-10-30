async function createMobaroFile(fileByteArray, fileName) {
  try {
    // Generate a unique boundary string
    const boundary = `------------------------${Math.random().toString(16)}`;

    // Create a FormData object to construct the multipart/form-data request
    const formData = new FormData();

    // Append the file data as a Blob with a custom filename
    const blob = new Blob([new Uint8Array(fileByteArray)], { type: "application/octet-stream" });
    formData.append("file", blob, fileName);

    // Construct the headers for the request
    const headers = {
      "x-api-key": process.env.MOBARO_API_KEY,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    };

    // Send the request to Mobaro
    const response = await fetch("https://app.mobaro.com/api/customers/files/create", {
      method: "POST",
      headers,
      body: formData,
    });

    if (response.ok) {
      const fileData = await response.json();
      console.log("File created in Mobaro:", fileData);
      return fileData;
    } else {
      console.error("Error creating file in Mobaro:", response.status, response.statusText);
      throw new Error("Error creating file in Mobaro.");
    }
  } catch (error) {
    console.error("Error creating file in Mobaro:", error);
    throw error;
  }
}
