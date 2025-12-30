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
        "https://script.google.com/macros/s/AKfycbyRrhaEBeb887DI0SPWo_C3gm_iI6EbhMSLuOY_m6HdU9n5P_2ufl9RzWmh9CWFOMtltg/exec",
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

// ===============================
// Sponsor Form
// ===============================
const sponsorForm = document.getElementById("sponsorForm");

if (sponsorForm) {
  sponsorForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = sponsorForm.querySelector('button[type="submit"]');
    btn.classList.add("loading-state");

    const data = Object.fromEntries(new FormData(sponsorForm));

    // 🔹 identify type for Apps Script
    data.formType = "sponsor";

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxZcMB1wYR65_zEAI-pUiwnkV_Hl9jKPWD4fkemmktip7vUJio2DnrhhbSW-N8CRc5MJg/exec",
        {
          method: "POST",
          body: JSON.stringify(data)
        }
      );

      // ✅ Assume success
      btn.classList.remove("loading-state");
      sponsorForm.reset();
      closeModal("sponsor");
      showSuccessMessage();

    } catch (err) {
      console.error(err);
      btn.classList.remove("loading-state");
      alert("Sponsor submission failed. Try again.");
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
