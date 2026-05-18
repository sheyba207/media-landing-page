const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const params = new URLSearchParams(window.location.search);
const successMessage = document.querySelector("[data-success-message]");

if (successMessage && params.get("submitted") === "true") {
  successMessage.classList.add("is-visible");
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
