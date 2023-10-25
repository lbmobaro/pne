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
  const selectedLocationName = locationDropdown.value; // Get the selected location name

  // Use the name-to-ID mapping to get the corresponding ID
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
