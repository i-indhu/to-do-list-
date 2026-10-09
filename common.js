/* ==========================================
   MYTASK — SHARED HEADER BEHAVIOUR & LOGO UI
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // ----- LOGO IMAGE INJECTION -----
    document.querySelectorAll(".logo-icon").forEach(function (iconContainer) {
        iconContainer.innerHTML = '<img src="logo.png" alt="Taskly Logo" class="logo-img" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">';
    });

    // ----- MOBILE MENU TOGGLE -----
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navMenu = document.querySelector(".nav-menu");
    const headerButtons = document.querySelector(".header-buttons");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", function () {
            navMenu.classList.toggle("mobile-open");
            if (headerButtons) {
                headerButtons.classList.toggle("mobile-open");
            }
            const icon = menuBtn.querySelector("i");
            if (icon) {
                icon.classList.toggle("fa-bars");
                icon.classList.toggle("fa-xmark");
            }
        });
    }

    // ----- ACTIVE NAV LINK -----
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-menu a").forEach(function (link) {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // ----- DYNAMIC HEADER AUTH STATE -----
    function updateHeaderAuth() {
        if (!headerButtons) return;

        let user = null;
        try {
            user = JSON.parse(localStorage.getItem('myTaskUser'));
        } catch (e) {}

        if (user && user.email) {
            const displayName = user.displayName || user.email.split('@')[0];
            headerButtons.innerHTML = `
                <a href="profile.html" class="login-btn" title="View Profile">
                    <i class="fa-solid fa-circle-user"></i> ${escapeHTML(displayName)}
                </a>
                <button type="button" id="headerLogoutBtn" class="signup-btn" style="cursor:pointer; border:none;">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out
                </button>
            `;

            const logoutBtn = document.getElementById("headerLogoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    localStorage.removeItem('myTaskUser');
                    window.location.href = "login.html";
                });
            }
        } else {
            headerButtons.innerHTML = `
                <a href="login.html" class="login-btn">Log in</a>
                <a href="signup.html" class="signup-btn">Sign up</a>
            `;
        }
    }

    updateHeaderAuth();
});
