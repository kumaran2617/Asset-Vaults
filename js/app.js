function initAppShell() {
  const toggle = document.querySelector("[data-toggle-sidebar]");
  const sidebar = document.querySelector(".sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
  setActiveNav();
  wireLogout();
  updateUserUi();
}

document.addEventListener("DOMContentLoaded", initAppShell);
