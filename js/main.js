const workshopDate = new Date("2026-09-07T09:00:00+02:00").getTime();

function setCountdownValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = String(value).padStart(2, "0");
    }
}

function updateCountdown() {
    const now = Date.now();
    let delta = Math.max(workshopDate - now, 0);

    const days = Math.floor(delta / (1000 * 60 * 60 * 24));
    delta -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(delta / (1000 * 60 * 60));
    delta -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(delta / (1000 * 60));
    delta -= minutes * 1000 * 60;

    const seconds = Math.floor(delta / 1000);

    setCountdownValue("days", days);
    setCountdownValue("hours", hours);
    setCountdownValue("minutes", minutes);
    setCountdownValue("seconds", seconds);
}

function setupMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");

    if (!menuBtn || !navLinks) {
        return;
    }

    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("is-open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

function setupReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
}

function setupNavState() {
    const nav = document.getElementById("siteNav");
    if (!nav) {
        return;
    }

    const syncNav = () => {
        if (window.scrollY > 24) {
            nav.classList.add("is-scrolled");
        } else {
            nav.classList.remove("is-scrolled");
        }
    };

    syncNav();
    window.addEventListener("scroll", syncNav, { passive: true });
}

function setupActiveLinks() {
    const sections = document.querySelectorAll("main section[id]");
    const links = Array.from(document.querySelectorAll(".site-nav__links a"));

    if (!sections.length || !links.length) {
        return;
    }

    const linkMap = new Map(
        links.map((link) => [link.getAttribute("href"), link])
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                links.forEach((link) => link.classList.remove("is-active"));
                const activeLink = linkMap.get(`#${entry.target.id}`);
                if (activeLink) {
                    activeLink.classList.add("is-active");
                }
            });
        },
        {
            rootMargin: "-35% 0px -50% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => observer.observe(section));
}

window.addEventListener("DOMContentLoaded", () => {
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    setupMenu();
    setupReveal();
    setupNavState();
    setupActiveLinks();
});
