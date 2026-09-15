/* ============================================
   PRIME HANDYMAN SERVICE LLC - Main JS
   ============================================ */

(function () {
  'use strict';

  /* ------------------------------------------
     Mobile menu
  ------------------------------------------ */
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menuBtn.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ------------------------------------------
     Sticky mobile CTA body class
  ------------------------------------------ */
  if (document.querySelector('.mobile-sticky-cta')) {
    document.body.classList.add('has-sticky-cta');
  }

  /* ------------------------------------------
     Gallery filters
  ------------------------------------------ */
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        galleryItems.forEach((item) => {
          if (filter === 'all' || item.dataset.cat === filter) {
            item.classList.add('visible');
          } else {
            item.classList.remove('visible');
          }
        });
      });
    });
  }

  /* ------------------------------------------
     ZIP service area checker
     Service ZIPs grouped by tier
  ------------------------------------------ */
  const PRIMARY_ZIPS = new Set([
    '85301', '85302', '85303', '85304', '85305', '85306', '85307', '85308', '85309', '85310',
    '85311', '85312', '85318', '85345', '85355', '85363', '85373', '85378', '85379', '85380',
    '85381', '85382', '85383', '85385', '85387',
  ]);
  const EXTENDED_ZIPS = new Set([
    '85031', '85033', '85035', '85037', '85043', '85323', '85326', '85329', '85335', '85338',
    '85339', '85340', '85351', '85353', '85354', '85361', '85374', '85375', '85383', '85388',
    '85392', '85395',
  ]);

  const zipForm = document.querySelector('.zip-form');
  if (zipForm) {
    zipForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = zipForm.querySelector('input[type="text"]');
      const result = document.querySelector('.zip-result');
      const zip = (input.value || '').trim();

      result.className = 'zip-result';

      if (!/^\d{5}$/.test(zip)) {
        result.classList.add('outside');
        result.textContent = 'Please enter a valid 5-digit ZIP code.';
        return;
      }

      if (PRIMARY_ZIPS.has(zip)) {
        result.classList.add('success');
        result.innerHTML =
          "✓ You're in our primary service area. Text photos to <a href='sms:6232278884'>623-227-8884</a> and we'll get back fast.";
      } else if (EXTENDED_ZIPS.has(zip)) {
        result.classList.add('partial');
        result.innerHTML =
          "✓ You may be in our extended service area. Text your address and scope to <a href='sms:6232278884'>623-227-8884</a> to confirm availability.";
      } else {
        result.classList.add('outside');
        result.innerHTML =
          "We may still be able to help. Text us your address and scope at <a href='sms:6232278884'>623-227-8884</a> and we'll confirm.";
      }
    });
  }

  /* ------------------------------------------
     Pricing calculator (educational)
  ------------------------------------------ */
  const calcForm = document.getElementById('pricing-calc');
  if (calcForm) {
    const hoursInput = document.getElementById('calc-hours');
    const materialsInput = document.getElementById('calc-materials');
    const pickupInput = document.getElementById('calc-pickup');
    const timeWindow = document.getElementById('calc-window');
    const resultEl = document.getElementById('calc-result-value');
    const flagEl = document.getElementById('calc-deposit-flag');

    function updateCalc() {
      const hours = Math.max(0, parseFloat(hoursInput.value) || 0);
      const materials = Math.max(0, parseFloat(materialsInput.value) || 0);
      const pickup = pickupInput.checked;
      const window = timeWindow.value;

      let multiplier = 1;
      if (window === 'after') multiplier = 0.75;
      if (window === 'weekend') multiplier = 1.25;

      // Service call: $139 base, then $99/hr after first hour
      let labor = 139;
      if (hours > 1) {
        labor += (hours - 1) * 99 * multiplier;
      }

      // Pickup transport: $25 flat estimate
      const transport = pickup ? 25 : 0;

      const total = labor + materials + transport;
      resultEl.textContent = '$' + total.toFixed(0);

      // Deposit flag: materials over $200 OR total over $400 = 50% deposit
      if (materials > 200 || total > 400) {
        flagEl.style.display = 'block';
      } else {
        flagEl.style.display = 'none';
      }
    }

    [hoursInput, materialsInput, pickupInput, timeWindow].forEach((el) => {
      el.addEventListener('input', updateCalc);
      el.addEventListener('change', updateCalc);
    });
    updateCalc();
  }

  /* ------------------------------------------
     Reveal on scroll
  ------------------------------------------ */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }

  /* ------------------------------------------
     Service selector (estimate form)
     Hides/shows fields based on category
  ------------------------------------------ */
  const serviceSelect = document.getElementById('service-category');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', () => {
      // No-op for now, but the hook is here for dynamic fields
    });
  }

  /* ------------------------------------------
     Estimate form submission
     Builds a mailto: with all the form data
  ------------------------------------------ */
  const estimateForm = document.getElementById('estimate-form');
  if (estimateForm) {
    estimateForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(estimateForm);
      const data = Object.fromEntries(formData.entries());

      // Compose mailto subject + body
      const subject = encodeURIComponent(
        `Prime Handyman Estimate Request — ${data.name || 'Lead'}`
      );

      const lines = [
        `Name: ${data.name || ''}`,
        `Phone: ${data.phone || ''}`,
        `Email: ${data.email || ''}`,
        `Service Address: ${data.address || ''}`,
        `City / ZIP: ${data.city || ''} ${data.zip || ''}`,
        `Property Type: ${data.property || ''}`,
        `Role: ${data.role || ''}`,
        `Decision Maker Present: ${data.dm || ''}`,
        `Service Category: ${data.category || ''}`,
        `Urgency: ${data.urgency || ''}`,
        `Preferred Date/Time: ${data.datetime || ''}`,
        `Pets on Site: ${data.pets || ''}`,
        `Gate Code / Access: ${data.access || ''}`,
        `HOA Restrictions: ${data.hoa || ''}`,
        `Hazards / Utilities / Safety: ${data.hazards || ''}`,
        `Materials Already Purchased: ${data.materials || ''}`,
        `Budget Sensitivity: ${data.budget || ''}`,
        '',
        'Problem Description:',
        data.problem || '',
        '',
        '---',
        'Submitted from prime-handyman-az.com',
      ];

      const body = encodeURIComponent(lines.join('\n'));
      // Save a copy in localStorage so thank-you page can show summary
      try {
        localStorage.setItem('prime_estimate_summary', JSON.stringify(data));
      } catch (e) { /* localStorage may be blocked */ }
      // Open the user's mail client
      window.location.href = `mailto:bryan.lewis@prime-handyman-az.com?subject=${subject}&body=${body}`;
      // Redirect to thank-you page after a short delay so the mailto can fire
      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 600);
    });
  }

  /* ------------------------------------------
     Smooth scroll for hash links
  ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
