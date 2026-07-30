/* ============================================================
   COURSE OUTLINE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. TAB SWITCHING ---------- */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      tabSections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const section = document.getElementById('tab-' + target);
      if (section) {
        section.classList.add('active');
        // Re-trigger animations on outcome cards when switching to outcomes
        if (target === 'outcomes') animateOutcomes();
        if (target === 'breakdown') animateBar();
      }
    });
  });

  /* Scroll hero down arrow → go to tabs */
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      document.getElementById('tabNav')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------- 2. MODULE ACCORDIONS ---------- */
  document.querySelectorAll('.module-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.module-card');
      const isOpen = card.classList.contains('open');

      // Close all
      document.querySelectorAll('.module-card.open').forEach(c => c.classList.remove('open'));

      // Toggle clicked
      if (!isOpen) card.classList.add('open');
    });
  });

  /* Open first module by default */
  const firstCard = document.querySelector('.module-card');
  if (firstCard) firstCard.classList.add('open');

  /* ---------- 3. TIMELINE HOVER TOOLTIPS ---------- */
  const tlTooltip = document.getElementById('tlTooltip');

  document.querySelectorAll('.tl-node[data-topics]').forEach(node => {
    node.addEventListener('mouseenter', (e) => {
      const topics = node.dataset.topics.split('|').map(t => t.trim());
      const listItems = topics.map(t => `<li>${t}</li>`).join('');
      tlTooltip.innerHTML = `<ul>${listItems}</ul>`;
      tlTooltip.classList.add('visible');
      positionTooltip(e);
    });

    node.addEventListener('mousemove', positionTooltip);

    node.addEventListener('mouseleave', () => {
      tlTooltip.classList.remove('visible');
    });
  });

  function positionTooltip(e) {
    const x = e.clientX + 15;
    const y = e.clientY - 10;
    const tw = tlTooltip.offsetWidth;
    const th = tlTooltip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    tlTooltip.style.left = (x + tw > vw ? x - tw - 30 : x) + 'px';
    tlTooltip.style.top  = (y + th > vh ? y - th : y) + 'px';
  }

  /* ---------- 4. BREAKDOWN BAR TOOLTIPS ---------- */
  const barTooltip = document.getElementById('barTooltip');
  const segments   = document.querySelectorAll('.bar-segment');

  segments.forEach(seg => {
    seg.addEventListener('mouseenter', () => {
      barTooltip.textContent = seg.dataset.content;
      barTooltip.classList.add('visible');
      // Position tooltip closer to hovered segment
      const rect   = seg.getBoundingClientRect();
      const barRect = seg.closest('.breakdown-bar').getBoundingClientRect();
      const relLeft = rect.left + rect.width / 2 - barRect.left;
      barTooltip.style.left = relLeft + 'px';
      barTooltip.style.transform = 'translateX(-50%)';
    });

    seg.addEventListener('mouseleave', () => {
      barTooltip.classList.remove('visible');
    });
  });

  /* ---------- 5. ANIMATE BAR ON LOAD ---------- */
  function animateBar() {
    segments.forEach(seg => {
      const target = seg.dataset.pct + '%';
      seg.style.width = '0%';
      setTimeout(() => {
        seg.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1)';
        seg.style.width = target;
      }, 50);
    });
  }

  /* ---------- 6. ANIMATE OUTCOME CARDS ---------- */
  function animateOutcomes() {
    document.querySelectorAll('.outcome-card').forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 70);
    });
  }

  /* ---------- 7. INTERSECTION OBSERVER — fade-in on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.module-card, .bk-card, .bl-item, .tl-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
  });

  /* ---------- 8. STICKY NAV SHADOW ON SCROLL ---------- */
  const tabNav = document.getElementById('tabNav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      tabNav.style.boxShadow = '0 4px 24px rgba(30,40,80,0.12)';
    } else {
      tabNav.style.boxShadow = '0 2px 16px rgba(30,40,80,0.06)';
    }
  }, { passive: true });

  /* ---------- 9. MODULE CARD KEYBOARD ACCESSIBILITY ---------- */
  document.querySelectorAll('.module-header').forEach(header => {
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  /* ---------- 10. HIGHLIGHT ACTIVE LEGEND ITEM ON HOVER ---------- */
  document.querySelectorAll('.bl-item').forEach(item => {
    const type = item.dataset.type;
    item.addEventListener('mouseenter', () => {
      segments.forEach(seg => {
        seg.style.opacity = seg.dataset.type === type ? '1' : '0.35';
      });
    });
    item.addEventListener('mouseleave', () => {
      segments.forEach(seg => { seg.style.opacity = '1'; });
    });
  });

});
