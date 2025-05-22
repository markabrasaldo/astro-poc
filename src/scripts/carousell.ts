const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const carouselTrack = document.querySelector(".carousel-track");
const carouselItems = document.querySelectorAll(".carousel-item");
const itemsToShow = 3;
let currentIndex = 0;

function updateCarousel() {
  const carouselItem = carouselItems[0] as HTMLElement;
  const itemWidth = (carouselItem && carouselItem.offsetWidth) ?? 0;
  const offset = -itemWidth * currentIndex * itemsToShow;
  if (carouselTrack)
    (carouselTrack as HTMLElement).style.transform = `translateX(${offset}px)`;
}

// --- Autoplay logic ---
let autoplayInterval: ReturnType<typeof setInterval> | null = null;
let autoplayResumeTimeout: ReturnType<typeof setTimeout> | null = null;

// Move to next slide
function goToNext() {
  if (currentIndex < Math.ceil(carouselItems.length / itemsToShow) - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateCarousel();
}

// Start autoplay (after hover)
function startAutoplay() {
  if (!autoplayInterval) {
    autoplayInterval = setInterval(goToNext, 3000);
  }
}

// Stop autoplay (on hover)
function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

// Pause, then resume autoplay after 1sec
function scheduleAutoplayResume() {
  if (autoplayResumeTimeout) clearTimeout(autoplayResumeTimeout);
  autoplayResumeTimeout = setTimeout(() => {
    startAutoplay();
  }, 1000);
}

// Start carousel immediately on load then continue
goToNext();
startAutoplay();

// --- Button Controls ---
if (nextButton) {
  nextButton.addEventListener("click", () => {
    goToNext();
  });
}

if (prevButton) {
  prevButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = Math.ceil(carouselItems.length / itemsToShow) - 1;
    }
    updateCarousel();
  });
}

// --- Pause on hover ---
carouselItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    stopAutoplay();
    if (autoplayResumeTimeout) clearTimeout(autoplayResumeTimeout);
  });

  item.addEventListener("mouseleave", () => {
    scheduleAutoplayResume();
  });
});
