// Get references to menu elements used for mobile navigation behavior.
const menuToggle = document.getElementById("menuToggle");
const primaryMenu = document.getElementById("primaryMenu");

// Toggle the mobile menu open/closed and keep the button ARIA state in sync.
if (menuToggle && primaryMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = primaryMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  // Close menu after clicking a nav link on mobile for smoother UX.
  primaryMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

// Get references to inquiry form fields and output message area.
const inquiryForm = document.getElementById("inquiryForm");
const formMessage = document.getElementById("formMessage");

// Basic email regex for client-side format validation.
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Display a status message and attach style based on success/error type.
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove("success", "error");
  formMessage.classList.add(type);
}

// Add or remove field-level error highlighting for invalid inputs.
function setFieldError(field, hasError) {
  if (hasError) {
    field.classList.add("input-error");
  } else {
    field.classList.remove("input-error");
  }
}

// Validate required fields and email format on submit.
if (inquiryForm) {
  inquiryForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const course = document.getElementById("course");

    let hasError = false;

    // Required field checks for name, email, phone, and course.
    [name, email, phone, course].forEach((field) => {
      const isEmpty = !field.value.trim();
      setFieldError(field, isEmpty);
      if (isEmpty) {
        hasError = true;
      }
    });

    // Email format check only if a value was entered.
    if (email.value.trim() && !emailPattern.test(email.value.trim())) {
      setFieldError(email, true);
      hasError = true;
    }

    // Show relevant message based on validation outcome.
    if (hasError) {
      showMessage("Please fill all required fields with a valid email address.", "error");
      return;
    }

    // Simulate successful submission, then reset the form.
    showMessage("Thank you! Your inquiry has been submitted successfully.", "success");
    inquiryForm.reset();
  });
}

// Lightweight section reveal: adds subtle fade-in as users scroll down.
const revealTargets = document.querySelectorAll(".section:not(.hero), .site-footer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealTargets.length) {
  revealTargets.forEach((element) => {
    element.classList.add("reveal-on-scroll");

    // Keep above-the-fold sections visible immediately to avoid initial flicker.
    if (element.getBoundingClientRect().top <= window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    }
  });

  // Respect reduced-motion settings by showing content immediately.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach((element) => {
      if (!element.classList.contains("is-visible")) {
        observer.observe(element);
      }
    });
  }
}
