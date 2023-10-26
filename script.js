document.getElementById("projectForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const formattedDescription = generateFormattedDescription();
  const formData = new FormData();

  formData.append("name", document.getElementById("name").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("userDescription", document.getElementById("description").value);
  formData.append("attachments", document.getElementById("attachments").files[0]);
  formData.append("siteContact", document.getElementById("siteContact").value);
  formData.append("startDate", document.getElementById("startDate").value);
  formData.append("completionDate", document.getElementById("completionDate").value);
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
    // Feedback on successful submission
  })
  .catch(error => {
    console.error(error);
    alert("Error submitting form. Please try again.");
  })
  .finally(() => {
    submitButton.disabled = false;
  });
});

const nameToIdMap = {};

async function populateLocationsDropdown() {
  const locationDropdown = document.getElementById("location");
  locationDropdown.innerHTML = "";

  try {
    const response = await fetch("/api/getLocations");
    const responseText = await response.text();

    // Ensure the response is JSON
    if (!response.headers.get("content-type").includes("application/json")) {
      throw new Error(`Expected JSON, but received ${response.headers.get("content-type")}. Response: ${responseText}`);
    }

    const locationsData = JSON.parse(responseText);
    locationsData.sort((a, b) => a.name.localeCompare(b.name));

    locationsData.forEach(location => {
      const option = document.createElement("option");
      option.value = location.name;
      option.textContent = location.name;
      locationDropdown.appendChild(option);
      nameToIdMap[location.name] = location.id;
    });

  } catch (error) {
    console.error("Error fetching Locations data:", error);
    alert("Error loading locations. Please try again later.");
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

  return `
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
}

populateLocationsDropdown();
