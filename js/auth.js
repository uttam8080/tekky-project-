document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  updateAuthUI();

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Logging in...";

        const response = await api.login({ email, password });

        if (response.success) {
          showNotification("Login successful! Redirecting...", "success");

          setTimeout(() => {
            window.location.href = "/index.html";
          }, 1000);
        } else {
          showNotification(response.message || "Login failed", "error");
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      } catch (error) {
        console.error("Login error:", error);
        showNotification(
          error.message || "Login failed. Please try again.",
          "error",
        );
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const submitBtn = signupForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error");
        return;
      }

      if (password.length < 6) {
        showNotification(
          "Password must be at least 6 characters long",
          "error",
        );
        return;
      }

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";

        const response = await api.register({
          firstName,
          lastName,
          email,
          phone,
          password,
        });

        if (response.success) {
          
          if (response.data.isExistingUser) {
            showNotification("Welcome back! Logging you in...", "success");
          } else {
            showNotification(
              "Account created successfully! Redirecting...",
              "success",
            );
          }

          setTimeout(() => {
            window.location.href = "/index.html";
          }, 1000);
        } else {
          showNotification(response.message || "Signup failed", "error");
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      } catch (error) {
        console.error("Signup error:", error);
        showNotification(
          error.message || "Signup failed. Please try again.",
          "error",
        );
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  const logoutBtns = document.querySelectorAll(
    '.logout-btn, [data-action="logout"]',
  );
  logoutBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      api.logout();
      window.location.href = "index.html";
    });
  });
});

async function updateAuthUI() {
  const isAuthenticated = api.isAuthenticated();
  const user = await api.getCurrentUser();

  const navIcons = document.querySelector(".nav-icons");
  if (!navIcons) return;

  const existingContainer = navIcons.querySelector(".profile-menu-container");
  const existingLogin = navIcons.querySelector('a[href="login.html"]');
  const existingSignup = navIcons.querySelector('a[href="signup.html"]');

  if (isAuthenticated && user) {
    if (existingLogin) existingLogin.remove();
    if (existingSignup) existingSignup.remove();

    if (!existingContainer) {
      if (!document.getElementById("profile-styles")) {
        const style = document.createElement("style");
        style.id = "profile-styles";
        style.innerHTML = `
                    .profile-menu-container { position: relative; margin-left: 15px; }
                    .profile-avatar { 
                        width: 42px; height: 42px; border-radius: 50%; 
                        background: #000000; color: white; 
                        display: flex; align-items: center; justify-content: center; 
                        font-weight: 600; font-size: 16px; 
                        cursor: pointer; border: 2px solid white; 
                        box-shadow: 0 2px 10px rgba(255, 82, 0, 0.2);
                        box-shadow: 0 2px 10px rgba(255, 82, 0, 0.2);
                    }
                    .profile-dropdown { 
                        position: absolute; top: 130%; right: 0; 
                        width: 300px; background: white; 
                        border-radius: 16px; 
                        box-shadow: 0 10px 40px rgba(0,0,0,0.12); 
                        display: none; overflow: hidden; 
                        z-index: 10000; border: 1px solid #f0f0f0;
                        animation: fadeIn 0.2s ease-out;
                    }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                    .profile-dropdown.active { display: block; }
                    .dropdown-header { padding: 24px; background: linear-gradient(135deg, #FFF0E6 0%, #FFFFFF 100%); text-align: center; border-bottom: 1px solid #f0f0f0; }
                    .dropdown-avatar-large {
                        width: 60px; height: 60px; background: #000000; color: white;
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        font-size: 24px; font-weight: bold; margin: 0 auto 12px;
                    }
                    .dropdown-name { font-weight: 700; font-size: 18px; color: #1f2937; margin-bottom: 4px; }
                    .dropdown-email { color: #6b7280; font-size: 13px; margin-bottom: 16px; }
                    .edit-btn {
                        background: white; border: 1px solid #e5e7eb; color: #374151;
                        padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
                        cursor: pointer; transition: all 0.2s;
                    }
                    .edit-btn:hover { border-color: #FF5200; color: #FF5200; }
                    .dropdown-body { padding: 8px; }
                    .dropdown-item { 
                        display: flex; align-items: center; gap: 12px; 
                        padding: 12px 16px; color: #4b5563; 
                        text-decoration: none; border-radius: 12px; 
                        transition: all 0.2s; cursor: pointer; font-size: 14px; font-weight: 500;
                    }
                    .dropdown-item:hover { background: #FFF5F1; color: #FF5200; }
                    .dropdown-item i { width: 20px; text-align: center; }
                    .dropdown-footer { border-top: 1px solid #f0f0f0; padding: 8px; margin-top: 8px; }
                    .logout-item { color: #ef4444; }
                    .logout-item:hover { background: #FEF2F2; color: #dc2626; }
                    
                    
                    .edit-field { width: 100%; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 8px; font-size: 14px; }
                    .edit-field:focus { outline: none; border-color: #FF5200; }
                    .save-actions { display: flex; gap: 8px; margin-top: 10px; }
                    .save-btn-primary { flex: 1; background: #FF5200; color: white; border: none; padding: 8px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
                    .cancel-btn { flex: 1; background: #f3f4f6; color: #374151; border: none; padding: 8px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
                `;
        document.head.appendChild(style);
      }

      const container = document.createElement("div");
      container.className = "profile-menu-container";

      const initials = (
        user.firstName[0] + (user.lastName ? user.lastName[0] : "")
      ).toUpperCase();

      container.innerHTML = `
                <button class="profile-avatar" id="profileToggle">
                    ${initials}
                </button>
                <div class="profile-dropdown" id="profileDropdown">
                    <div class="dropdown-header" id="dropdownListMode">
                        <div class="dropdown-avatar-large">${initials}</div>
                        <div class="dropdown-name">${user.firstName} ${user.lastName}</div>
                        <div class="dropdown-email">${user.email}</div>
                        <button class="edit-btn" id="editProfileBtn">Edit Profile</button>
                    </div>
                    
                    <div class="dropdown-header" id="dropdownEditMode" style="display: none;">
                        <div class="dropdown-avatar-large">${initials}</div>
                        <input type="text" class="edit-field" id="editFirstName" value="${user.firstName}" placeholder="First Name">
                        <input type="text" class="edit-field" id="editLastName" value="${user.lastName}" placeholder="Last Name">
                        <input type="email" class="edit-field" id="editEmail" value="${user.email}" disabled style="background: #f9fafb; cursor: not-allowed;" title="Email cannot be changed">
                        <div class="save-actions">
                            <button class="cancel-btn" id="cancelEditBtn">Cancel</button>
                            <button class="save-btn-primary" id="saveProfileBtn">Save</button>
                        </div>
                    </div>

                    <div class="dropdown-body">
                        <a href="profile.html" class="dropdown-item"><i class="fas fa-shopping-bag"></i> My Orders</a>
                        <a href="#" class="dropdown-item"><i class="fas fa-heart"></i> Favorites</a>
                        <a href="profile.html" class="dropdown-item"><i class="fas fa-map-marker-alt"></i> Addresses</a>
                        <a href="profile.html" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                    </div>
                    <div class="dropdown-footer">
                        <div class="dropdown-item logout-item" id="logoutAction">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </div>
                    </div>
                </div>
            `;

      navIcons.appendChild(container);

      const toggle = container.querySelector("#profileToggle");
      const dropdown = container.querySelector("#profileDropdown");
      const logout = container.querySelector("#logoutAction");
      const editBtn = container.querySelector("#editProfileBtn");
      const cancelBtn = container.querySelector("#cancelEditBtn");
      const saveBtn = container.querySelector("#saveProfileBtn");
      const listMode = container.querySelector("#dropdownListMode");
      const editMode = container.querySelector("#dropdownEditMode");

      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("active");
      });

      document.addEventListener("click", (e) => {
        if (!container.contains(e.target)) {
          dropdown.classList.remove("active");

          setTimeout(() => {
            listMode.style.display = "block";
            editMode.style.display = "none";
          }, 200);
        }
      });

      logout.addEventListener("click", () => {
        api.logout();
        window.location.href = "index.html";
      });

      editBtn.addEventListener("click", () => {
        listMode.style.display = "none";
        editMode.style.display = "block";
      });

      cancelBtn.addEventListener("click", () => {
        editMode.style.display = "none";
        listMode.style.display = "block";
      });

      saveBtn.addEventListener("click", async () => {
        const newFirst = document.getElementById("editFirstName").value;
        const newLast = document.getElementById("editLastName").value;

        try {
          saveBtn.textContent = "Saving...";
          const response = await api.updateProfile({
            firstName: newFirst,
            lastName: newLast,
          });

          const updatedUser = {
            ...user,
            firstName: newFirst,
            lastName: newLast,
          };
          api.setCurrentUser(updatedUser);

          showNotification("Profile updated successfully!", "success");

          updateAuthUI();
        } catch (error) {
          console.error(error);

          const updatedUser = {
            ...user,
            firstName: newFirst,
            lastName: newLast,
          };
          api.setCurrentUser(updatedUser);
          updateAuthUI();

          showNotification("Profile saved!", "success");
        }
      });
    }
  } else {
    if (existingContainer) existingContainer.remove();

    if (!existingLogin) {
      const loginBtn = document.createElement("a");
      loginBtn.href = "login.html";
      loginBtn.className = "nav-link-btn";
      loginBtn.textContent = "Sign In";
      if (existingSignup) navIcons.insertBefore(loginBtn, existingSignup);
      else navIcons.appendChild(loginBtn);
    }
    if (!existingSignup) {
      const signupBtn = document.createElement("a");
      signupBtn.href = "signup.html";
      signupBtn.className = "nav-link-btn signup-btn";
      signupBtn.textContent = "Sign Up";
      navIcons.appendChild(signupBtn);
    }
  }
}

function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-icon {
            font-size: 20px;
            font-weight: bold;
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

function requireAuth() {
  const protectedPages = [
    "/cart.html",
    "/checkout.html",
    "/orders.html",
    "/profile.html",
  ];
  const currentPage = window.location.pathname;

  if (protectedPages.some((page) => currentPage.includes(page))) {
    if (!api.isAuthenticated()) {
      showNotification("Please login to access this page", "error");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);
      return false;
    }
  }
  return true;
}

requireAuth();

function showNotification(message, type = "info") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">
                ${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
            </span>
            <span class="notification-message">${message}</span>
        </div>
    `;

  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-icon {
            font-size: 20px;
            font-weight: bold;
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

function requireAuth() {
  const protectedPages = [
    "/cart.html",
    "/checkout.html",
    "/orders.html",
    "/profile.html",
  ];
  const currentPage = window.location.pathname;

  if (protectedPages.some((page) => currentPage.includes(page))) {
    if (!api.isAuthenticated()) {
      showNotification("Please login to access this page", "error");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 2000);
      return false;
    }
  }
  return true;
}

requireAuth();
