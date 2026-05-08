document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('nav-toggle');

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (navToggle) navToggle.checked = false;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('reviews-prev');
  const nextBtn = document.getElementById('reviews-next');
  const dotsContainer = document.getElementById('reviews-dots');

  if (track && prevBtn && nextBtn) {
    const cards = track.querySelectorAll('.reviews__card');
    let currentIndex = 0;

    const getCardWidth = () => {
      const card = cards[0];
      if (!card) return 0;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 24;
      return card.offsetWidth + gap;
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Aller à l'avis ${i + 1}`);
        dot.style.cssText = `
          width: 8px; height: 8px; border-radius: 50%; border: none; cursor: pointer;
          background-color: ${i === currentIndex ? 'var(--color-primary)' : 'var(--color-neutral-dark)'};
          transition: background-color 0.3s ease, transform 0.3s ease;
          transform: ${i === currentIndex ? 'scale(1.3)' : 'scale(1)'};
          padding: 0;
        `;
        dot.addEventListener('click', () => scrollTo(i));
        dotsContainer.appendChild(dot);
      });
    };

    const scrollTo = (index) => {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      track.scrollTo({ left: currentIndex * getCardWidth(), behavior: 'smooth' });
      updateDots();
    };

    prevBtn.addEventListener('click', () => scrollTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => scrollTo(currentIndex + 1));

    track.addEventListener('scroll', () => {
      const cardWidth = getCardWidth();
      if (cardWidth > 0) {
        currentIndex = Math.round(track.scrollLeft / cardWidth);
        updateDots();
      }
    });

    updateDots();

    let autoScrollInterval = setInterval(() => {
      const next = currentIndex + 1 >= cards.length ? 0 : currentIndex + 1;
      scrollTo(next);
    }, 4500);

    track.addEventListener('mouseenter', () => clearInterval(autoScrollInterval));
    track.addEventListener('touchstart', () => clearInterval(autoScrollInterval), { passive: true });
  }

  const fileInput = document.getElementById('photo');
  const fileLabel = document.querySelector('.contact__file-label span');

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      fileLabel.textContent = file ? file.name : 'Choisir un fichier';
    });
  }
});
