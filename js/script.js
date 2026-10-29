document.addEventListener("DOMContentLoaded", () => {
  // Set the current year in the footer.
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Bootstrap gallery lightbox with previous/next controls.
  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-src]"));
  const modalEl = document.getElementById("galleryModal");
  if (modalEl && galleryItems.length) {
    const modal = new bootstrap.Modal(modalEl);
    const preview = document.getElementById("galleryPreview");
    const caption = document.getElementById("galleryCaption");
    let activeIndex = 0;
    const showImage = index => {
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      const item = galleryItems[activeIndex];
      preview.src = item.dataset.gallerySrc;
      preview.alt = item.dataset.galleryAlt || item.dataset.galleryTitle || "Lesotho tourism photograph";
      caption.textContent = item.dataset.galleryTitle || "";
    };
    galleryItems.forEach((item, index) => item.addEventListener("click", () => {
      showImage(index);
      modal.show();
    }));
    document.getElementById("galleryPrev")?.addEventListener("click", () => showImage(activeIndex - 1));
    document.getElementById("galleryNext")?.addEventListener("click", () => showImage(activeIndex + 1));
  }

  // Client-side validation for registration/booking form.
  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = form.querySelector("#fullName");
      const email = form.querySelector("#email");
      const phone = form.querySelector("#phone");
      const password = form.querySelector("#password");
      const confirmPassword = form.querySelector("#confirmPassword");
      let valid = true;
      const setError = (field, message) => {
        const target = document.getElementById(field.id + "Error");
        if (target) target.textContent = message;
        field.classList.toggle("is-invalid", Boolean(message));
        field.classList.toggle("is-valid", !message && field.value.trim() !== "");
        if (message) valid = false;
      };
      setError(name, name.value.trim().length >= 2 ? "" : "Please enter your full name (at least 2 characters).");
      setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? "" : "Enter a valid email address.");
      setError(phone, /^[+0-9 ()-]{7,20}$/.test(phone.value.trim()) ? "" : "Enter a valid phone number.");
      if (password) {
        setError(password, password.value.length >= 8 ? "" : "Password must contain at least 8 characters.");
      }
      if (confirmPassword) {
        setError(confirmPassword, confirmPassword.value === password.value && confirmPassword.value.length > 0 ? "" : "Passwords must match.");
      }
      const requiredFields = Array.from(form.querySelectorAll("[required]"));
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          const error = document.getElementById(field.id + "Error");
          if (error && !error.textContent) error.textContent = "This field is required.";
          valid = false;
        }
      });
      const result = document.getElementById("formMessage");
      if (valid) {
        result.className = "alert alert-success notice mt-3";
        result.textContent = "Thank you! Your details passed validation. This demo does not send or store your booking.";
        result.classList.remove("d-none");
        form.reset();
        form.querySelectorAll(".is-valid").forEach(field => field.classList.remove("is-valid"));
      } else {
        result.className = "alert alert-danger notice mt-3";
        result.textContent = "Please correct the highlighted fields and try again.";
        result.classList.remove("d-none");
        form.querySelector(".is-invalid")?.focus();
      }
    });
    form.querySelectorAll("input, select").forEach(field => field.addEventListener("input", () => {
      field.classList.remove("is-invalid");
      const error = document.getElementById(field.id + "Error");
      if (error) error.textContent = "";
    }));
  }
});
