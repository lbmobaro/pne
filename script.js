document.getElementById("projectForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        description: document.getElementById("description").value,
        startDate: document.getElementById("startDate").value,
        completionDate: document.getElementById("completionDate").value,
        expenseAllocation: document.getElementById("expenseAllocation").value
    };

    fetch("/api/sendToMobaro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
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
