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
   STATS COUNT-UP ANIMATION
================================ */

/* ===============================
   STATS COUNT-UP ANIMATION (BALANCED SPEED)
================================ */
const counters = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateCounters() {
  if (statsAnimated) return;

  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    
    // Changed duration to 1000ms (1 second) for a faster, snappier feel
    const duration = 1000; 
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Calculate current value based on time progress
      const currentVal = Math.floor(progress * target);

      if (progress < 1) {
        counter.textContent = `${prefix}${currentVal}${suffix}`;
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = `${prefix}${target}${suffix}`;
      }
    };

    requestAnimationFrame(updateCount);
  });

  statsAnimated = true;
}

/* Trigger animation when stats section enters viewport */
const statsSection = document.querySelector(".stats-section");

if (statsSection) {
  const observer = new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  observer.observe(statsSection);
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
    "https://script.google.com/macros/s/AKfycbz5caRQhbellUm8F65WMaArBbwBZdMxF_nXDJIYJgEHaT0tYJp9QOzv-I94yXOEY3Birg/exec";

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
