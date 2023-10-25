document.getElementById("projectForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Generate the formatted description based on form input values
  const formattedDescription = generateFormattedDescription();

  // Create an object to hold the form data
  const formData = {
    name: document.getElementById("name").value,
    department: document.getElementById("department").value,
    userDescription: document.getElementById("description").value,
    attachments: document.getElementById("attachments").files[0],
    siteContact: document.getElementById("siteContact").value,
    startDate: document.getElementById("startDate").value,
    completionDate: document.getElementById("completionDate").value,
    glCode: document.getElementById("glCode").value,
    costCenterCode: document.getElementById("costCenterCode").value,
    costUnitCode: document.getElementById("costUnitCode").value,
    projectCode: document.getElementById("projectCode").value,
    projectBudget: document.getElementById("projectBudget").value,
    
    formattedDescription: formattedDescription,
  };

  // Convert the formData object to a JSON string
  const jsonData = JSON.stringify(formData);

  // Send the JSON data to the server
  fetch("/api/sendToMobaro", {
    method: "POST",
    body: jsonData,
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the server (e.g., show a success message)
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
    });
});

async function populateLocationsDropdown() {
  const locationDropdown = document.getElementById("location");
  locationDropdown.innerHTML = ""; // Clear existing options

  try {
    // Fetch location data from your server
    const response = await fetch("/api/getLocations"); // Replace with your server endpoint
    const locationsData = await response.json();

    // Iterate through locationsData and create options for the dropdown
    locationsData.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.id; // Set the value to the location id
      option.textContent = location.name; // Display the location name
      locationDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching Locations data:", error);
  }
}

// Call the function to populate the Locations dropdown
populateLocationsDropdown();

function generateFormattedDescription() {
  // Get values from form fields
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const userDescription = document.getElementById("description").value; // User-entered description
  const siteContact = document.getElementById("siteContact").value;
  const startDate = document.getElementById("startDate").value;
  const completionDate = document.getElementById("completionDate").value;
  const glCode = document.getElementById("glCode").value;
  const costCenterCode = document.getElementById("costCenterCode").value;
  const costUnitCode = document.getElementById("costUnitCode").value;
  const projectCode = document.getElementById("projectCode").value;
  const projectBudget = document.getElementById("projectBudget").value;
  const locationDropdown = document.getElementById("location");
  const selectedLocationId = locationDropdown.value;

  const formattedDescription = `
        Name: ${name}
        Department: ${department}
        User Description: ${userDescription}
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
