function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePassword(value) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value);
}

async function hashPassword(value) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bindLogin() {
  const form = document.querySelector("#login-form");
  if (!form) return;
  guardPublicPage();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const error = form.querySelector(".error");
    error.textContent = "";
    if (!validateEmail(email)) {
      error.textContent = "Enter a valid email address.";
      return;
    }
    if (!validatePassword(password)) {
      error.textContent = "Password must be 8+ chars with uppercase, number, and symbol.";
      return;
    }
    const user = Auth.getUser();
    if (!user || user.email !== email) {
      error.textContent = "No account found. Please register first.";
      return;
    }
    const hashed = await hashPassword(password);
    if (hashed !== user.passwordHash) {
      error.textContent = "Incorrect password. Try again.";
      return;
    }
    Auth.login(email);
    window.location.replace("dashboard.html");
  });
}

function bindRegister() {
  const form = document.querySelector("#register-form");
  if (!form) return;
  guardPublicPage();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const role = form.role.value;
    const error = form.querySelector(".error");
    error.textContent = "";
    if (!name) {
      error.textContent = "Name is required.";
      return;
    }
    if (!validateEmail(email)) {
      error.textContent = "Enter a valid email address.";
      return;
    }
    if (!validatePassword(password)) {
      error.textContent = "Password must be 8+ chars with uppercase, number, and symbol.";
      return;
    }
    const passwordHash = await hashPassword(password);
    Auth.register({ name, email, role, passwordHash });
    Auth.login(email);
    window.location.replace("dashboard.html");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindLogin();
  bindRegister();
});
