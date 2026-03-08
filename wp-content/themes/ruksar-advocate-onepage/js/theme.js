/* ============================================================
   Ruksar Advocate OnePage — Theme JavaScript
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---------- Mobile Nav Toggle ---------- */
  var toggle = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.nav-mobile');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
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