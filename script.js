document.getElementById("projectForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from form fields
    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const userDescription = document.getElementById("description").value; // Ensure the correct ID
    const siteContact = document.getElementById("siteContact").value;
    const startDate = document.getElementById("startDate").value;
    const completionDate = document.getElementById("completionDate").value;
    const glCode = document.getElementById("glCode").value;
    const costCenterCode = document.getElementById("costCenterCode").value;
    const costUnitCode = document.getElementById("costUnitCode").value;
    const projectCode = document.getElementById("projectCode").value;
    const projectBudget = document.getElementById("projectBudget").value;

    // Generate the formatted description
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

    // Create FormData and append data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("department", department);
    formData.append("attachments", document.getElementById("attachments").files[0]);
    formData.append("siteContact", siteContact);
    formData.append("startDate", startDate);
    formData.append("completionDate", completionDate);
    formData.append("glCode", glCode);
    formData.append("costCenterCode", costCenterCode);
    formData.append("costUnitCode", costUnitCode);
    formData.append("projectCode", projectCode);
    formData.append("projectBudget", projectBudget);
    formData.append("formattedDescription", formattedDescription);

    // Append the file input to the FormData
    const fileInput = document.getElementById("attachments");
    formData.append("attachment", fileInput.files[0]);

    // Make the fetch request
    fetch("/api/sendToMobaro", {
        method: "POST",
        body: formData,
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
