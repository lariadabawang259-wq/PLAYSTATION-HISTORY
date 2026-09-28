/* =========================================================
   PLAYSTATION LEGACY - script.js
========================================================= */


/* =========================================================
   DATA
========================================================= */

const playstationData = {

    ps1: {
        year: "1994",
        title: "PlayStation",
        description:
            "PlayStation pertama menjadi awal perjalanan Sony di industri konsol dan membawa pengalaman gaming berbasis CD serta grafis 3D ke lebih banyak pemain.",
        specs: [
            ["CPU", "MIPS R3000A"],
            ["Media", "CD-ROM"],
            ["RAM", "2 MB"],
            ["GPU", "Sony GPU"],
            ["Controller", "PlayStation Controller"],
            ["Generation", "5th Generation"]
        ],
        games: [
            "Crash Bandicoot",
            "Resident Evil",
            "Final Fantasy VII",
            "Gran Turismo",
            "Tekken 3",
            "Metal Gear Solid"
        ]
    },

    ps2: {
        year: "2000",
        title: "PlayStation 2",
        description:
            "PlayStation 2 memperluas kesuksesan generasi pertama dengan DVD, library game yang sangat besar, dan berbagai franchise yang menjadi ikon PlayStation.",
        specs: [
            ["CPU", "Emotion Engine"],
            ["Media", "DVD-ROM"],
            ["RAM", "32 MB"],
            ["GPU", "Graphics Synthesizer"],
            ["Controller", "DualShock 2"],
            ["Generation", "6th Generation"]
        ],
        games: [
            "Grand Theft Auto: San Andreas",
            "God of War",
            "God of War II",
            "Gran Turismo 4",
            "Metal Gear Solid 3",
            "Kingdom Hearts"
        ]
    },

    ps3: {
        year: "2006",
        title: "PlayStation 3",
        description:
            "PlayStation 3 membawa Blu-ray, online gaming melalui PlayStation Network, serta hardware yang lebih kuat untuk pengalaman gaming HD.",
        specs: [
            ["CPU", "Cell Broadband Engine"],
            ["Media", "Blu-ray"],
            ["RAM", "256 MB XDR"],
            ["GPU", "RSX"],
            ["Controller", "Sixaxis / DualShock 3"],
            ["Generation", "7th Generation"]
        ],
        games: [
            "Uncharted 2",
            "The Last of Us",
            "God of War III",
            "LittleBigPlanet",
            "Metal Gear Solid 4",
            "Gran Turismo 5"
        ]
    },

    ps4: {
        year: "2013",
        title: "PlayStation 4",
        description:
            "PlayStation 4 membawa PlayStation ke era yang semakin terhubung dengan fitur sharing, streaming, komunitas online dan game digital.",
        specs: [
            ["CPU", "AMD Jaguar"],
            ["Media", "Blu-ray / Digital"],
            ["RAM", "8 GB GDDR5"],
            ["GPU", "AMD Radeon"],
            ["Controller", "DualShock 4"],
            ["Generation", "8th Generation"]
        ],
        games: [
            "God of War",
            "Marvel's Spider-Man",
            "Bloodborne",
            "The Last of Us Part II",
            "Ghost of Tsushima",
            "Uncharted 4"
        ]
    },

    ps5: {
        year: "2020",
        title: "PlayStation 5",
        description:
            "PlayStation 5 menghadirkan SSD berkecepatan tinggi, ray tracing dan controller DualSense dengan haptic feedback serta adaptive triggers.",
        specs: [
            ["CPU", "AMD Zen 2"],
            ["Storage", "Custom NVMe SSD"],
            ["RAM", "16 GB GDDR6"],
            ["GPU", "AMD RDNA 2"],
            ["Controller", "DualSense"],
            ["Generation", "9th Generation"]
        ],
        games: [
            "Demon's Souls",
            "Spider-Man: Miles Morales",
            "Ratchet & Clank: Rift Apart",
            "Gran Turismo 7",
            "God of War Ragnarök",
            "Astro Bot"
        ]
    }

};

const generationOrder = Object.keys(playstationData);

let currentConsole = "ps1";
let typeTimer = null;


/* =========================================================
   ELEMENTS
========================================================= */

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalYear = document.getElementById("modalYear");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalSpecs = document.getElementById("modalSpecs");
const detailsButtons = document.querySelectorAll(".details-btn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.querySelector(".navbar nav");

/* Daftar game di dalam modal (dibuat lewat JS) */

let modalGameList = null;

if (modalSpecs) {

    const gamesWrap = document.createElement("div");
    gamesWrap.className = "modal-games";

    const gamesTitle = document.createElement("h4");
    gamesTitle.textContent = "Game Terkenal";

    modalGameList = document.createElement("div");
    modalGameList.className = "game-list";

    gamesWrap.appendChild(gamesTitle);
    gamesWrap.appendChild(modalGameList);

    modalSpecs.insertAdjacentElement("afterend", gamesWrap);

}


/* =========================================================
   TYPEWRITER
   (interval lama selalu dihentikan dulu, supaya teks tidak
   bertabrakan saat pindah konsol dengan cepat)
========================================================= */

function typeText(element, text, speed = 8) {

    clearInterval(typeTimer);

    let index = 0;

    element.textContent = "";

    typeTimer = setInterval(() => {

        index++;

        element.textContent = text.slice(0, index);

        if (index >= text.length) {
            clearInterval(typeTimer);
        }

    }, speed);

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openConsole(consoleId) {

    const data = playstationData[consoleId];

    if (!data || !modal) return;

    currentConsole = consoleId;

    modalYear.textContent = data.year;
    modalTitle.textContent = data.title;

    typeText(modalDescription, data.description);


    /* Specs */

    modalSpecs.innerHTML = "";

    data.specs.forEach(([label, value], index) => {

        const item = document.createElement("div");

        item.className = "spec-item";
        item.style.opacity = "0";
        item.style.transform = "translateY(10px)";

        item.innerHTML = `
            <strong>${label}</strong>
            <span>${value}</span>
        `;

        modalSpecs.appendChild(item);

        setTimeout(() => {

            item.style.transition =
                "opacity .35s ease, transform .35s ease";

            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

        }, 60 + index * 70);

    });


    /* Games */

    if (modalGameList) {

        modalGameList.innerHTML = "";

        data.games.forEach(game => {

            const chip = document.createElement("span");
            chip.textContent = game;

            modalGameList.appendChild(chip);

        });

    }


    modal.classList.add("active");
    document.body.style.overflow = "hidden";

}


detailsButtons.forEach(button => {

    button.addEventListener("click", () => {

        openConsole(button.dataset.console);

    });

});


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModalWindow() {

    if (!modal) return;

    modal.classList.remove("active");

    clearInterval(typeTimer);

    /* jangan buka scroll kalau loading screen masih tampil */
    if (!document.getElementById("loader")) {
        document.body.style.overflow = "";
    }

}

if (closeModal) {
    closeModal.addEventListener("click", closeModalWindow);
}

if (modal) {

    modal.addEventListener("click", event => {

        if (event.target === modal) closeModalWindow();

    });

}


/* =========================================================
   KEYBOARD
   Esc = tutup modal, panah kiri/kanan = ganti konsol
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeModalWindow();
        return;
    }

    if (!modal || !modal.classList.contains("active")) return;

    const index = generationOrder.indexOf(currentConsole);

    if (event.key === "ArrowLeft" && index > 0) {
        openConsole(generationOrder[index - 1]);
    }

    if (event.key === "ArrowRight" && index < generationOrder.length - 1) {
        openConsole(generationOrder[index + 1]);
    }

});


/* =========================================================
   MOBILE MENU
========================================================= */

if (menuBtn && nav) {

    menuBtn.setAttribute("aria-expanded", "false");

    menuBtn.addEventListener("click", () => {

        nav.classList.toggle("active");

        menuBtn.setAttribute(
            "aria-expanded",
            String(nav.classList.contains("active"))
        );

    });

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("active");
            menuBtn.setAttribute("aria-expanded", "false");

        });

    });

}


/* =========================================================
   SCROLL REVEAL
   (pakai class .reveal / .visible dari CSS)
========================================================= */

const revealElements = document.querySelectorAll(
    ".console-card, .history-card, .origin-story, .timeline-item, .about-box"
);

const revealObserver = new IntersectionObserver(
    (entries, obs) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("visible");
            obs.unobserve(entry.target);

        });

    },
    { threshold: 0.12 }
);

revealElements.forEach(el => {

    el.classList.add("reveal");
    revealObserver.observe(el);

});


/* =========================================================
   SCROLL PROGRESS BAR + BACK TO TOP
========================================================= */

const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

const backTop = document.createElement("button");
backTop.className = "back-to-top";
backTop.type = "button";
backTop.textContent = "↑";
backTop.setAttribute("aria-label", "Back to top");
document.body.appendChild(backTop);

backTop.addEventListener("click", () => {

    window.scrollTo({ top: 0, behavior: "smooth" });

});

function updateScroll() {

    const max =
        document.documentElement.scrollHeight - window.innerHeight;

    const percent =
        max > 0 ? (window.scrollY / max) * 100 : 0;

    progressBar.style.width = percent + "%";

    backTop.classList.toggle("show", window.scrollY > 600);

}

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();


/* =========================================================
   ACTIVE NAVIGATION
   (pakai rootMargin, bukan threshold, supaya section yang
   sangat tinggi tetap terdeteksi)
========================================================= */

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar nav a");

const sectionObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            navLinks.forEach(link => {

                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === "#" + entry.target.id
                );

            });

        });

    },
    {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0
    }
);

sections.forEach(section => sectionObserver.observe(section));


/* =========================================================
   IMAGE TILT (hanya desktop)
========================================================= */

document.querySelectorAll(
    ".console-image img, .history-card-image img, .origin-image img"
).forEach(image => {

    const container = image.parentElement;

    container.addEventListener("mousemove", event => {

        if (window.innerWidth < 768) return;

        const rect = container.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 4;
        const rotateX = ((rect.height / 2 - y) / (rect.height / 2)) * 4;

        image.style.transform =
            `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;

    });

    container.addEventListener("mouseleave", () => {

        image.style.transform = "";

    });

});


/* =========================================================
   GAME CHIP (klik untuk menandai)
   pakai event delegation supaya chip di modal juga jalan
========================================================= */

document.addEventListener("click", event => {

    const chip = event.target.closest(".game-list span");

    if (!chip) return;

    const list = chip.parentElement;

    list.querySelectorAll("span").forEach(item => {
        item.classList.remove("selected");
    });

    chip.classList.add("selected");

});


/* =========================================================
   HERO PARALLAX (hanya desktop)
========================================================= */

const hero = document.querySelector(".hero");
const heroController = document.querySelector(".hero-console");

if (hero && heroController) {

    hero.addEventListener("mousemove", event => {

        if (window.innerWidth < 768) return;

        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        heroController.style.transform =
            `translate(${x * 18}px, ${y * 12}px)`;

    });

    hero.addEventListener("mouseleave", () => {

        heroController.style.transform = "";

    });

}


/* =========================================================
   EASTER EGG
   ↑ ↑ ↓ ↓ ← → ← →   (di luar modal)
========================================================= */

const secretCode = [
    "ArrowUp", "ArrowUp",
    "ArrowDown", "ArrowDown",
    "ArrowLeft", "ArrowRight",
    "ArrowLeft", "ArrowRight"
];

let secretIndex = 0;

document.addEventListener("keydown", event => {

    if (event.key === secretCode[secretIndex]) {

        secretIndex++;

        if (secretIndex === secretCode.length) {

            secretIndex = 0;

            document.body.classList.add("playstation-easter-egg");

            setTimeout(() => {
                document.body.classList.remove("playstation-easter-egg");
            }, 2500);

        }

    } else {

        secretIndex = event.key === secretCode[0] ? 1 : 0;

    }

});


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document.querySelectorAll("img").forEach(image => {

    image.addEventListener("error", () => {

        image.style.opacity = "0.25";

    });

});