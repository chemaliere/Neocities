  const images = document.querySelectorAll('.slideshow-image');
  const toggleBtn = document.getElementById('slideshow-toggle');
  const toggleIcon = document.getElementById('slideshow-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentIndex = 0;
  let interval = null;
  let playing = true;

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.remove('active');
      if (i === index) img.classList.add('active');
    });
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  }

  function startSlideshow() {
    interval = setInterval(nextImage, 3000);
    playing = true;
    toggleIcon.innerHTML = `
      <rect x="6" y="5" width="4" height="14"/>
      <rect x="14" y="5" width="4" height="14"/>
    `;
  }

  function stopSlideshow() {
    clearInterval(interval);
    playing = false;
    toggleIcon.innerHTML = `
      <polygon points="6,5 18,12 6,19" />
    `;
  }

  toggleBtn.addEventListener('click', () => {
    if (playing) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  });

  nextBtn.addEventListener('click', () => {
    stopSlideshow();
    nextImage();
  });

  prevBtn.addEventListener('click', () => {
    stopSlideshow();
    prevImage();
  });

  // Start on load
  showImage(currentIndex);
  startSlideshow();