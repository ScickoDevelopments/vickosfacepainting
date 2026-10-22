document.addEventListener('DOMContentLoaded', () => {
  const updateParallax = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = scrollY * 0.08;
    document.body.style.backgroundPosition = `center ${-offset}px`;
  };

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  const buildImageTitle = (fileName) => {
    return fileName
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderGallery = (container, images, limit) => {
    if (!container || !Array.isArray(images) || !images.length) {
      return;
    }

    const items = typeof limit === 'number' ? images.slice(0, limit) : images;
    container.innerHTML = items.map((image) => {
      const title = image.title || image.alt || buildImageTitle(image.src.split('/').pop());
      const src = image.src || '';
      const alt = image.alt || title;

      return `
        <figure class="gallery-item">
          <img src="${src}" alt="${alt}" loading="lazy">
        </figure>
      `;
    }).join('');
  };

  const galleryImages = Array.isArray(window.galleryImages) ? window.galleryImages : [];
  const homeGallery = document.getElementById('home-gallery');
  const fullGallery = document.getElementById('full-gallery');

  if (homeGallery) {
    renderGallery(homeGallery, galleryImages, 8);
  }

  if (fullGallery) {
    renderGallery(fullGallery, galleryImages);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('show');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        menu.classList.remove('show');
      }
    });
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();

      const button = form.querySelector('.btn-primary');
      const label = button.textContent;
      const formData = new FormData(form);

      const name = (formData.get('name') || '').toString().trim();
      const phone = (formData.get('phone') || '').toString().trim();
      const eventDetails = (formData.get('event_details') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();
      const subject = `New enquiry from ${name || 'customer'}`;

      button.textContent = 'Opening email...';
      button.disabled = true;

      const mailtoBody = encodeURIComponent(
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Event date & location: ${eventDetails}\n\n` +
        `Event details:\n${message}`
      );

      window.location.href = `mailto:scottjohnson9999@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

      setTimeout(() => {
        button.textContent = label;
        button.disabled = false;
        form.reset();
      }, 2500);
    });
  }

  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const dots = carousel.querySelector('.carousel-dots');
    const prevButton = carousel.querySelector('.carousel-control.prev');
    const nextButton = carousel.querySelector('.carousel-control.next');
    let activeIndex = 0;
    let autoplay = null;

    const renderDots = () => {
      dots.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (index === activeIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.addEventListener('click', () => {
          goToSlide(index);
        });
        dots.appendChild(dot);
      });
    };

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === activeIndex);
      });
      const slideWidth = slides[0].getBoundingClientRect().width;
      const trackPadding = parseFloat(getComputedStyle(carousel.querySelector('.carousel-track')).paddingLeft);
      const offset = activeIndex * -slideWidth + trackPadding - (carousel.clientWidth - slideWidth) / 2;
      carousel.querySelector('.carousel-track').style.transform = `translateX(${offset}px)`;
      dots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
      });
    };

    const goToSlide = index => {
      const slideCount = slides.length;
      activeIndex = (index + slideCount) % slideCount;
      updateSlides();
      resetAutoplay();
    };

    const prevSlide = () => goToSlide(activeIndex - 1);
    const nextSlide = () => goToSlide(activeIndex + 1);

    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    const resetAutoplay = () => {
      clearInterval(autoplay);
      autoplay = setInterval(nextSlide, 5500);
    };

    renderDots();
    updateSlides();
    resetAutoplay();
  }

  // Fallback for missing `vicko.png` — replace with a default image if it fails to load
  const vickoImg = document.querySelector('.vicko-photo');
  if (vickoImg) {
    vickoImg.addEventListener('error', () => {
      if (vickoImg.src && !vickoImg.dataset._fallback) {
        vickoImg.dataset._fallback = '1';
        vickoImg.src = 'a19.png';
      }
    });
  }
});
