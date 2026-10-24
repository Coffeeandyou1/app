
const button = document.getElementById("clickBtn");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.textContent = "Hello! Your app is working.";
});
