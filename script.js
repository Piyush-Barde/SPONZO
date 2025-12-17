/****************************************************
 * SPONZO - Frontend JavaScript
 * Handles:
 * - Mobile menu
 * - Modals
 * - Organizer & Sponsor form submission
 * - Google Apps Script POST
 ****************************************************/

/* ===============================
   MOBILE MENU
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
   MODALS
================================ */
function openModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  document.getElementById(modalId).classList.add("active");
  document.body.style.overflow = "hidden";

  navMenu.classList.remove("mobile-open");
  navActions.classList.remove("mobile-open");
}

function closeModal(type) {
  const modalId = type === "organizer" ? "organizerModal" : "sponsorModal";
  document.getElementById(modalId).classList.remove("active");
  document.body.style.overflow = "auto";
}

/* Close modal when clicking backdrop */
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
  successMessage.classList.add("show");

  setTimeout(() => {
    successMessage.classList.remove("show");
  }, 5000);
}

/* ===============================
   GENERIC FORM SUBMIT HANDLER
================================ */
async function submitForm(form, apiEndpoint) {
  const btn = form.querySelector('button[type="submit"]');
  btn.classList.add("loading-state");

  const data = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    const result = JSON.parse(text);

    if (!result.success) {
      throw new Error(result.error || "Submission failed");
    }

    btn.classList.remove("loading-state");
    form.reset();
    showSuccessMessage();

  } catch (error) {
    console.error("Submission error:", error);
    btn.classList.remove("loading-state");
    alert("Submission failed. Please try again.");
  }
}

/* ===============================
   EVENT ORGANIZER FORM
================================ */
const organizerForm = document.getElementById("organizerForm");
const ORGANIZER_API_URL =
  "https://script.google.com/macros/s/AKfycbyUjUctEpDrVmxrwUF-gCRTddq1rycfCrGiZGI9Z3dxTb4IClPPm4pvrWC-eFywUxZBQA/exec";

if (organizerForm) {
  organizerForm.addEventListener("submit", e => {
    e.preventDefault(); // CRITICAL
    submitForm(organizerForm, ORGANIZER_API_URL);
    closeModal("organizer");
  });
}

/* ===============================
   SPONSOR FORM
================================ */
const sponsorForm = document.getElementById("sponsorForm");
const SPONSOR_API_URL =
  "PASTE_SPONSOR_SCRIPT_URL_HERE"; // <-- replace when backend ready

if (sponsorForm) {
  sponsorForm.addEventListener("submit", e => {
    e.preventDefault();
    submitForm(sponsorForm, SPONSOR_API_URL);
    closeModal("sponsor");
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
      target.scrollIntoView({ behavior: "smooth" });
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
  }
});

/* ===============================
   AUTO HIDE NAVBAR
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
