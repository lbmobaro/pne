const nameToIdMap = {};
let highPriorityValue;

document.addEventListener('DOMContentLoaded', function() {
    var highPriorityCheckbox = document.getElementById('highPriority');
    var warningBox = document.getElementById('warningBox');

    highPriorityCheckbox.addEventListener('change', function() {
        if (highPriorityCheckbox.checked) {
            warningBox.style.display = 'block'; // Show the warning box
        } else {
            warningBox.style.display = 'none'; // Hide the warning box
        }
    });
});

async function populateLocationsDropdown() {
  const locationDropdown = document.getElementById("location");
  locationDropdown.innerHTML = "";

  try {
    const response = await fetch('https://raw.githubusercontent.com/lbmobaro/pne/main/locations.json');
    const locationsData = await response.json();

    locationsData.sort((a, b) => a.name.localeCompare(b.name));

    locationsData.forEach((location) => {
      const option = document.createElement("option");
      option.value = location.name;
      option.textContent = location.name;
      locationDropdown.appendChild(option);

      nameToIdMap[location.name] = location.id;
    });

    locationDropdown.addEventListener("change", (event) => {
      const selectedLocationName = event.target.value;
      const selectedLocationId = nameToIdMap[selectedLocationName];
    });
  } catch (error) {
    console.error("Error fetching Locations data:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
    const highPriorityCheckbox = document.getElementById("highPriority");
    const startDateInput = document.getElementById("startDate");
    const completionDateInput = document.getElementById("completionDate");

    highPriorityCheckbox.addEventListener("change", function () {
        if (highPriorityCheckbox.checked) {
            // Disable and remove "required" attribute
            startDateInput.disabled = true;
            completionDateInput.disabled = true;
            startDateInput.removeAttribute("required");
            completionDateInput.removeAttribute("required");
        } else {
            // Enable and add "required" attribute back
            startDateInput.disabled = false;
            completionDateInput.disabled = false;
            startDateInput.setAttribute("required", "required");
            completionDateInput.setAttribute("required", "required");
        }
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
  const highPriorityCheckbox = document.getElementById("highPriority");
  highPriorityValue = highPriorityCheckbox.checked ? "true" : "false";

  return `<div style="font-weight: bold;">Person Requesting Work:</div>${name}<br>
          <div style="font-weight: bold;">Department Requesting Work:</div>${department}<br>
          <div style="font-weight: bold;">Description of work required:</div>${userDescription}<br>
          <div style="font-weight: bold;">Site Contact:</div>${siteContact}<br>
          <div style="font-weight: bold;">Start Date:</div>${startDate}<br>
          <div style="font-weight: bold;">End Date:</div>${completionDate}<br>
          <div style="font-weight: bold;">GL Code:</div>${glCode}<br>
          <div style="font-weight: bold;">Cost Center:</div>${costCenterCode}<br>
          <div style="font-weight: bold;">Cost Unit:</div>${costUnitCode}<br>
          <div style="font-weight: bold;">Project Code:</div>${projectCode}<br>
          <div style="font-weight: bold;">Allotted Project Budget:</div>${projectBudget}`;
}

populateLocationsDropdown();

const highPriorityCheckbox = document.getElementById("highPriority");
highPriorityCheckbox.addEventListener("change", (event) => {
  highPriorityValue = event.target.checked ? "true" : "false";
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
    alert("Start date must be today or in the future.");
    return;
  }

  const completionDateInput = document.getElementById("completionDate");
  const completionDate = new Date(completionDateInput.value);

  if (startDate >= completionDate) {
    alert("Start date must be before the completion date.");
    return;
  }

  const attachmentsInput = document.getElementById("attachments");

  async function createMobaroFile(file) {
    try {
      const attachmentData = new FormData();
      attachmentData.append("attachments", file);
      attachmentData.append("metadata", "Additional metadata for the file");
      const createFileResponse = await fetch("/api/createMobaroFile", {
        method: "POST",
        body: attachmentData,
      });

      if (createFileResponse.ok) {
        const fileData = await createFileResponse.json();
        console.log("File created in Mobaro:", fileData);
        return fileData;
      } else {
        console.error("Error creating file in Mobaro:", createFileResponse.status, createFileResponse.statusText);
        throw new Error("Error creating file in Mobaro.");
      }
    } catch (error) {
      console.error("Error creating file in Mobaro:", error);
      throw error;
    }
  }

  if (attachmentsInput.files.length > 0) {
    const attachmentFile = attachmentsInput.files[0];
    try {
      const mobaroFile = await createMobaroFile(attachmentFile);
      formData.append("attachments", JSON.stringify(mobaroFile));
    } catch (error) {
      console.error("Error creating Mobaro file:", error);
    }
  }

  formData.append("name", document.getElementById("name").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("userDescription", document.getElementById("description").value);
  formData.append("siteContact", document.getElementById("siteContact").value);
  formData.append("startDate", startDateInput.value);
  formData.append("completionDate", completionDateInput.value);
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
  
  // Use this function when handling user interactions
  async function handleFileUpload() {
    try {
      const attachmentsInput = document.getElementById('attachments');
      const file = attachmentsInput.files[0]; // Get the first selected file
  
      if (!file) {
        // Handle the case where no file is selected
        console.error('No file selected.');
        return;
      }
  
      // Read the file as an ArrayBuffer
      const fileBuffer = await file.arrayBuffer();
  
      // Invoke the server-side function to create the Mobaro file
      await createMobaroFile(fileBuffer, file.name);
    } catch (error) {
      console.error('Error handling file upload:', error);
    }
  }
  
  // Example: Add an event listener to a button or form submission
  // document.getElementById('uploadButton').addEventListener('click', handleFileUpload);

  const submitButton = document.querySelector("#projectForm button[type='submit']");
  submitButton.disabled = true;

  fetch("/api/sendToMobaro", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.message === "Project data sent to Mobaro successfully!") {
            // Clear the form
            document.getElementById('projectForm').reset();
            
            // Display the confirmation message
            document.getElementById('confirmationMessage').innerText = "Project data sent successfully to Mobaro! Form will now reset.";
            
            // Hide the confirmation message after a few seconds
            setTimeout(() => {
                document.getElementById('confirmationMessage').innerText = '';
            }, 5000);
        } else {
            throw new Error(data.error || "Unknown error");
        }
    })
    .catch((error) => {
      console.error(error);
      alert("Error submitting form. Please try again.");
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
