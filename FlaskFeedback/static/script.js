document.addEventListener("DOMContentLoaded", () => {
    // Get the delete button with the class "delete-feedback"
    const deleteButton = document.querySelector(".delete-feedback");
    if (deleteButton) {
        deleteButton.addEventListener("click", deleteFeedback);
    }
    async function deleteFeedback(event) {
        // Get a reference to the clicked button (the event target)
        const button = event.target;
        // Get the feedback ID from the "data-id" attribute of the button
        const id = button.getAttribute("data-id");
        // Get the session username from the "data-username" attribute of the button
        const username = button.getAttribute("data-username");
        // Display a confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete this feedback?");
        if (confirmed) {
            try {
                // Send a DELETE request to the server using the Fetch API
                await axios.delete(`/feedbacks/${id}`);

                // Redirect to the user's page
                window.location.href = `/users/${username}`;
            } catch (error) {
                console.error("Error deleting feedback:", error);
            }
        }
    }



    const updateForm = document.getElementById("update-form");
    if (updateForm) {
        updateForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission
        // Get the feedback ID from the "data-id" attribute of the button
        const id = updateForm.getAttribute("data-id");
        // Get the session username from the "data-username" attribute of the button
        const username = updateForm.getAttribute("data-username");
        // Get updated title and content from input fields
        const new_title = document.getElementById('title').value.trim();
        const new_content = document.getElementById('content').value.trim();
        try {
            // Send a PATCH request to the server using the Fetch API
            await axios.patch(`/feedbacks/${id}`, {
                title: new_title,
                content: new_content,
            });
            // Redirect to the user's page after successful update
            window.location.href = `/users/${username}`;
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
        });
    }



    const deleteUserBtn = document.getElementById("delete-user");
    if (deleteUserBtn) {
        event.preventDefault();
        deleteUserBtn.addEventListener("click", showDeleteConfirmation);
    }
    function showDeleteConfirmation(event) {
        const confirmed = window.confirm("Are you sure you want to delete your account and all associated feedbacks? This action cannot be undone.");
        const username = event.target.getAttribute("data-username");
        if (confirmed) {
            window.location.href = `/users/${username}/delete`;
        }
    }
 


});
