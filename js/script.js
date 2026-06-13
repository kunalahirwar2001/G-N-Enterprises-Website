document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#siteHeader");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector("#navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const backToTop = document.querySelector(".back-to-top");
  const heroShowcase = document.querySelector("#heroShowcase");

  const closeMenu = () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const updateChrome = () => {
    const isScrolled = window.scrollY > 24;
    header.classList.toggle("scrolled", isScrolled);
    backToTop.classList.toggle("visible", window.scrollY > 600);
  };

  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (heroShowcase) {
    const heroImages = [
      "assets/site-photos/site-photo-02.jpg",
      "assets/site-photos/site-photo-04.jpg",
      "assets/site-photos/site-photo-07.jpg",
      "assets/site-photos/site-photo-08.jpg"
    ];
    let heroIndex = 0;

    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroImages.length;
      heroShowcase.classList.add("is-switching");

      window.setTimeout(() => {
        heroShowcase.src = heroImages[heroIndex];
        heroShowcase.classList.remove("is-switching");
      }, 260);
    }, 3600);
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      if (!id) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  const counters = document.querySelectorAll(".counter");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const counter = entry.target;
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || "";
      const duration = 1400;
      const start = performance.now();

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        counter.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          counter.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(animate);
      counterObserver.unobserve(counter);
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });

  const calculator = document.querySelector("#solarCalculator");
  const monthlyBill = document.querySelector("#monthlyBill");
  const calcMessage = document.querySelector("#calcMessage");
  const solarSize = document.querySelector("#solarSize");
  const monthlySavings = document.querySelector("#monthlySavings");
  const annualSavings = document.querySelector("#annualSavings");

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(value);
  };

  calculator.addEventListener("submit", (event) => {
    event.preventDefault();
    const bill = Number(monthlyBill.value);

    if (!Number.isFinite(bill) || bill <= 0) {
      calcMessage.textContent = "Please enter a valid monthly bill amount.";
      solarSize.textContent = "-- kW";
      monthlySavings.textContent = "₹ --";
      annualSavings.textContent = "₹ --";
      return;
    }

    const tariffPerUnit = 8;
    const unitsPerKwMonthly = 120;
    const monthlyUnits = bill / tariffPerUnit;
    const recommendedSize = Math.max(1, monthlyUnits / unitsPerKwMonthly);
    const cappedSize = Math.ceil(recommendedSize * 10) / 10;
    const estimatedMonthlySavings = bill * 0.9;
    const estimatedAnnualSavings = estimatedMonthlySavings * 12;

    calcMessage.textContent = "Estimate based on ₹8/unit tariff and up to 90% bill offset.";
    solarSize.textContent = `${cappedSize.toFixed(1)} kW`;
    monthlySavings.textContent = formatCurrency(estimatedMonthlySavings);
    annualSavings.textContent = formatCurrency(estimatedAnnualSavings);
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      faqItems.forEach((faq) => {
        faq.classList.remove("open");
        faq.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  let activeTestimonial = 0;
  let sliderTimer;

  const showTestimonial = (index) => {
    activeTestimonial = (index + testimonials.length) % testimonials.length;

    testimonials.forEach((testimonial, testimonialIndex) => {
      testimonial.classList.toggle("active", testimonialIndex === activeTestimonial);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeTestimonial);
    });
  };

  const restartSlider = () => {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => {
      showTestimonial(activeTestimonial + 1);
    }, 5200);
  };

  prev.addEventListener("click", () => {
    showTestimonial(activeTestimonial - 1);
    restartSlider();
  });

  next.addEventListener("click", () => {
    showTestimonial(activeTestimonial + 1);
    restartSlider();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index);
      restartSlider();
    });
  });

  restartSlider();
});
