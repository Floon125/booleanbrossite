// PARALLAX HERO
window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const hero = document.querySelector(".hero-img");

    if (hero) {
        hero.style.transform = `translateY(${y * 0.4}px)`;
    }
});

// FADE-IN ON SCROLL
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".fade-in").forEach(el => {
    observer.observe(el);
});
