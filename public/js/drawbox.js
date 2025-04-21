// Get elements from the DOM
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizePicker = document.getElementById('sizePicker');
const downloadButton = document.getElementById('saveButton');
const undoButton = document.getElementById('undo-button');
const saveLink = document.getElementById('saveLink');

// Set canvas size and white background
canvas.width = 350;
canvas.height = 350;
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initial settings
let drawing = false;
let currentColor = '#000000'; // Brush's starting color
let currentSize = 5;
let undoStack = [];


// Save current state to undo stack
function saveState() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 20) undoStack.shift();
}

// Restore the previous canvas state
function restoreState() {
  if (undoStack.length === 0) return;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = undoStack.pop();
}

// Update color and size
colorPicker.addEventListener('input', (e) => {
  currentColor = e.target.value;
});

sizePicker.addEventListener('input', (e) => {
  currentSize = e.target.value;
});

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  saveState();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

// Draw on canvas
canvas.addEventListener('mousemove', (e) => {
  if (drawing) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineWidth = currentSize;
    ctx.strokeStyle = currentColor;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
  }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
  drawing = false;
});

// Undo action
undoButton.addEventListener('click', restoreState);

// Firestore Send
saveLink.addEventListener('click', async () => {
  const dataURL = canvas.toDataURL("image/png");
  const timestamp = new Date().toISOString();

  try {
    const db = firebase.database();
    const ref = db.ref("Drawbox"); // Your DB path
    const newEntry = ref.push(); // Generate unique ID

    await newEntry.set({
      dataURL: dataURL,
      timestamp: timestamp,
      submittedBy: "anonymous",
      width: canvas.width,
      height: canvas.height,
      hidden: false
    });

    alert("The image has been sent!"); // Sends to firebase database
  } catch (e) {
    console.error("🔥 Save error:", e);
    alert("Save failed: " + e.message);
  }
});

console.log("drawbox.js running... ✅");
console.log("Firebase loaded?", typeof firebase !== "undefined" ? "Yes ✅" : "No ❌");

// Touch support
function getTouchPos(canvas, touchEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Touch start
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevents scrolling while drawing
  const pos = getTouchPos(canvas, e);
  drawing = true;
  saveState();
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

// Touch move
canvas.addEventListener('touchmove', (e) => {
  if (!drawing) return;
  e.preventDefault();
  const pos = getTouchPos(canvas, e);
  ctx.lineTo(pos.x, pos.y);
  ctx.lineWidth = currentSize;
  ctx.strokeStyle = currentColor;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();
});

// Touch end
canvas.addEventListener('touchend', () => {
  drawing = false;
});
