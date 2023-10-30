const nameToIdMap = {}; // Create a global mapping between name and ID
let highPriorityValue;

async function populateLocationsDropdown() {
  const locationDropdown = document.getElementById("location");
  locationDropdown.innerHTML = ""; // Clear existing options

  try {
    // Fetch location data from GitHub
    const response = await fetch('https://raw.githubusercontent.com/lbmobaro/pne/main/locations.json');
    const locationsData = await response.json();

    // Sort locationsData by name (alphabetically)
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
    const highPriorityCheckbox = document.getElementById("highPriority");
    const highPriorityValue = highPriorityCheckbox.checked ? "true" : "false";

    return `<div style="font-weight: bold;">Name:</div>${name}<br>
            <div style="font-weight: bold;">Department:</div>${department}<br>
            <div style="font-weight: bold;">User Description:</div>${userDescription}<br>
            <div style="font-weight: bold;">Site Contact:</div>${siteContact}<br>
            <div style="font-weight: bold;">Start Date:</div>${startDate}<br>
            <div style="font-weight: bold;">End Date:</div>${completionDate}<br>
            <div style="font-weight: bold;">GL Code:</div>${glCode}<br>
            <div style="font-weight: bold;">Cost Center Code:</div>${costCenterCode}<br>
            <div style="font-weight: bold;">Cost Unit Code:</div>${costUnitCode}<br>
            <div style="font-weight: bold;">Project Code:</div>${projectCode}<br>
            <div style="font-weight: bold;">Project Budget:</div>${projectBudget}`;
}


populateLocationsDropdown();

const highPriorityCheckbox = document.getElementById("highPriority");
highPriorityCheckbox.addEventListener("change", (event) => {
  highPriorityValue = event.target.checked;
});

document.getElementById("projectForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formattedDescription = generateFormattedDescription();
  const formData = new FormData();

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const startDateInput = document.getElementById("startDate");
  const startDate = new Date(startDateInput.value);

  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);

  if (startDate < yesterday) {
    // Start date is in the past, show an error message
    alert("Start date must be today or in the future.");
    return; // Prevent form submission
  }

  if (startDate >= completionDate) {
    // Start date is not before completion date, show an error message
    alert("Start date must be before the completion date.");
    return; // Prevent form submission
  }

  formData.append("name", document.getElementById("name").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("userDescription", document.getElementById("description").value);
  formData.append("attachments", document.getElementById("attachments").files[0]);
  formData.append("siteContact", document.getElementById("siteContact").value);
  formData.append("startDate", document.getElementById("startDate").value);
  formData.append("completionDate", document.getElementById("completionDate").value);
  formData.append("highPriority", highPriorityValue);
  formData.append("glCode", document.getElementById("glCode").value);
  formData.append("costCenterCode", document.getElementById("costCenterCode").value);
  formData.append("costUnitCode", document.getElementById("costUnitCode").value);
  formData.append("projectCode", document.getElementById("projectCode").value);
  formData.append("projectBudget", document.getElementById("projectBudget").value);
  formData.append("formattedDescription", formattedDescription);

  const selectedLocationName = document.getElementById("location").value;
  const selectedLocationId = nameToIdMap[selectedLocationName];
  formData.append("locationId", selectedLocationId);

  // Provide feedback: Disable the submit button
  const submitButton = document.querySelector("#projectForm button[type='submit']");
  submitButton.disabled = true;

  // Send the data to the server
  fetch("/api/sendToMobaro", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
    alert("Error submitting form. Please try again.");
  })
  .finally(() => {
    submitButton.disabled = false;
  });
});
