/**
 * SHIVAANI'S BIRTHDAY SURPRISE WEBSITE
 * Logic, Animations, Particle Canvas, Interactive Transitions & Audio
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
  girlfriendName: "Shivaani Thago",
  firstKissDay: 11,
  firstKissMonth: 8, // 8 = August
  gateZipPath: "assets/gate-papers.zip",
  musicPath: "",
  musicEnabled: false
};

// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentScreen = 1;
const totalScreens = 7;
let synthAudioContext = null;
let synthIntervalId = null;
let isMusicPlaying = false;
let zipFileAvailable = false;

// DOM Elements
const screens = {
  1: document.getElementById('screen-1'),
  2: document.getElementById('screen-2'),
  3: document.getElementById('screen-3'),
  4: document.getElementById('screen-4'),
  5: document.getElementById('screen-5'),
  6: document.getElementById('screen-6'),
  7: document.getElementById('screen-7')
};

const progressFill = document.getElementById('progress-fill');
const stepDots = document.querySelectorAll('.step-dot');
const toastEl = document.getElementById('toast-notification');

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  populateQuizDayOptions();
  setupEventListeners();
  checkGateZipStatus();
  updateProgress(1);
});

// ==========================================
// PROGRESS TRACKER
// ==========================================
function updateProgress(step) {
  currentScreen = step;
  const percentage = ((step - 0.5) / totalScreens) * 100;
  if (progressFill) {
    progressFill.style.width = `${Math.min(100, Math.max(12, percentage))}%`;
  }

  stepDots.forEach(dot => {
    const dotStep = parseInt(dot.getAttribute('data-step'), 10);
    dot.classList.remove('active', 'completed');
    if (dotStep === step) {
      dot.classList.add('active');
    } else if (dotStep < step) {
      dot.classList.add('completed');
    }
  });
}

function goToScreen(stepNumber) {
  if (stepNumber < 1 || stepNumber > totalScreens) return;

  // Hide all screens
  Object.values(screens).forEach(screen => {
    if (screen) {
      screen.classList.remove('active');
    }
  });

  // Activate target screen
  const targetScreen = screens[stepNumber];
  if (targetScreen) {
    targetScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateProgress(stepNumber);

  // Screen specific triggers
  if (stepNumber === 2) {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 3);
    revealSequentialMessages();
  } else if (stepNumber === 5) {
    triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
  } else if (stepNumber === 7) {
    triggerConfetti(window.innerWidth / 2, window.innerHeight / 3);
  }
}

// ==========================================
// SCREEN 1: ENVELOPE LOGIC
// ==========================================
const envelope = document.getElementById('envelope');
const openEnvelopeBtn = document.getElementById('open-envelope-btn');

function handleOpenEnvelope() {
  if (envelope) {
    envelope.classList.add('opened');
  }
  triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
  showToast("Opening with love... 💕");

  setTimeout(() => {
    goToScreen(2);
  }, 900);
}

if (openEnvelopeBtn) {
  openEnvelopeBtn.addEventListener('click', handleOpenEnvelope);
}
if (envelope) {
  envelope.addEventListener('click', handleOpenEnvelope);
}

// ==========================================
// SCREEN 2: BIRTHDAY GREETING SEQUENTIAL REVEAL
// ==========================================
const screen2NextBtn = document.getElementById('screen2-next-btn');

function revealSequentialMessages() {
  const m1 = document.getElementById('msg-1');
  const m2 = document.getElementById('msg-2');
  const m3 = document.getElementById('msg-3');

  if (m1) m1.classList.remove('revealed');
  if (m2) m2.classList.remove('revealed');
  if (m3) m3.classList.remove('revealed');

  setTimeout(() => { if (m1) m1.classList.add('revealed'); }, 300);
  setTimeout(() => { if (m2) m2.classList.add('revealed'); }, 1400);
  setTimeout(() => { if (m3) m3.classList.add('revealed'); }, 2500);
}

if (screen2NextBtn) {
  screen2NextBtn.addEventListener('click', () => {
    goToScreen(3);
  });
}

// ==========================================
// SCREEN 3: LOVE LETTER
// ==========================================
const screen3NextBtn = document.getElementById('screen3-next-btn');
if (screen3NextBtn) {
  screen3NextBtn.addEventListener('click', () => {
    goToScreen(4);
  });
}

// ==========================================
// SCREEN 4: FIRST-KISS DATE QUIZ
// ==========================================
function populateQuizDayOptions() {
  const daySelect = document.getElementById('kiss-day');
  if (!daySelect) return;

  for (let d = 1; d <= 31; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = `${d}`;
    daySelect.appendChild(opt);
  }
}

const quizForm = document.getElementById('quiz-form');
const heartLockContainer = document.getElementById('heart-lock-container');
const quizFeedback = document.getElementById('quiz-feedback');

function handleQuizSubmit(e) {
  if (e) e.preventDefault();

  const dayVal = parseInt(document.getElementById('kiss-day').value, 10);
  const monthVal = parseInt(document.getElementById('kiss-month').value, 10);

  if (!dayVal || !monthVal) {
    if (quizFeedback) {
      quizFeedback.textContent = "Please select both the day and month of our special memory! ❤️";
      quizFeedback.className = "quiz-feedback error";
    }
    return;
  }

  // Validate answer
  if (dayVal === CONFIG.firstKissDay && monthVal === CONFIG.firstKissMonth) {
    // Correct!
    if (quizFeedback) {
      quizFeedback.textContent = "Unlocked with love! 💕";
      quizFeedback.className = "quiz-feedback success";
    }

    if (heartLockContainer) {
      heartLockContainer.classList.add('unlocked');
    }

    triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
    showToast("You remembered our first kiss! 💋");

    setTimeout(() => {
      goToScreen(5);
    }, 1100);
  } else {
    // Incorrect
    if (quizFeedback) {
      quizFeedback.textContent = "Oops, my love! Try remembering our special day again. ❤️";
      quizFeedback.className = "quiz-feedback error";
    }

    if (heartLockContainer) {
      heartLockContainer.classList.remove('shake');
      void heartLockContainer.offsetWidth; // Trigger reflow
      heartLockContainer.classList.add('shake');
    }
  }
}

if (quizForm) {
  quizForm.addEventListener('submit', handleQuizSubmit);
}

// ==========================================
// SCREEN 5: FIRST-KISS MEMORY
// ==========================================
const screen5NextBtn = document.getElementById('screen5-next-btn');
if (screen5NextBtn) {
  screen5NextBtn.addEventListener('click', () => {
    goToScreen(6);
  });
}

// ==========================================
// SCREEN 6: ANIMATED GIFT BOX & DOWNLOAD
// ==========================================
const giftBox = document.getElementById('gift-box');
const downloadGateBtn = document.getElementById('download-gate-btn');
const zipErrorMsg = document.getElementById('zip-error-msg');
const screen6NextBtn = document.getElementById('screen6-next-btn');

function triggerDownload() {
  const link = document.createElement('a');
  link.href = CONFIG.gateZipPath;
  link.download = 'gate-papers.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function handleDownloadGatePapers() {
  if (zipErrorMsg) {
    zipErrorMsg.className = "zip-status-notice";
    zipErrorMsg.textContent = "";
  }

  // Verify that the ZIP exists before downloading
  fetch(CONFIG.gateZipPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // File exists! Animate gift box opening, trigger celebration, and download
        if (giftBox) giftBox.classList.add('opened');
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
        triggerHeartExplosion(window.innerWidth / 2, window.innerHeight / 2);
        showToast("Starting your GATE ME Papers download! 🚀❤️");

        if (zipErrorMsg) {
          zipErrorMsg.className = "zip-status-notice info";
          zipErrorMsg.innerHTML = `✅ <strong>Download Started:</strong> <code>${CONFIG.gateZipPath}</code> is downloading! All the best for your dreams, Shivaani! ❤️📚`;
        }

        triggerDownload();
      } else {
        showMissingZipError();
      }
    })
    .catch(() => {
      // If fetch fails (e.g. file missing)
      showMissingZipError();
    });
}

function showMissingZipError() {
  showToast("File not found! Please check assets/gate-papers.zip ⚠️");
  if (zipErrorMsg) {
    zipErrorMsg.className = "zip-status-notice warning";
    zipErrorMsg.innerHTML = `⚠️ <strong>File Not Found:</strong> <code>${CONFIG.gateZipPath}</code> is missing from the assets folder. Please place <code>gate-papers.zip</code> into the <code>assets/</code> directory!`;
  }
}

function checkGateZipStatus() {
  if (!CONFIG.gateZipPath) {
    showMissingZipError();
    return;
  }

  fetch(CONFIG.gateZipPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        zipFileAvailable = true;
      } else {
        zipFileAvailable = false;
      }
    })
    .catch(() => {
      zipFileAvailable = false;
    });
}

if (downloadGateBtn) {
  downloadGateBtn.addEventListener('click', handleDownloadGatePapers);
}

if (giftBox) {
  giftBox.addEventListener('click', handleDownloadGatePapers);
}

if (screen6NextBtn) {
  screen6NextBtn.addEventListener('click', () => {
    goToScreen(7);
  });
}

// ==========================================
// SCREEN 7: REPLAY SURPRISE
// ==========================================
const replayBtn = document.getElementById('replay-btn');
if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    // Reset states
    if (envelope) envelope.classList.remove('opened');
    if (giftBox) giftBox.classList.remove('opened');
    if (heartLockContainer) heartLockContainer.classList.remove('unlocked');
    if (quizFeedback) {
      quizFeedback.textContent = '';
      quizFeedback.className = 'quiz-feedback';
    }
    if (zipErrorMsg) {
      zipErrorMsg.textContent = '';
      zipErrorMsg.className = 'zip-status-notice';
    }
    const kissDayEl = document.getElementById('kiss-day');
    const kissMonthEl = document.getElementById('kiss-month');
    if (kissDayEl) kissDayEl.value = '';
    if (kissMonthEl) kissMonthEl.value = '';

    showToast("Starting from the beginning! ❤️");
    goToScreen(1);
  });
}

// ==========================================
// MUSIC & SOUND CONTROLLER
// ==========================================
const musicToggleBtn = document.getElementById('music-toggle-btn');
const musicIcon = document.getElementById('music-icon');
const musicLabel = document.getElementById('music-label');
const bgAudio = document.getElementById('bg-audio');

function toggleMusic() {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}

function startMusic() {
  isMusicPlaying = true;
  if (musicToggleBtn) musicToggleBtn.classList.add('playing');
  if (musicIcon) musicIcon.textContent = '🎶';
  if (musicLabel) musicLabel.textContent = 'Music: On';

  if (CONFIG.musicPath && bgAudio) {
    bgAudio.src = CONFIG.musicPath;
    bgAudio.play().catch(() => {
      // Fallback to web audio music box if audio file fails
      startMusicBoxSynth();
    });
  } else {
    // Magical Web Audio romantic music-box arpeggio (Canon in D lullaby chords)
    startMusicBoxSynth();
  }

  showToast("Romantic music started 🎵");
}

function stopMusic() {
  isMusicPlaying = false;
  if (musicToggleBtn) musicToggleBtn.classList.remove('playing');
  if (musicIcon) musicIcon.textContent = '🎵';
  if (musicLabel) musicLabel.textContent = 'Music: Off';

  if (bgAudio) {
    bgAudio.pause();
  }
  stopMusicBoxSynth();
  showToast("Music paused 🔇");
}

// Sweet Web Audio Music Box Synthesizer (No external file needed)
const CANON_MELODY = [
  523.25, 659.25, 783.99, 1046.50, // C chord
  392.00, 493.88, 587.33, 783.99,  // G chord
  440.00, 523.25, 659.25, 880.00,  // Am chord
  329.63, 392.00, 493.88, 659.25,  // Em chord
  349.23, 440.00, 523.25, 698.46,  // F chord
  261.63, 329.63, 392.00, 523.25,  // C chord
  349.23, 440.00, 523.25, 698.46,  // F chord
  392.00, 493.88, 587.33, 783.99   // G chord
];
let melodyStep = 0;

function playMusicBoxNote(freq) {
  if (!synthAudioContext) return;
  try {
    const osc = synthAudioContext.createOscillator();
    const gain = synthAudioContext.createGain();

    osc.type = 'triangle'; // Sweet chime / celesta tone
    osc.frequency.setValueAtTime(freq, synthAudioContext.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0.001, synthAudioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, synthAudioContext.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, synthAudioContext.currentTime + 0.95);

    osc.connect(gain);
    gain.connect(synthAudioContext.destination);

    osc.start();
    osc.stop(synthAudioContext.currentTime + 1.0);
  } catch {
    // Ignore audio context errors
  }
}

function startMusicBoxSynth() {
  if (!synthAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) synthAudioContext = new AudioCtx();
  }
  if (synthAudioContext && synthAudioContext.state === 'suspended') {
    synthAudioContext.resume();
  }

  stopMusicBoxSynth();
  melodyStep = 0;
  synthIntervalId = setInterval(() => {
    if (!isMusicPlaying) return;
    const freq = CANON_MELODY[melodyStep % CANON_MELODY.length];
    playMusicBoxNote(freq);
    melodyStep++;
  }, 420);
}

function stopMusicBoxSynth() {
  if (synthIntervalId) {
    clearInterval(synthIntervalId);
    synthIntervalId = null;
  }
}

if (musicToggleBtn) {
  musicToggleBtn.addEventListener('click', toggleMusic);
}

// ==========================================
// FLOATING CANVAS PARTICLES & CONFETTI
// ==========================================
const particles = [];
const confettiItems = [];
let canvas, ctx;

function initParticleCanvas() {
  canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Seed initial floating romantic ambient particles
  const particleCount = Math.min(30, Math.floor(window.innerWidth / 25));
  for (let i = 0; i < particleCount; i++) {
    particles.push(createAmbientParticle(true));
  }

  // Interactive tap / click spawn
  window.addEventListener('pointerdown', (e) => {
    // Don't spawn if tapping a button to avoid interference
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SELECT' && e.target.tagName !== 'A') {
      spawnTapBurst(e.clientX, e.clientY);
    }
  });

  requestAnimationFrame(renderCanvasLoop);
}

function createAmbientParticle(initialSpread = false) {
  const types = ['heart', 'sparkle', 'petal', 'star'];
  return {
    type: types[Math.floor(Math.random() * types.length)],
    x: Math.random() * (canvas ? canvas.width : 400),
    y: initialSpread ? Math.random() * (canvas ? canvas.height : 800) : (canvas ? canvas.height + 20 : 820),
    size: Math.random() * 12 + 8,
    speedY: Math.random() * 0.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.6,
    opacity: Math.random() * 0.5 + 0.3,
    rot: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 1.5,
    hue: Math.random() > 0.4 ? 345 : 280 // Pastel pink / lavender
  };
}

function spawnTapBurst(x, y) {
  for (let i = 0; i < 6; i++) {
    confettiItems.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6 - 2,
      size: Math.random() * 10 + 6,
      color: ['#FF4D6D', '#FF758F', '#CDB4DB', '#FFB703', '#FFF0F5'][Math.floor(Math.random() * 5)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.02,
      isHeart: Math.random() > 0.4
    });
  }
}

function triggerHeartExplosion(x, y) {
  for (let i = 0; i < 28; i++) {
    const angle = (Math.PI * 2 * i) / 28;
    const speed = Math.random() * 6 + 3;
    confettiItems.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 14 + 10,
      color: ['#FF4D6D', '#FF758F', '#C9184A', '#FFB703', '#FFE5EC'][Math.floor(Math.random() * 5)],
      alpha: 1,
      decay: Math.random() * 0.015 + 0.015,
      isHeart: true
    });
  }
}

function triggerConfetti(x, y) {
  for (let i = 0; i < 45; i++) {
    confettiItems.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 10 + 6,
      color: ['#FF4D6D', '#FF758F', '#CDB4DB', '#FFB703', '#2A9D8F', '#F4A261'][Math.floor(Math.random() * 6)],
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008,
      isHeart: Math.random() > 0.5
    });
  }
}

function drawHeart(c, x, y, size, color, alpha) {
  c.save();
  c.translate(x, y);
  c.scale(size / 15, size / 15);
  c.fillStyle = color;
  c.globalAlpha = alpha;
  c.beginPath();
  c.moveTo(0, 0);
  c.bezierCurveTo(-5, -7, -12, -2, -12, 5);
  c.bezierCurveTo(-12, 11, -4, 16, 0, 20);
  c.bezierCurveTo(4, 16, 12, 11, 12, 5);
  c.bezierCurveTo(12, -2, 5, -7, 0, 0);
  c.fill();
  c.restore();
}

function renderCanvasLoop() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Ambient Background Particles
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.y -= p.speedY;
    p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
    p.rot += p.rotSpeed;

    if (p.y < -30) {
      particles[i] = createAmbientParticle(false);
      continue;
    }

    if (p.type === 'heart') {
      drawHeart(ctx, p.x, p.y, p.size, `hsl(${p.hue}, 85%, 72%)`, p.opacity);
    } else if (p.type === 'star') {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = `rgba(255, 230, 110, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Soft glowing sparkle / petal
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.35, p.size * 0.18, (p.rot * Math.PI) / 180, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 2. Confetti & Action Bursts
  for (let i = confettiItems.length - 1; i >= 0; i--) {
    const c = confettiItems[i];
    c.x += c.vx;
    c.y += c.vy;
    c.vy += 0.25; // gravity
    c.vx *= 0.98; // friction
    c.alpha -= c.decay;

    if (c.alpha <= 0 || c.y > canvas.height + 40) {
      confettiItems.splice(i, 1);
      continue;
    }

    if (c.isHeart) {
      drawHeart(ctx, c.x, c.y, c.size, c.color, c.alpha);
    } else {
      ctx.save();
      ctx.fillStyle = c.color;
      ctx.globalAlpha = c.alpha;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  requestAnimationFrame(renderCanvasLoop);
}

// ==========================================
// TOAST POPUP NOTIFICATION
// ==========================================
let toastTimer = null;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3200);
}

// Setup Event Listeners
function setupEventListeners() {
  // Direct dot navigation for previously visited screens
  stepDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const step = parseInt(dot.getAttribute('data-step'), 10);
      if (step <= currentScreen || step === 1) {
        goToScreen(step);
      }
    });
  });
}
