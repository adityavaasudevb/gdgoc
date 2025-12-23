// Mobile menu toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Smooth scroll for nav links AND hero buttons
document.querySelectorAll('.nav-links a, .hero-buttons a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: 'smooth'
        });
        navLinks.classList.remove('open');
      }
    }
  });
});


// Auth toggle (only runs on auth.html)
const toggleButtons = document.querySelectorAll(".auth-toggle-btn");
const panes = document.querySelectorAll(".auth-pane");

function showPane(id) {
  panes.forEach((pane) => {
    if (pane.id === id) {
      pane.classList.add("active-pane");
    } else {
      pane.classList.remove("active-pane");
    }
  });
}

if (toggleButtons.length && panes.length) {
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-form");

      toggleButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      showPane(target);
    });
  });

  // default
  showPane("login-form");
}
