// Mobile Menu Toggle
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navMenu = document.getElementById("navMenu");
const navActions = document.getElementById("navActions");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    if (navMenu && navActions) {
      navMenu.classList.toggle("mobile-open");
      navActions.classList.toggle("mobile-open");
    }
  });
}

// Modal Functions
function openModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  if (navMenu && navActions) {
    navMenu.classList.remove("mobile-open");
    navActions.classList.remove("mobile-open");
  }
}

function closeModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

// Organizer Form
// Organizer Form
const organizerForm = document.getElementById("organizerForm");

if (organizerForm) {
  organizerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = organizerForm.querySelector('button[type="submit"]');
    btn.classList.add("loading-state");

    const data = Object.fromEntries(new FormData(organizerForm));

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx_Z6P3mSjYle7MR3b1TN9SFAfcMGUW1y6Es4h_wIZgClQHDtMjgepGJ_Leor3N0XVl/exec",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      // ✅ Assume success if fetch doesn't throw
      btn.classList.remove("loading-state");
      organizerForm.reset();
      closeModal("organizer");
      showSuccessMessage();

    } catch (err) {
      console.error(err);
      btn.classList.remove("loading-state");
      alert("Submission failed. Try again.");
    }
  });
}

// Success Message
function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage");
  if (!successMessage) return;

  successMessage.classList.add("show");
  setTimeout(() => successMessage.classList.remove("show"), 5000);
}
