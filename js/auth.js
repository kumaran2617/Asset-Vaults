const AUTH_KEY = "av_auth";
const USER_KEY = "av_user";

const Auth = {
  getToken() {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (data.expiresAt && Date.now() > data.expiresAt) {
        localStorage.removeItem(AUTH_KEY);
        return null;
      }
      return data;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },
  isAuthenticated() {
    return Boolean(this.getToken());
  },
  login(email) {
    const payload = {
      email,
      issuedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 8
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    return payload;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
  register(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
};

function requireAuth() {
  if (!Auth.isAuthenticated()) {
    window.location.replace("login.html");
  }
}

function guardPublicPage() {
  if (Auth.isAuthenticated()) {
    window.location.replace("dashboard.html");
  }
}

function wireLogout() {
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      Auth.logout();
      window.location.replace("login.html");
    });
  });
}

function updateUserUi() {
  const user = Auth.getUser();
  if (!user) return;
  document.querySelectorAll("[data-user-name]").forEach((el) => {
    el.textContent = user.name || "User";
  });
  document.querySelectorAll("[data-user-email]").forEach((el) => {
    el.textContent = user.email || "user@assetvault.io";
  });
}

function setActiveNav() {
  const path = window.location.pathname.split("/").pop();
  document.querySelectorAll(".nav-link").forEach((link) => {
    const target = link.getAttribute("href");
    if (target === path) {
      link.classList.add("active");
    }
  });
}
