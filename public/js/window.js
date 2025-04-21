// 🪟 Floating Window

// DOM Elements
const windowBox = document.getElementById('window');
const minimizeBtn = document.getElementById('minimize-btn');
const minimizedBar = document.getElementById('minimized-bar');
const closeBtn = document.getElementById('close-btn');
const header = document.getElementById("window-header");
const resizeHandle = document.getElementById("resize-handle");

// Load minimized state
const isMinimized = localStorage.getItem('windowMinimized');
if (isMinimized === null || isMinimized === 'true') {
  windowBox.style.display = 'none';
  minimizedBar.style.display = 'block';
} else {
  windowBox.style.display = 'block';
  minimizedBar.style.display = 'none';
}

// Load saved position and size
const savedLeft = localStorage.getItem('windowLeft');
const savedTop = localStorage.getItem('windowTop');
const savedWidth = localStorage.getItem('windowWidth');
const savedHeight = localStorage.getItem('windowHeight');

if (savedLeft) windowBox.style.left = `${savedLeft}px`;
if (savedTop) windowBox.style.top = `${savedTop}px`;
if (savedWidth) windowBox.style.width = `${savedWidth}px`;
if (savedHeight) windowBox.style.height = `${savedHeight}px`;

// --- Clamp window to viewport ---
function clampToViewport() {
  const rect = windowBox.getBoundingClientRect();
  const margin = 10;
  let x = rect.left;
  let y = rect.top;

  if (x < margin) x = margin;
  if (y < margin) y = margin;
  if (x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - margin;
  if (y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - margin;

  windowBox.style.left = `${x}px`;
  windowBox.style.top = `${y}px`;
}
window.addEventListener('load', clampToViewport);
window.addEventListener('resize', clampToViewport);

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
  clampToViewport(); // ensure it reopens inside view
});

// --- Close Button ---
closeBtn.addEventListener('click', () => {
  windowBox.style.display = 'none';
  minimizedBar.style.display = 'block';
  localStorage.setItem('windowMinimized', 'true');
});

// --- Dragging Logic ---
let isDragging = false, offsetX = 0, offsetY = 0;

header.addEventListener("mousedown", (e) => {
  isDragging = true;
  const rect = windowBox.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const margin = 10;
  const newX = Math.min(Math.max(margin, e.clientX - offsetX), window.innerWidth - windowBox.offsetWidth - margin);
  const newY = Math.min(Math.max(margin, e.clientY - offsetY), window.innerHeight - windowBox.offsetHeight - margin);

  windowBox.style.left = `${newX}px`;
  windowBox.style.top = `${newY}px`;
});

document.addEventListener("mouseup", () => {
  if (isDragging) {
    savePositionAndSize();
  }
  isDragging = false;
});

// --- Resizing Logic ---
resizeHandle.addEventListener("mousedown", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = windowBox.offsetWidth;
  const startHeight = windowBox.offsetHeight;

  function doResize(e) {
    const newWidth = Math.max(150, startWidth + (e.clientX - startX));
    const newHeight = Math.max(100, startHeight + (e.clientY - startY));
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

// --- Save Position & Size to localStorage ---
function savePositionAndSize() {
  const rect = windowBox.getBoundingClientRect();
  localStorage.setItem('windowLeft', rect.left);
  localStorage.setItem('windowTop', rect.top);
  localStorage.setItem('windowWidth', rect.width);
  localStorage.setItem('windowHeight', rect.height);
}
