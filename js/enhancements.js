/* =========================================================
   PLAYSTATION LEGACY - enhancements.js
   Muat SETELAH script.js:
   <script src="js/script.js"></script>
   <script src="js/enhancements.js"></script>
========================================================= */

(function () {

    const modal = document.getElementById("modal");
    if (!modal || typeof playstationData === "undefined") return;

    const box = modal.querySelector(".modal-box");
    const closeBtn = document.getElementById("closeModal");
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.querySelector(".navbar nav");
    const order = Object.keys(playstationData);

    let lastFocus = null;


    /* ---------- 1. ARIA ---------- */

    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-labelledby", "modalTitle");
    closeBtn.setAttribute("aria-label", "Tutup detail");
    if (menuBtn) menuBtn.setAttribute("aria-label", "Buka menu");


    /* ---------- 2. TOMBOL PREV / NEXT DI MODAL ---------- */

    const modalNav = document.createElement("div");
    modalNav.className = "modal-nav";
    modalNav.innerHTML = `
        <button type="button" class="modal-prev" aria-label="Konsol sebelumnya">← Prev</button>
        <span class="modal-counter" aria-live="polite"></span>
        <button type="button" class="modal-next" aria-label="Konsol berikutnya">Next →</button>
    `;
    box.appendChild(modalNav);

    const prevBtn = modalNav.querySelector(".modal-prev");
    const nextBtn = modalNav.querySelector(".modal-next");
    const counter = modalNav.querySelector(".modal-counter");

    function go(step) {
        const i = order.indexOf(currentConsole) + step;
        if (i >= 0 && i < order.length) openConsole(order[i]);
    }

    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));

    function updateModalNav() {
        const i = order.indexOf(currentConsole);
        counter.textContent = `${i + 1} / ${order.length}`;
        prevBtn.disabled = i <= 0;
        nextBtn.disabled = i >= order.length - 1;

        /* chip game di modal bisa difokus keyboard */
        modal.querySelectorAll(".game-list span").forEach(chip => {
            chip.tabIndex = 0;
            chip.setAttribute("role", "button");
        });
    }

    /* bungkus openConsole milik script.js */
    const originalOpen = window.openConsole;

    window.openConsole = function (id) {
        originalOpen(id);
        updateModalNav();
        box.scrollTop = 0;
    };


    /* ---------- 3. SWIPE (mobile) ---------- */

    let touchX = null;

    box.addEventListener("touchstart", e => {
        touchX = e.changedTouches[0].clientX;
    }, { passive: true });

    box.addEventListener("touchend", e => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        touchX = null;
        if (Math.abs(dx) > 70) go(dx < 0 ? 1 : -1);
    }, { passive: true });


    /* ---------- 4. FOKUS: pindah ke modal, kembali saat ditutup ---------- */

    new MutationObserver(() => {

        if (modal.classList.contains("active")) {
            lastFocus = document.activeElement;
            closeBtn.focus();
        } else if (lastFocus) {
            lastFocus.focus();
            lastFocus = null;
        }

    }).observe(modal, { attributes: true, attributeFilter: ["class"] });

    /* focus trap */
    document.addEventListener("keydown", e => {

        if (e.key !== "Tab" || !modal.classList.contains("active")) return;

        const items = [...box.querySelectorAll("button:not([disabled]), [tabindex='0']")];
        if (!items.length) return;

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }

    });

    /* Enter / Space pada chip game */
    document.addEventListener("keydown", e => {

        if (e.key !== "Enter" && e.key !== " ") return;

        const chip = e.target.closest && e.target.closest(".game-list span");
        if (!chip) return;

        e.preventDefault();
        chip.click();

    });


    /* ---------- 5. MENU MOBILE: Esc & klik di luar ---------- */

    function closeMenu() {
        if (!nav || !menuBtn) return;
        nav.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
    }

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", e => {
        if (nav && menuBtn && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });


    /* ---------- 6. FALLBACK GAMBAR ---------- */

    function markMissing(img) {
        const parent = img.parentElement;
        parent.classList.add("img-missing");
        parent.dataset.label = img.alt || "Image";
    }

    document.querySelectorAll("img").forEach(img => {
        img.addEventListener("error", () => markMissing(img));
        if (img.complete && img.naturalWidth === 0) markMissing(img);
    });

})();