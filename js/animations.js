/* =========================================================
   PLAYSTATION LEGACY - animations.js
   Urutan script di index.html:
   script.js  ->  enhancements.js (opsional)  ->  animations.js
========================================================= */

(function () {

    const $$ = selector => [...document.querySelectorAll(selector)];


    /* ---------- 1. ARAH SLIDE UNTUK ELEMEN .reveal ---------- */

    $$(".timeline-item").forEach((el, i) => {
        el.classList.add(i % 2 === 0 ? "from-left" : "from-right");
    });

    $$(".console-card").forEach((el, i) => {
        el.style.transitionDelay = (i % 3) * 0.12 + "s";
    });

    $$(".history-card").forEach((el, i, all) => {

        const full = i === all.length - 1 && all.length % 2 === 1;

        el.classList.add(full ? "from-zoom" : i % 2 === 0 ? "from-left" : "from-right");
        el.style.transitionDelay = full ? "0s" : (i % 2) * 0.1 + "s";

    });

    $$(".about-box").forEach(el => el.classList.add("from-zoom"));

    /* setelah slide masuk selesai: hapus delay & kembalikan transisi hover cepat */

    const settleObserver = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            const el = entry.target;
            const delay = (parseFloat(el.style.transitionDelay) || 0) * 1000;

            setTimeout(() => {
                el.style.transitionDelay = "";
                el.classList.add("settled");
            }, delay + 1000);

            obs.unobserve(el);

        });

    }, { threshold: 0.12 });

    $$(".reveal").forEach(el => settleObserver.observe(el));


    /* ---------- 2. ELEMEN TAMBAHAN (class .sl) ---------- */

    const slideObserver = new IntersectionObserver((entries, obs) => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add("in");
            obs.unobserve(entry.target);

        });

    }, { threshold: 0.15 });

    function slide(selector, type, step = 0.1) {

        $$(selector).forEach((el, i) => {

            el.classList.add("sl", "sl-" + type);
            el.style.setProperty("--d", (i * step) + "s");

            slideObserver.observe(el);

        });

    }

    slide(".section-title > p", "up");
    slide(".section-title h2", "up", 0);
    $$(".section-title h2").forEach(el => el.style.setProperty("--d", "0.12s"));
    slide(".section-title .line", "line");
    $$(".section-title .line").forEach(el => el.style.setProperty("--d", "0.3s"));

    slide(".origin-image", "left");
    slide(".origin-content", "right");
    slide(".story-stats div", "up", 0.12);
    slide("footer > *", "up", 0.1);


    /* ---------- 3. HERO & NAVBAR: mulai setelah loader selesai ---------- */

    document.body.classList.add("anim-init");

    const start = () => document.body.classList.add("anim-ready");
    const loader = document.getElementById("loader");

    if (!loader || !document.body.contains(loader)) {

        start();

    } else {

        const watcher = new MutationObserver(() => {

            if (loader.classList.contains("hidden") || !document.body.contains(loader)) {
                watcher.disconnect();
                start();
            }

        });

        watcher.observe(loader, { attributes: true, attributeFilter: ["class"] });

        /* pengaman kalau loader macet */
        setTimeout(start, 12000);

    }


    /* ---------- 4. SLIDE ANTAR KONSOL DI MODAL ---------- */

    const modal = document.getElementById("modal");
    const box = modal && modal.querySelector(".modal-box");

    if (box && typeof playstationData !== "undefined" && window.openConsole) {

        const order = Object.keys(playstationData);
        const previousOpen = window.openConsole;

        window.openConsole = function (id) {

            const wasOpen = modal.classList.contains("active");
            const from = order.indexOf(currentConsole);

            previousOpen(id);

            const direction = !wasOpen
                ? "up"
                : order.indexOf(id) >= from ? "next" : "prev";

            box.classList.remove("swap-next", "swap-prev", "swap-up");
            void box.offsetWidth;
            box.classList.add("swap-" + direction);

        };

    }

})();