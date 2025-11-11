// public/js/header.js
document.addEventListener("DOMContentLoaded", () => {
  // --- Dropdown toggle (User & Settings) ---
  const dropdowns = document.querySelectorAll(".dropdown-container");

  dropdowns.forEach((dropdown) => {
    const icon = dropdown.querySelector("i");

    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      // close all other dropdowns first
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("open");
      });

      // toggle this one
      dropdown.classList.toggle("open");
    });
  });

  // close dropdowns if click outside
  document.addEventListener("click", () => {
    dropdowns.forEach((d) => d.classList.remove("open"));
  });

  // --- Address modal toggle ---
  const addressTrigger = document.getElementById("addressTrigger");
  const addressModal = document.getElementById("addressModal");
  const modalClose = document.querySelector(".modal-close");
  const modalBackdrop = document.querySelector(".address-modal-backdrop");
  const addressInput = document.getElementById("addressInput");
  const confirmBtn = document.querySelector(".confirm-location-btn");
  const currentLocation = document.getElementById("current-location");

  if (addressTrigger && addressModal) {
    addressTrigger.addEventListener("click", () => {
      addressModal.classList.add("active");
      setTimeout(() => addressInput.focus(), 100);
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      addressModal.classList.remove("active");
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", () => {
      addressModal.classList.remove("active");
    });
  }

  // Saved addresses (click to fill input)
  const savedBtns = document.querySelectorAll(".saved-btn");
  savedBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addressInput.value = btn.textContent.trim();
    });
  });

  // Confirm button updates header text
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      currentLocation.textContent =
        addressInput.value.trim() || "Mumbai, 400001";
      addressModal.classList.remove("active");
    });
  }
});
