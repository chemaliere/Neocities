// 🪟 Floating Announcement Window

// DOM Elements
const windowBox = document.getElementById('window');
const minimizeBtn = document.getElementById('minimize-btn');
const minimizedBar = document.getElementById('minimized-bar');
const closeBtn = document.getElementById('close-btn');
const header = document.getElementById("window-header");
const resizeHandle = document.getElementById("resize-handle");

// Load saved state or default to minimized
const isMinimized = localStorage.getItem('windowMinimized');
if (isMinimized === null || isMinimized === 'true') {
  windowBox.style.display = 'none';
  minimizedBar.style.display = 'block';
} else {
  windowBox.style.display = 'block';
  minimizedBar.style.display = 'none';
}

// Load window position/size if available
const savedLeft = localStorage.getItem('windowLeft');
const savedTop = localStorage.getItem('windowTop');
const savedWidth = localStorage.getItem('windowWidth');
const savedHeight = localStorage.getItem('windowHeight');

if (savedLeft) windowBox.style.left = `${savedLeft}px`;
if (savedTop) windowBox.style.top = `${savedTop}px`;
if (savedWidth) windowBox.style.width = `${savedWidth}px`;
if (savedHeight) windowBox.style.height = `${savedHeight}px`;

// --- Minimize / Restore ---
minimizeBtn.addEventListener('click', () => {
  windowBox.style.display = 'none';
  minimizedBar.style.display = 'block';
  localStorage.setItem('windowMinimized', 'true');
});

minimizedBar.addEventListener('click', () => {
  windowBox.style.display = 'block';
  minimizedBar.style.display = 'none';
  localStorage.setItem('windowMinimized', 'false');
});

// --- Close Button Disabled ---
closeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  console.log("Close button disabled.");
});

// --- Dragging Window ---
let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = windowBox.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  windowBox.style.left = `${e.clientX - offsetX}px`;
  windowBox.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    savePositionAndSize();
  }
  isDragging = false;
});

// --- Resizing Window ---
resizeHandle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = windowBox.offsetWidth;
  const startHeight = windowBox.offsetHeight;

  function doResize(e) {
    const newWidth = startWidth + (e.clientX - startX);
    const newHeight = startHeight + (e.clientY - startY);
    windowBox.style.width = `${newWidth}px`;
    windowBox.style.height = `${newHeight}px`;
  }

  function stopResize() {
    savePositionAndSize();
    document.removeEventListener("mousemove", doResize);
    document.removeEventListener("mouseup", stopResize);
  }

  document.addEventListener("mousemove", doResize);
  document.addEventListener("mouseup", stopResize);
});

// --- Save Position & Size to localStorage
function savePositionAndSize() {
  const rect = windowBox.getBoundingClientRect();
  localStorage.setItem('windowLeft', rect.left);
  localStorage.setItem('windowTop', rect.top);
  localStorage.setItem('windowWidth', rect.width);
  localStorage.setItem('windowHeight', rect.height);
}
