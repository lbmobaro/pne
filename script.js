document.getElementById("projectForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Generate the description based on form input values
    const description = generateDescription();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("department", document.getElementById("department").value);
    formData.append("attachments", document.getElementById("attachments").files[0]);
    formData.append("siteContact", document.getElementById("siteContact").value);
    formData.append("startDate", document.getElementById("startDate").value);
    formData.append("completionDate", document.getElementById("completionDate").value);
    formData.append("glCode", document.getElementById("glCode").value);
    formData.append("costCenterCode", document.getElementById("costCenterCode").value);
    formData.append("costUnitCode", document.getElementById("costUnitCode").value);
    formData.append("projectCode", document.getElementById("projectCode").value);
    formData.append("projectBudget", document.getElementById("projectBudget").value);

    // Append the generated description to the FormData
    formData.append("description", description);
    
    // Append the file input to the FormData
    const fileInput = document.getElementById("attachments");
    formData.append("attachment", fileInput.files[0]);


    fetch("/api/sendToMobaro", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server (e.g., show a success message)
        console.log(data);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
    });
});

function generateDescription() {
    // Get values from form fields
    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const description = document.getElementById("description").value;
    const siteContact = document.getElementById("siteContact").value;
    const startDate = document.getElementById("startDate").value;
    const completionDate = document.getElementById("completionDate").value;
    const glCode = document.getElementById("glCode").value;
    const costCenterCode = document.getElementById("costCenterCode").value;
    const costUnitCode = document.getElementById("costUnitCode").value;
    const projectCode = document.getElementById("projectCode").value;
    const projectBudget = document.getElementById("projectBudget").value;

    // Create the description with bold titles and input values
    const formattedDescription = `
        Name: ${name}
        Department: ${department}
        Description: ${description}
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
