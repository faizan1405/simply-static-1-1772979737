/* ============================================================
   Rukhsar Advocate OnePage — Theme JavaScript
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ==========================================================
     Premium Scroll-Reveal Animations
     ========================================================== */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    /* ---------- Mark elements for reveal ---------- */
    // Hero section children: heading, tagline, CTA, stats
    var homeSection = document.getElementById('home');
    if (homeSection) {
      var heroWidgets = homeSection.querySelectorAll(':scope > .e-con > .e-con > .elementor-widget, :scope > .e-con > .elementor-widget');
      // Fallback: get all direct child widgets/containers of the hero
      if (!heroWidgets.length) {
        heroWidgets = homeSection.querySelectorAll('.elementor-widget');
      }
      var heroChildren = homeSection.querySelectorAll(':scope > .e-con');
      var stIdx = 1;
      heroChildren.forEach(function (child) {
        child.classList.add('ra-reveal', 'ra-stagger-' + Math.min(stIdx, 6));
        stIdx++;
      });
      // Hero image
      var heroImg = homeSection.querySelector('.elementor-image');
      if (heroImg) {
        heroImg.classList.add('ra-img-reveal');
      }
    }

    // Section-level reveals for each major section (first element with each ID only)
    var sectionIds = ['about', 'credentials', 'testimonials', 'faq', 'contact'];
    sectionIds.forEach(function (id) {
      var section = document.querySelector('[id="' + id + '"]');
      if (section && (section.classList.contains('e-con') || section.classList.contains('elementor-widget'))) {
        section.classList.add('ra-reveal');
      }
    });

    // Softlite card boxes: stagger within their direct parent container
    var cardGroups = document.querySelectorAll('.e-con');
    cardGroups.forEach(function (group) {
      var cards = group.querySelectorAll(':scope > .elementor-widget-softlite_dynamic_card_box');
      if (cards.length > 1) {
        cards.forEach(function (card, i) {
          // Only add ra-reveal if no ancestor already has it (avoid nested opacity)
          var ancestor = card.closest('.ra-reveal');
          if (!ancestor) {
            card.classList.add('ra-reveal', 'ra-stagger-' + Math.min(i + 1, 6));
          }
        });
      }
    });

    // FAQ items stagger (only if not inside an already-reveal parent)
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item, i) {
      if (!item.closest('.ra-reveal')) {
        item.classList.add('ra-reveal', 'ra-stagger-' + Math.min(i + 1, 6));
      }
    });

    // Contact form
    var contactForm = document.querySelector('#contact .elementor-widget-html');
    if (contactForm) {
      contactForm.classList.add('ra-reveal');
    }

    // Practice areas / list widgets
    var listWidgets = document.querySelectorAll('.elementor-widget-softlite_dynamic_list');
    listWidgets.forEach(function (w) {
      w.classList.add('ra-reveal');
    });

    // Gold separators
    document.querySelectorAll('.gold-separator').forEach(function (sep) {
      sep.classList.add('ra-separator');
    });

    /* ---------- IntersectionObserver ---------- */
    var revealElements = document.querySelectorAll('.ra-reveal, .ra-img-reveal, .ra-separator');
    if ('IntersectionObserver' in window && revealElements.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ra-visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      revealElements.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show everything
      revealElements.forEach(function (el) { el.classList.add('ra-visible'); });
    }

    /* ---------- Stat counter animation ---------- */
    var statTexts = [];
    var statsContainer = document.querySelector('[data-id="2dad63b"]');
    if (statsContainer) {
      statTexts = statsContainer.querySelectorAll('.softlite-dynamic-card-box-text-1');
    }
    if (!statTexts.length) {
      // Fallback: find stat cards near hero (first 3 card-box-text-1 elements)
      var allStatTexts = document.querySelectorAll('#home .softlite-dynamic-card-box-text-1');
      if (allStatTexts.length) statTexts = allStatTexts;
    }

    if (statTexts.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      statTexts.forEach(function (el) { counterObserver.observe(el); });
    }

    function animateCounter(el) {
      var text = el.textContent.trim();
      var match = text.match(/^([\d,]+)([\+%]?)$/);
      if (!match) return;

      var target = parseInt(match[1].replace(/,/g, ''), 10);
      var suffix = match[2] || '';
      var duration = 1200;
      var start = performance.now();

      function update(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * eased);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }
  }

  /* ==========================================================
     Premium Animation Enhancements
     ========================================================== */

  /* ---------- Scroll Progress Bar ---------- */
  var progressBar = document.createElement('div');
  progressBar.className = 'ra-scroll-progress';
  document.body.appendChild(progressBar);

  function updateScrollProgress() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.transform = 'scaleX(' + (scrollTop / docHeight) + ')';
    }
  }

  /* ---------- Cursor Glow Follower ---------- */
  if (!prefersReducedMotion && window.innerWidth > 768) {
    var glowCursor = document.createElement('div');
    glowCursor.className = 'ra-glow-cursor';
    document.body.appendChild(glowCursor);

    var mouseX = 0, mouseY = 0;
    var glowX = 0, glowY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      // Smooth lerp follow
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glowCursor.style.left = glowX + 'px';
      glowCursor.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);
  }

  /* ---------- Parallax on hero elements ---------- */
  if (!prefersReducedMotion) {
    var heroSection = document.getElementById('home');
    var heroImage = heroSection ? heroSection.querySelector('.elementor-image, .hero-image') : null;

    var parallaxTicking = false;
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) {
        requestAnimationFrame(function () {
          var scrollY = window.scrollY;
          // Parallax hero image
          if (heroImage && scrollY < window.innerHeight) {
            heroImage.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
          }
          parallaxTicking = false;
        });
        parallaxTicking = true;
      }
    }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReducedMotion && window.innerWidth > 768) {
    var magneticBtns = document.querySelectorAll('.btn-gold, .btn-outline, .elementor-button');
    magneticBtns.forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Multi-direction reveals ---------- */
  if (!prefersReducedMotion) {
    // About section: slide from left
    var aboutSection = document.querySelector('[id="about"]');
    if (aboutSection) {
      var aboutChildren = aboutSection.querySelectorAll(':scope > .e-con > .e-con');
      aboutChildren.forEach(function (child, i) {
        if (!child.classList.contains('ra-reveal')) {
          child.classList.add('ra-reveal', i % 2 === 0 ? 'ra-from-left' : 'ra-from-right');
          child.classList.add('ra-stagger-' + Math.min(i + 1, 6));
        }
      });
    }

    // Practice area cards: scale in
    var practiceCards = document.querySelectorAll('.practice-card');
    practiceCards.forEach(function (card, i) {
      if (!card.classList.contains('ra-reveal')) {
        card.classList.add('ra-reveal', 'ra-scale-in', 'ra-stagger-' + Math.min(i + 1, 6));
      }
    });

    // Credentials items
    var credItems = document.querySelectorAll('.cred-item');
    credItems.forEach(function (item, i) {
      if (!item.classList.contains('ra-reveal')) {
        item.classList.add('ra-reveal', 'ra-stagger-' + Math.min(i + 1, 6));
      }
    });

    // Testimonial cards
    var testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(function (card, i) {
      if (!card.classList.contains('ra-reveal')) {
        card.classList.add('ra-reveal', 'ra-stagger-' + Math.min(i + 1, 6));
      }
    });

    // Re-observe newly added reveal elements
    var newRevealElements = document.querySelectorAll('.ra-reveal:not(.ra-visible)');
    if ('IntersectionObserver' in window && newRevealElements.length) {
      var enhancedObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ra-visible');
            enhancedObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });
      newRevealElements.forEach(function (el) { enhancedObserver.observe(el); });
    }
  }

  /* ---------- Text split reveal for hero heading ---------- */
  if (!prefersReducedMotion) {
    var heroHeading = document.querySelector('#home h1, #home .elementor-heading-title');
    if (heroHeading && !heroHeading.dataset.raSplit) {
      heroHeading.dataset.raSplit = 'true';
      var text = heroHeading.textContent;
      var words = text.split(' ');
      heroHeading.innerHTML = '';
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.1) + 's, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ' + (i * 0.1) + 's';
        heroHeading.appendChild(span);
      });
      // Trigger after a short delay
      setTimeout(function () {
        heroHeading.querySelectorAll('span').forEach(function (span) {
          span.style.opacity = '1';
          span.style.transform = 'none';
        });
      }, 300);
    }
  }

  /* ---------- Enhanced scroll handler ---------- */
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollProgress();

  /* ---------- Tilt effect on practice cards ---------- */
  if (!prefersReducedMotion && window.innerWidth > 768) {
    var tiltCards = document.querySelectorAll('.practice-card, .stat-card');
    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(function () { card.style.transition = ''; }, 500);
      });
    });
  }

  /* ---------- Smooth section reveal with active nav ---------- */
  if (!prefersReducedMotion) {
    var navLinks = document.querySelectorAll('.nav-desktop a[href*="#"]');
    if (navLinks.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id || entry.target.getAttribute('id');
            if (id) {
              navLinks.forEach(function (link) {
                link.style.color = '';
                if (link.getAttribute('href').includes('#' + id)) {
                  link.style.color = 'var(--gold)';
                }
              });
            }
          }
        });
      }, { threshold: 0.3, rootMargin: '-20% 0px -50% 0px' });

      ['home', 'about', 'practice-areas', 'credentials', 'testimonials', 'faq', 'contact'].forEach(function (id) {
        var section = document.getElementById(id);
        if (section) sectionObserver.observe(section);
      });
    }
  }

  /* ---------- Navbar scroll state + sticky offset ---------- */
  var header = document.querySelector('.site-header')
    || document.querySelector('[data-id="2de1395"]')
    || document.querySelector('.elementor-element-2de1395');
  if (header) {
    // Add spacer so content is not hidden behind the fixed header
    var spacer = document.createElement('div');
    spacer.className = 'ra-header-spacer';
    spacer.style.height = header.offsetHeight + 'px';
    header.parentNode.insertBefore(spacer, header.nextSibling);

    // Update spacer + scroll-padding on resize
    function updateSpacer() {
      var h = header.offsetHeight;
      spacer.style.height = h + 'px';
      document.documentElement.style.scrollPaddingTop = h + 'px';
    }
    window.addEventListener('resize', updateSpacer);
    updateSpacer();

    var ticking = false;
    function updateHeader() {
      if (window.scrollY > 60) {
        header.classList.add('ra-scrolled');
      } else {
        header.classList.remove('ra-scrolled');
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
    updateHeader();
  }

  /* ---------- Mobile Nav Toggle ---------- */
  var toggle = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    // Position mobile nav below the fixed header
    function positionMobileNav() {
      if (header) {
        mobileNav.style.top = header.offsetHeight + 'px';
      }
    }

    toggle.addEventListener('click', function () {
      positionMobileNav();
      mobileNav.classList.toggle('open');
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (fi) { fi.classList.remove('open'); });
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ---------- Testimonials Slider ---------- */
  var track = document.querySelector('.testimonials-track');
  var dots = document.querySelectorAll('.slider-dots button');
  var currentSlide = 0;

  function getPerView() { return window.innerWidth >= 768 ? 3 : 1; }

  function goToSlide(index) {
    if (!track) return;
    var perView = getPerView();
    var totalSlides = document.querySelectorAll('.testimonial-slide').length;
    var maxIndex = Math.max(0, totalSlides - perView);
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    currentSlide = index;
    var pct = (100 / totalSlides) * index;
    track.style.transform = 'translateX(-' + pct + '%)';
    dots.forEach(function (d, i) { d.classList.toggle('active', i === index); });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goToSlide(i); });
  });
  window.addEventListener('resize', function () { goToSlide(currentSlide); });

  /* ---------- Preferred Date: min = today ---------- */
  var dateInput = document.querySelector('input[name="preferredDate"]');
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  /* ---------- WhatsApp Consultation Form ---------- */
	var form = document.getElementById('whatsapp-form')
        || document.getElementById('whatsappConsultForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var fields = {
      fullName:        (form.elements.fullName.value        || '').trim(),
      phone:           (form.elements.phone.value           || '').trim(),
      practiceArea:     form.elements.practiceArea.value     || '',
      preferredDate:    form.elements.preferredDate.value    || '',
      appointmentTime:  form.elements.appointmentTime.value  || '',
      issueSummary:    (form.elements.issueSummary.value     || '').trim()
    };

    if (!fields.fullName || !fields.phone || !fields.practiceArea ||
        !fields.preferredDate || !fields.appointmentTime || !fields.issueSummary) {
      alert('Please fill in all required fields before sending.');
      return;
    }

    var message = 'Hello, I would like to book a legal consultation.\n\n'
      + 'Full Name: '        + fields.fullName       + '\n'
      + 'Phone Number: '     + fields.phone          + '\n'
      + 'Practice Area: '    + fields.practiceArea   + '\n'
      + 'Preferred Date: '   + fields.preferredDate  + '\n'
      + 'Appointment Time: ' + fields.appointmentTime + '\n'
      + 'Issue Summary: '    + fields.issueSummary;

    var waURL = 'https://wa.me/919313570206?text=' + encodeURIComponent(message);

    var opened = window.open(waURL, '_blank');
    if (!opened) {
      window.location.href = waURL;
    }
  });
});