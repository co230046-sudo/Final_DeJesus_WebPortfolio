//Navbar Logic//
// ================== Navbar ================== //
const sections = Array.from(document.querySelectorAll('section'));
const getNavbar = (section) => section.querySelector('.Navbar');

let activeSectionIndex = -1;

function updateNavbars() {
  const scrollCenter = window.scrollY + window.innerHeight / 2;

  let newActive = activeSectionIndex;

  sections.forEach((section, i) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;

    if (scrollCenter >= top && scrollCenter < bottom) {
      newActive = i;
    }
  });

  if (newActive !== activeSectionIndex) {
    activeSectionIndex = newActive;
    sections.forEach((section, i) => {
      const nav = getNavbar(section);
      if (!nav) return;
      if (i === activeSectionIndex) nav.classList.add('visible');
      else nav.classList.remove('visible');
    });

    // Optional: highlight current item in the now-active navbar
    const currentSection = sections[activeSectionIndex];
    if (currentSection) {
      const nav = getNavbar(currentSection);
      const currentId = currentSection.id;
      nav?.querySelectorAll('li').forEach(li => {
        li.classList.toggle('animate-active', li.dataset.section === currentId);
      });
    }
  }
}

// rAF-throttled scroll
let ticking = false;
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => { updateNavbars(); ticking = false; });
    ticking = true;
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', updateNavbars);
document.addEventListener('DOMContentLoaded', updateNavbars);

// Smooth in-page nav
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});


//Slider Button Logic//
document.addEventListener("DOMContentLoaded", () => {

  // ================== Whole Project Card ================== //
  const projectSlider = document.querySelector(".project-slider");
  const projectCards = projectSlider.querySelectorAll(".Project-Card");
  const prevCardBtn = document.querySelector(".ProjectSection-Head .slider-btn.prev");
  const nextCardBtn = document.querySelector(".ProjectSection-Head .slider-btn.next");
  let cardIndex = 0;

  function showCard(index) {
    // Get computed gap between cards
    const gap = parseFloat(getComputedStyle(projectSlider).gap) || 0;
    const cardWidth = projectCards[0].offsetWidth;

    // Slide container including gap
    projectSlider.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;

    // Optional: toggle active class for hover effects
    projectCards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
  }

  prevCardBtn.addEventListener("click", () => {
    cardIndex = (cardIndex - 1 + projectCards.length) % projectCards.length;
    showCard(cardIndex);
  });

  nextCardBtn.addEventListener("click", () => {
    cardIndex = (cardIndex + 1) % projectCards.length;
    showCard(cardIndex);
  });

  showCard(cardIndex);

  // ================== Internal Image Sliders ================== //
  const holders = document.querySelectorAll(".Project-Img-Holder");

  holders.forEach(holder => {
    const slider = holder.querySelector(".slider");
    const slides = slider.querySelectorAll("img");
    const prevBtn = holder.querySelector(".prev");
    const nextBtn = holder.querySelector(".next");
    let imgIndex = 0;

    // Set slider width dynamically
    slider.style.width = `${slides.length * 100}%`;
    slides.forEach(slide => slide.style.flex = `0 0 ${100 / slides.length}%`);

    function showSlide(i) {
      slider.style.transform = `translateX(-${(100 / slides.length) * i}%)`;
    }

    prevBtn.addEventListener("click", () => {
      imgIndex = (imgIndex - 1 + slides.length) % slides.length;
      showSlide(imgIndex);
    });

    nextBtn.addEventListener("click", () => {
      imgIndex = (imgIndex + 1) % slides.length;
      showSlide(imgIndex);
    });

    showSlide(imgIndex);
  });

});

// ================== Animations ================== //
document.addEventListener("DOMContentLoaded", () => {
  function observeWithAnimation(selector, animationClass) {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(animationClass);
          void entry.target.offsetWidth; // 🔥 force reflow
          entry.target.classList.add(animationClass);
        }
      });
    }, { threshold: 0.2 });

    elements.forEach(el => observer.observe(el));
  }

  // HomePage
  observeWithAnimation(".Picture-Card-BG1", "swoop-in");
  observeWithAnimation(".HeadText1", "animate-head1");
  observeWithAnimation(".HeadText2", "animate-head2");
  observeWithAnimation(".CustomHR1", "nc-animate");
  observeWithAnimation(".SubText", "nc-animate");
  observeWithAnimation(".Btn-Section1", "btnFadeUp");


  // ProjectsPage
  observeWithAnimation(".ProjectSection-Head", "animate-head3");
  observeWithAnimation(".Project-Card", "bounce-in");

  // AboutMEPage
  observeWithAnimation(".AboutSection-Head", "bounceFadeIn");
  observeWithAnimation(".Picture-Card-BG2", "pop-up");
  observeWithAnimation(".Text-Section2", "swoop-fade");
  observeWithAnimation(".aboutText1", "swoop-fade");
  observeWithAnimation(".aboutText2", "swoop-fade");

  // ContactPage
  observeWithAnimation(".AboutTextBG", "swoopFadeLTR");
  observeWithAnimation(".ContactSectionWrapper1", "animate-in");
  observeWithAnimation(".ContactSectionWrapper1", "bounceInLeft");
  observeWithAnimation(".ContactSectionWrapper2", "bounceInRight");

});

// ================== Project Image Modal ================== //
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('imageModal');
    const modalSlider = modal.querySelector('.modal-slider');
    const closeBtn = modal.querySelector('.close');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    let currentImages = [];
    let currentIndex = 0;

    function showImage(index, direction = 1) {
        const newImg = document.createElement('img');
        newImg.src = currentImages[index].src;
        newImg.className = 'modal-img';
        newImg.style.transform = `translateX(${direction * 100}%)`;
        newImg.style.opacity = '0';

        modalSlider.appendChild(newImg);

        // trigger transition
        requestAnimationFrame(() => {
            newImg.style.transform = 'translateX(0%)';
            newImg.style.opacity = '1';
        });

        // remove old images after transition
        const oldImgs = modalSlider.querySelectorAll('img:not(:last-child)');
        oldImgs.forEach(img => {
            img.style.transform = `translateX(${-direction * 100}%)`;
            img.style.opacity = '0';
            setTimeout(() => img.remove(), 300); // match CSS transition duration
        });
    }

    document.querySelectorAll('.view-full-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            currentImages = Array.from(button.closest('.Project-Card').querySelectorAll('.slider img'));
            currentIndex = 0;

            modalSlider.innerHTML = '';
            showImage(currentIndex, 1);
            modal.style.display = 'flex';
        });
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        showImage(currentIndex, -1); // slide from left
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        showImage(currentIndex, 1); // slide from right
    });
});


