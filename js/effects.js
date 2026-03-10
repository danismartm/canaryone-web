/* ============================================================
   js/effects.js – Visual effects: Parallax + 3D Card Tilt
   ============================================================ */

const Effects = (() => {
    let _active = false;
    let heroSection = null;
    const TILT = 14; // max tilt degrees

    /* ── Init: attach once, reactivate on page render ── */
    function init() {
        document.addEventListener('pageRendered', ({ detail }) => {
            if (detail.pageId === 'landing') attachLanding();
        });
        document.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    /* ── Re-attach references when landing renders ── */
    function attachLanding() {
        heroSection = document.querySelector('.hero');
        _active = !!heroSection;

        if (heroSection) {
            heroSection.addEventListener('mouseleave', resetCards);
        }
    }

    /* ── Mouse move handler ── */
    function onMouseMove(e) {
        if (!_active || !heroSection) return;

        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;

        // Parallax bg
        const bg = heroSection.querySelector('.hero-bg');
        if (bg) bg.style.transform = `translate(${dx * -18}px, ${dy * -12}px)`;

        // 3D tilt on each floating card
        heroSection.querySelectorAll('.fcard').forEach((card, i) => {
            const dir = i % 2 === 0 ? 1 : -1;
            const rx = -dy * TILT * .65 * dir;
            const ry = dx * TILT * .65 * dir;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            card.style.boxShadow = `${-dx * 18}px ${-dy * 18}px 36px rgba(0,0,0,.5), 0 0 50px rgba(212,168,67,${0.04 + Math.abs(dx) * 0.1})`;
        });
    }

    /* ── Reset cards when mouse leaves hero ── */
    function resetCards() {
        if (!heroSection) return;
        heroSection.querySelectorAll('.fcard').forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
    }

    return { init, attachLanding };
})();

window.Effects = Effects;
