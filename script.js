document.getElementById("projectForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("department", document.getElementById("department").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("startDate", document.getElementById("startDate").value);
    formData.append("completionDate", document.getElementById("completionDate").value);
    formData.append("expenseAllocation", document.getElementById("expenseAllocation").value);

    // Append the file input to the FormData
    const fileInput = document.getElementById("file");
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
