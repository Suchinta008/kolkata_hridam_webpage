/**
 * Kolkata Hridam (কলকাতা হৃদম)
 * Official NGO Portal JavaScript
 * Features: Bilingual switcher (EN/BN), Donation Impact Calculator,
 * Dynamic UPI QR, Copy Clipboard, Gallery Filters, Volunteer Modal, Animated Counters.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initNavbarScroll();
  initStatCounters();
  initDonationCalculator();
  initGalleryFilter();
  initForms();
  initBackToTop();
  initAOS();
});

/* ==========================================================================
   1. Bilingual Language Switcher (EN / BN)
   ========================================================================== */
const translations = {
  en: {
    langBtn: "বাংলা",
    badgeActive: "EN",
    donateBtn: "Donate Now",
    volunteerBtn: "Join as Volunteer"
  },
  bn: {
    langBtn: "English",
    badgeActive: "বাং",
    donateBtn: "দান করুন",
    volunteerBtn: "স্বেচ্ছাসেবক হন"
  }
};

function initLanguage() {
  const savedLang = localStorage.getItem('hridam_lang') || 'en';
  applyLanguage(savedLang);

  const langBtn = document.getElementById('langSwitcherBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      const currentLang = document.documentElement.getAttribute('lang') || 'en';
      const newLang = currentLang === 'en' ? 'bn' : 'en';
      applyLanguage(newLang);
    });
  }
}

function applyLanguage(lang) {
  document.documentElement.setAttribute('lang', lang);
  localStorage.setItem('hridam_lang', lang);

  // Update all elements with data-en and data-bn
  const translatableElements = document.querySelectorAll('[data-en][data-bn]');
  translatableElements.forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.innerHTML = text;
      }
    }
  });

  // Update language switcher button label
  const langLabel = document.getElementById('langBtnText');
  const langBadge = document.getElementById('langBtnBadge');
  if (langLabel && langBadge) {
    langLabel.textContent = translations[lang].langBtn;
    langBadge.textContent = translations[lang].badgeActive;
  }

  // Update dynamic donation impact text if present
  if (typeof updateImpactMessage === 'function') {
    updateImpactMessage();
  }
}

/* ==========================================================================
   2. Navbar Scroll Behavior
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.main-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. Animated Stat Counters
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const duration = 2000;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = target.toLocaleString('en-IN');
              clearInterval(timer);
            } else {
              counter.textContent = Math.floor(current).toLocaleString('en-IN');
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('impact-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. Interactive Donation & Impact Calculator
   ========================================================================== */
let selectedCause = 'education';
let selectedAmount = 1000;

const impactData = {
  education: {
    500: {
      en: "Provides school bags, notebooks & stationery kits for 1 child.",
      bn: "১ জন শিশুর জন্য স্কুল ব্যাগ, খাতা ও শিক্ষা সামগ্রীর ব্যবস্থা করে।"
    },
    1000: {
      en: "Sponsors 1 month of evening coaching, books & nutrition for 2 children.",
      bn: "২ জন শিশুর ১ মাসের সান্ধ্যকালীন টিউশন ও পুষ্টিকর জলখাবার নিশ্চিত করে।"
    },
    2500: {
      en: "Funds complete educational aid, uniforms & test fees for 5 underprivileged students.",
      bn: "৫ জন ছাত্রছাত্রীর পোশাক, বই ও বার্ষিক শিক্ষা সহায়তা প্রদান করে।"
    },
    5000: {
      en: "Establishes a mini learning & digital literacy center in a rural hamlet for 25+ kids.",
      bn: "একটি গ্রামীণ এলাকায় ২৫+ শিশুর জন্য কম্পিউটার ও সাক্ষরতা কেন্দ্র পরিচালনা করতে সাহায্য করে।"
    }
  },
  health: {
    500: {
      en: "Covers general diagnostic screening and eye checkup for 2 senior citizens.",
      bn: "২ জন প্রবীণ নাগরিকের প্রাথমিক রক্তচাপ, ডায়াবেটিস ও চক্ষু পরীক্ষা সম্পন্ন করে।"
    },
    1000: {
      en: "Supplies essential prescription medicines & glucose checks to 5 chronic patients.",
      bn: "৫ জন দুস্থ রোগীর জন্য ১ মাসের জরুরি প্রেসক্রিপশন ও ওষুধ সরবরাহ করে।"
    },
    2500: {
      en: "Sponsors 1 full-day mobile health camp with doctor consultation for 80+ villagers.",
      bn: "৮০+ গ্রামবাসীর জন্য বিশেষজ্ঞ ডাক্তার ও রক্তদান/স্বাস্থ্য শিবিরের আয়োজন সম্পন্ন করে।"
    },
    5000: {
      en: "Funds comprehensive medical checkups, cataract screenings & spectacles for 25 patients.",
      bn: "২৫ জন সুবিধাবঞ্চিত মানুষের চোখের ছানি পরীক্ষা ও বিনামূল্যে চশমা বিতরণ সহায়তা করে।"
    }
  },
  relief: {
    500: {
      en: "Provides 1 emergency dry-ration grocery kit (rice, dal, oil, soap) to a destitute family.",
      bn: "১টি দুস্থ পরিবারের জন্য ১ সপ্তাহের শুকনো রেশন কিট (চাল, ডাল, তেল, সাবান) প্রদান করে।"
    },
    1000: {
      en: "Supplies warm winter blankets and hygiene essentials for 2 homeless elderly persons.",
      bn: "২ জন অসহায় বয়স্ক মানুষের জন্য শীতের কম্বল ও স্বাস্থ্যবিধি কিট প্রদান করে।"
    },
    2500: {
      en: "Supports rehabilitation kits and tarpaulin roofing aid for flood/cyclone affected households.",
      bn: "দুর্যোগপ্রবণ অঞ্চলে ক্ষতিগ্রস্ত পরিবারের জন্য ত্রিপল ও আশ্রয় মেরামতের সামগ্রী প্রদান করে।"
    },
    5000: {
      en: "Delivers deep tubewell repair & clean drinking water access for an entire community cluster.",
      bn: "একটি প্রত্যন্ত পল্লীর নলকূপ মেরামত ও বিশুদ্ধ পানীয় জলের দীর্ঘমেয়াদী ব্যবস্থা করে।"
    }
  }
};

function initDonationCalculator() {
  const causePills = document.querySelectorAll('.donation-cause-pill');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('customAmountInput');

  causePills.forEach(pill => {
    pill.addEventListener('click', () => {
      causePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedCause = pill.getAttribute('data-cause') || 'education';
      updateImpactMessage();
      updateUPIQR();
    });
  });

  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.getAttribute('data-amount'), 10) || 1000;
      if (customInput) customInput.value = '';
      updateImpactMessage();
      updateUPIQR();
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val && val > 0) {
        amountBtns.forEach(b => b.classList.remove('active'));
        selectedAmount = val;
        updateImpactMessage();
        updateUPIQR();
      }
    });
  }

  updateImpactMessage();
  updateUPIQR();
}

function updateImpactMessage() {
  const impactMsgEl = document.getElementById('impactOutcomeText');
  if (!impactMsgEl) return;

  const currentLang = document.documentElement.getAttribute('lang') || 'en';
  let message = "";

  const causeData = impactData[selectedCause] || impactData.education;
  if (causeData[selectedAmount]) {
    message = causeData[selectedAmount][currentLang];
  } else {
    if (currentLang === 'bn') {
      message = `আপনার ₹${selectedAmount.toLocaleString('en-IN')} অনুদান আমাদের সামগ্রিক সমাজকল্যাণমূলক কার্যক্রমে প্রত্যক্ষ প্রভাব ফেলবে।`;
    } else {
      message = `Your donation of ₹${selectedAmount.toLocaleString('en-IN')} will directly empower community welfare and relief initiatives.`;
    }
  }

  impactMsgEl.textContent = message;
}

function updateUPIQR() {
  const upiId = "kolkatahridam@sbi";
  const upiName = "Kolkata Hridam";
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${selectedAmount}&cu=INR&tn=Donation%20to%20Kolkata%20Hridam`;

  // Update dynamic QR image using a fast, high-contrast QR generator API
  const qrImg = document.getElementById('upiQrImage');
  if (qrImg) {
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(upiUrl)}`;
  }

  const amtDisplay = document.getElementById('qrAmountDisplay');
  if (amtDisplay) {
    amtDisplay.textContent = `₹${selectedAmount.toLocaleString('en-IN')}`;
  }
}

// Global copy helper for UPI and Bank Details
window.copyToClipboard = function (text, successMsg) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg || "Copied to clipboard!");
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMsg || "Copied to clipboard!");
  });
};

/* ==========================================================================
   5. Photo & Event Gallery Filter & Modal Lightbox
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-col');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

window.openGalleryModal = function (imgSrc, title, desc) {
  const modalImg = document.getElementById('galleryModalImage');
  const modalTitle = document.getElementById('galleryModalTitle');
  const modalDesc = document.getElementById('galleryModalDesc');

  if (modalImg) modalImg.src = imgSrc;
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;

  const modalEl = document.getElementById('galleryPreviewModal');
  if (modalEl && window.bootstrap) {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }
};

/* ==========================================================================
   6. Contact & Volunteer Actions
   ========================================================================== */
function initForms() {
  // Direct communication channels (WhatsApp, Phone, Email, Office Visit)
  // are connected directly without requiring backend form handlers.
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('backToTopBtn');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. Generic Toast Alert Notification
   ========================================================================== */
function showToast(message) {
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;

  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-dark border-0 show shadow-lg mb-2';
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center gap-2">
        <i class="bi bi-check-circle-fill text-success fs-5"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toastEl);
  setTimeout(() => {
    toastEl.classList.remove('show');
    setTimeout(() => toastEl.remove(), 400);
  }, 4000);
}

/* ==========================================================================
   9. AOS (Animate on Scroll) Initialization
   ========================================================================== */
function initAOS() {
  if (window.AOS) {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      easing: 'ease-out-cubic'
    });
  }
}
