/****************************************************
 * MAIN FRONTEND JAVASCRIPT
 * Handles:
 * - Mobile menu
 * - Modals
 * - Two different forms
 * - Two different Google Apps Script endpoints
 ****************************************************/

/* ===============================
   MOBILE MENU TOGGLE
================================ */
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navMenu = document.getElementById("navMenu");
const navActions = document.getElementById("navActions");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-open");
    navActions.classList.toggle("mobile-open");
  });
}

/* ===============================
   MODAL OPEN / CLOSE
================================ */
function openModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  navMenu.classList.remove("mobile-open");
  navActions.classList.remove("mobile-open");
}

function closeModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

/* Close modal when clicking outside */
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
});

/* ===============================
   SUCCESS MESSAGE
================================ */
function showSuccessMessage() {
  const successMessage = document.getElementById("successMessage");
  if (!successMessage) return;

  successMessage.classList.add("show");
  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 5000);
}

/* ===============================
   GENERIC FORM SUBMIT HANDLER
================================ */
async function submitForm(form, apiEndpoint, modalType) {
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.classList.add("loading-state");

  const formData = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      mode: "cors",
      redirect: "follow",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const rawText = await response.text();
    let result;

    try {
      result = JSON.parse(rawText);
    } catch {
      throw new Error("Invalid response from server");
    }

    if (!result.success) {
      throw new Error(result.error || "Submission failed");
    }

    submitBtn.classList.remove("loading-state");
    form.reset();
    closeModal(modalType);
    showSuccessMessage();

  } catch (error) {
    console.error("Form submission error:", error);
    submitBtn.classList.remove("loading-state");
    alert("Submission failed. Please try again later.");
  }
}

/* ===============================
   EVENT ORGANIZER FORM
================================ */
const organizerForm = document.getElementById("organizerForm");
const ORGANIZER_API_URL =
  "https://script.google.com/macros/s/AKfycbysgiyhLNkRqL8QTUjSzaNiNRaIWjidsMWAfWIVtdr2SSHawuuWvPG4sQGh4cyY8PPK4Q/exec";

if (organizerForm) {
  organizerForm.addEventListener("submit", e => {
    e.preventDefault();
    submitForm(organizerForm, ORGANIZER_API_URL, "organizer");
  });
}

/* ===============================
   SPONSOR / BRAND FORM
================================ */
const sponsorForm = document.getElementById("sponsorForm");
const SPONSOR_API_URL =
  "PASTE_SPONSOR_SCRIPT_URL_HERE";

if (sponsorForm) {
  sponsorForm.addEventListener("submit", e => {
    e.preventDefault();
    submitForm(sponsorForm, SPONSOR_API_URL, "sponsor");
  });
}

/* ===============================
   SMOOTH SCROLL
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      navMenu.classList.remove("mobile-open");
      navActions.classList.remove("mobile-open");
    }
  });
});

/* ===============================
   ESC KEY HANDLING
================================ */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach(modal => {
      modal.classList.remove("active");
    });

    document.body.style.overflow = "auto";
    navMenu.classList.remove("mobile-open");
    navActions.classList.remove("mobile-open");
  }
});

/* ===============================
   AUTO-HIDE NAVBAR ON SCROLL
================================ */
let lastScrollY = window.scrollY;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (!navbar) return;

  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }

  lastScrollY = window.scrollY;
});
