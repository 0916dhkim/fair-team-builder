import "bootstrap/dist/css/bootstrap.min.css";
// Remove user credentials from local storage.
localStorage.removeItem("user");
// Redirect to index.
window.location.replace("/");
