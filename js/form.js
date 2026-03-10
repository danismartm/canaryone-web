/* ============================================================
   js/form.js – Forms + generic IntersectionObserver animations
   ============================================================ */

const FormModule = (() => {
    /* ── Toast ── */
    function showToast(msg, isError = false) {
        const t = document.getElementById('toast');
        if (!t) return;
        t.textContent = msg;
        t.style.borderColor = isError ? 'rgba(255,80,80,.5)' : 'rgba(212,168,67,.4)';
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3500);
    }

    /* ── Bind the B2B form after it renders ── */
    function bindB2BForm() {
        const form = document.getElementById('b2bForm');
        const btn = document.getElementById('b2bSubmit');
        if (!form || !btn) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.textContent = 'Enviando…'; btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '✅ Solicitud enviada';
                showToast('✅ ¡Solicitud enviada! Te respondemos en menos de 24h.');
                setTimeout(() => { btn.textContent = 'Solicitar Presupuesto →'; btn.disabled = false; form.reset(); }, 3000);
            }, 1400);
        });
    }

    /* ── IntersectionObserver: shared visible-class animation ── */
    function setupScrollAnimations() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => entry.target.classList.add('visible'), Number(delay));
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Existing elements
        document.querySelectorAll('.evtease-card, .cal-event, .team-card, .value-item')
            .forEach(el => io.observe(el));

        // New: flip cards, timeline events, testimonials
        document.querySelectorAll('.flip-card, .tl-event, .testi-card')
            .forEach((el, i) => {
                el.dataset.delay = el.dataset.delay || String(i * 80);
                io.observe(el);
            });
    }

    /* ── IntersectionObserver: investigation horizontal buttons
       IMPORTANT: buttons start opacity:0 translateX(−22px) in CSS.
       The IO adds 'btn-slide-in' class + a transition ONLY when they
       enter the viewport — so they never animate on DOM creation. ── */
    function setupInvestButtons() {
        const wrap = document.getElementById('investMenuWrap');
        if (!wrap) return;

        const buttons = wrap.querySelectorAll('.invest-btn');
        if (!buttons.length) return;

        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add transition via inline style ONLY after IO fires (not on creation)
                    buttons.forEach((btn, i) => {
                        btn.style.transition = `opacity .45s ${i * 0.07}s var(--ease), transform .45s ${i * 0.07}s var(--ease)`;
                        btn.classList.add('btn-slide-in');
                    });
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

        io.observe(wrap);
    }

    /* ── Listen for page render events ── */
    function listenForRender() {
        document.addEventListener('pageRendered', ({ detail }) => {
            setupScrollAnimations();
            if (detail.pageId === 'donde-comprar') bindB2BForm();
            if (detail.pageId === 'investigacion') setupInvestButtons();
        });
    }

    return { listenForRender, showToast, setupScrollAnimations };
})();

window.FormModule = FormModule;
