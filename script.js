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
      console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });
});

async function populateLocationsDropdown() {
  const locationDropdown = document.getElementById("location");
  locationDropdown.innerHTML = "";

  const nameToIdMap = {};

  try {
    const response = await fetch("/api/getLocations");
    const locationsData = await response.json();

    locationsData.sort((a, b) => a.name.localeCompare(b.name));

    // Iterate through locationsData and create options for the dropdown
    locationsData.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.name; // Set the value to the location name
      option.textContent = location.name; // Display the location name
      locationDropdown.appendChild(option);

      // Store the mapping between name and ID
      nameToIdMap[location.name] = location.id;
    });

    // Add an event listener to the dropdown to capture the selected location name
    locationDropdown.addEventListener("change", (event) => {
      const selectedLocationName = event.target.value;
      const selectedLocationId = nameToIdMap[selectedLocationName];
    });
  } catch (error) {
    console.error("Error fetching Locations data:", error);
  }
}

populateLocationsDropdown();

const locationDropdown = document.getElementById("location");

locationDropdown.addEventListener("change", (event) => {
  const selectedLocationName = event.target.value;

  // Make a request to your serverless function
  fetch(`/api/getLocations?target=${selectedLocationName}`)
    .then((response) => response.json())
    .then((data) => {
      const selectedLocationId = data.target;

      // Now, you can use selectedLocationId when sending your form data to the Mobaro API
    })
    .catch((error) => {
      console.error("Error fetching location ID:", error);
    });
});

function generateFormattedDescription() {
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const userDescription = document.getElementById("description").value;
  const siteContact = document.getElementById("siteContact").value;
  const startDate = document.getElementById("startDate").value;
  const completionDate = document.getElementById("completionDate").value;
  const glCode = document.getElementById("glCode").value;
  const costCenterCode = document.getElementById("costCenterCode").value;
  const costUnitCode = document.getElementById("costUnitCode").value;
  const projectCode = document.getElementById("projectCode").value;
  const projectBudget = document.getElementById("projectBudget").value;
  const locationDropdown = document.getElementById("location");
  const selectedLocationName = locationDropdown.value;
  const selectedLocationId = nameToIdMap[selectedLocationName];
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
        Location ID: ${selectedLocationId}
    `;

  return formattedDescription;
}
