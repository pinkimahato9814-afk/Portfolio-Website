const sectionFiles = [
  "sections/hero.html",
  "sections/about.html",
  "sections/skills.html",
  "sections/projects.html",
  "sections/education.html",
  "sections/achievements.html",
  "sections/contact.html",
];

const contentRoot = document.getElementById("content");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

async function loadSections() {
  try {
    const sectionMarkup = await Promise.all(
      sectionFiles.map(async (file) => {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to load ${file}`);
        }
        return response.text();
      })
    );

    contentRoot.innerHTML = sectionMarkup.join("\n");
    initializeInteractions();
  } catch (error) {
    contentRoot.innerHTML = `
      <section class="section-loading">
        <div class="loading-card">
          <p>Unable to load the portfolio sections right now. Please open the site through a local server or deploy it on GitHub Pages.</p>
        </div>
      </section>
    `;
    console.error(error);
  }
}

function initializeInteractions() {
  menuBtn?.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  navLinks?.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".fade-up").forEach((element) => observer.observe(element));

  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const updateActiveLink = () => {
    let current = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navAnchors.forEach((anchor) => {
      anchor.classList.toggle("active", anchor.getAttribute("href") === `#${current}`);
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });
}

loadSections();
