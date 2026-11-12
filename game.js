// ========================================================
// 1 ใน 10,000 — Aincrad Life Simulator (Game Engine)
// ========================================================

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {}
  }

  playTone(freq, type, duration, delay = 0) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + delay);
      osc.stop(this.ctx.currentTime + delay + duration);
    } catch (e) {
      // Audio might be blocked by browser policy before interaction
    }
  }

  click() {
    this.init();
    this.playTone(800, 'sine', 0.08);
  }

  saoSelect() {
    this.init();
    this.playTone(523.25, 'triangle', 0.1, 0);
    this.playTone(659.25, 'triangle', 0.15, 0.08);
  }

  damage() {
    this.init();
    this.playTone(180, 'sawtooth', 0.25);
    this.playTone(120, 'sawtooth', 0.35, 0.1);
  }

  heal() {
    this.init();
    this.playTone(523.25, 'sine', 0.12, 0);
    this.playTone(783.99, 'sine', 0.2, 0.1);
  }

  death() {
    this.init();
    this.playTone(260, 'sawtooth', 0.4, 0);
    this.playTone(180, 'sawtooth', 0.6, 0.2);
    this.playTone(110, 'sawtooth', 0.9, 0.4);
  }

  victory() {
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.25, idx * 0.12);
    });
  }
}

const sfx = new SoundController();

// Global Player State
let player = {
  name: 'Kirigaya',
  background: null,
  weapon: null,
  hp: 100,
  maxHp: 100,
  col: 500,
  sanity: 80,
  courage: 50,
  floor: 1,
  path: 'none',
  currentEventId: 'day1_intro',
  history: []
};

// Storage for Unlocked Endings
function getUnlockedEndings() {
  try {
    const raw = localStorage.getItem('sao_unlocked_endings');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveUnlockedEnding(endingId) {
  try {
    const unlocked = getUnlockedEndings();
    if (!unlocked.includes(endingId)) {
      unlocked.push(endingId);
      localStorage.setItem('sao_unlocked_endings', JSON.stringify(unlocked));
    }
  } catch (e) {}
}

// UI Elements
const el = {
  screenTitle: document.getElementById('screen-title'),
  screenRoll: document.getElementById('screen-roll'),
  screenGame: document.getElementById('screen-game'),
  screenEnding: document.getElementById('screen-ending'),
  galleryModal: document.getElementById('gallery-modal'),
  playerNameInput: document.getElementById('player-name-input'),
  startBtn: document.getElementById('start-btn'),
  confirmRollBtn: document.getElementById('confirm-roll-btn'),
  rerollBtn: document.getElementById('reroll-btn'),
  
  // Character Roll Info
  rollName: document.getElementById('roll-player-name'),
  rollBgTitle: document.getElementById('roll-bg-title'),
  rollBgDesc: document.getElementById('roll-bg-desc'),
  rollWpTitle: document.getElementById('roll-wp-title'),
  rollWpDesc: document.getElementById('roll-wp-desc'),
  rollHp: document.getElementById('roll-hp'),
  rollCol: document.getElementById('roll-col'),
  rollSanity: document.getElementById('roll-sanity'),
  rollCourage: document.getElementById('roll-courage'),

  // Game HUD
  hudPlayerName: document.getElementById('hud-player-name'),
  hudPathTag: document.getElementById('hud-path-tag'),
  hudHpText: document.getElementById('hud-hp-text'),
  hudHpBar: document.getElementById('hud-hp-bar'),
  hudCol: document.getElementById('hud-col'),
  hudSanity: document.getElementById('hud-sanity'),
  hudCourage: document.getElementById('hud-courage'),
  hudFloor: document.getElementById('hud-floor'),

  // Story Elements
  storyPhase: document.getElementById('story-phase'),
  storyTitle: document.getElementById('story-title'),
  storyDesc: document.getElementById('story-desc'),
  choicesBox: document.getElementById('choices-box'),
  feedbackBox: document.getElementById('feedback-box'),
  feedbackText: document.getElementById('feedback-text'),
  nextBtn: document.getElementById('next-btn'),

  // Pixel Renderer Elements
  pixelLocationName: document.getElementById('pixel-location-name'),
  pixelFloorTag: document.getElementById('pixel-floor-tag'),

  // Ending Screen
  endingIcon: document.getElementById('ending-icon'),
  endingBadge: document.getElementById('ending-badge'),
  endingTitle: document.getElementById('ending-title'),
  endingDesc: document.getElementById('ending-desc'),
  endingRestartBtn: document.getElementById('ending-restart-btn'),

  // Gallery
  openGalleryBtn: document.getElementById('open-gallery-btn'),
  closeGalleryBtn: document.getElementById('close-gallery-btn'),
  galleryGrid: document.getElementById('gallery-grid'),
  galleryCount: document.getElementById('gallery-count')
};

// Switch Screen Utility
function showScreen(screenEl) {
  [el.screenTitle, el.screenRoll, el.screenGame, el.screenEnding].forEach(s => {
    s.classList.remove('active');
  });
  screenEl.classList.add('active');
}

// Random Generator
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomBackground() {
  const rand = Math.random();
  let cumulative = 0;
  for (const bg of BACKGROUNDS) {
    cumulative += bg.chance;
    if (rand <= cumulative) return bg;
  }
  return BACKGROUNDS[0];
}

// Roll Character
function performRoll() {
  try { sfx.saoSelect(); } catch(e) {}
  const bg = getRandomBackground();
  const wp = getRandomItem(WEAPONS);

  player.background = bg.id;
  player.weapon = wp.id;
  player.hp = bg.hp;
  player.maxHp = bg.maxHp;
  player.col = bg.col;
  player.sanity = bg.sanity;
  player.courage = bg.courage;
  player.floor = 1;
  player.path = 'none';

  // Render Roll Screen Safely
  if (el.rollName) el.rollName.textContent = player.name;
  if (el.rollBgTitle) el.rollBgTitle.textContent = bg.name;
  if (el.rollBgDesc) el.rollBgDesc.textContent = bg.description;
  if (el.rollWpTitle) el.rollWpTitle.textContent = wp.name;
  if (el.rollWpDesc) el.rollWpDesc.textContent = `คุณสมบัติ: ${wp.statBonus}`;
  if (el.rollHp) el.rollHp.textContent = `${player.hp} / ${player.maxHp}`;
  if (el.rollCol) el.rollCol.textContent = `${player.col} Col`;
  if (el.rollSanity) el.rollSanity.textContent = `${player.sanity}%`;
  if (el.rollCourage) el.rollCourage.textContent = player.courage;
}

// Update Game HUD
function updateHUD() {
  el.hudPlayerName.textContent = player.name;
  el.hudPathTag.textContent = player.path === 'none' ? 'ผู้เล่นอิสระ' : player.path.toUpperCase();
  el.hudHpText.textContent = `${Math.max(0, player.hp)} / ${player.maxHp}`;
  
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  el.hudHpBar.style.width = `${hpPercent}%`;
  
  el.hudHpBar.className = 'hp-bar-fill';
  if (hpPercent <= 20) {
    el.hudHpBar.classList.add('danger');
  } else if (hpPercent <= 50) {
    el.hudHpBar.classList.add('warning');
  }

  el.hudCol.textContent = `${player.col} Col`;
  el.hudSanity.textContent = `${Math.max(0, player.sanity)}%`;
  el.hudCourage.textContent = player.courage;
  el.hudFloor.textContent = `ชั้น ${player.floor}`;
}

// Pixel Art Renderers
let mainPixelRenderer = null;
let endingPixelRenderer = null;

function initRenderers() {
  if (!mainPixelRenderer && document.getElementById('pixel-canvas')) {
    try {
      mainPixelRenderer = new PixelRenderer('pixel-canvas');
    } catch(e) {}
  }
  if (!endingPixelRenderer && document.getElementById('ending-pixel-canvas')) {
    try {
      endingPixelRenderer = new PixelRenderer('ending-pixel-canvas');
    } catch(e) {}
  }
}

// Load Story Event
let pendingNextEvent = null;

function loadEvent(eventId) {
  const ev = EVENTS.find(e => e.id === eventId);
  if (!ev) {
    triggerGameEnding();
    return;
  }

  player.currentEventId = ev.id;
  if (ev.floor) player.floor = ev.floor;
  updateHUD();

  initRenderers();
  if (mainPixelRenderer && ev.scene) {
    mainPixelRenderer.setScene(ev.scene);
  }
  if (el.pixelLocationName) {
    el.pixelLocationName.textContent = '📍 ' + (ev.location || 'ปราสาทลอยฟ้า Aincrad');
  }
  if (el.pixelFloorTag) {
    el.pixelFloorTag.textContent = 'FLOOR ' + (ev.floor || player.floor);
  }

  el.storyPhase.textContent = ev.phase;
  el.storyTitle.textContent = ev.title;
  el.storyDesc.textContent = ev.description;
  el.feedbackBox.style.display = 'none';
  el.choicesBox.innerHTML = '';
  el.choicesBox.style.display = 'flex';

  ev.choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = ch.text;
    btn.addEventListener('click', () => {
      sfx.saoSelect();
      applyChoice(ch);
    });
    el.choicesBox.appendChild(btn);
  });
}

// Apply Choice Effects
function applyChoice(choice) {
  el.choicesBox.style.display = 'none';
  
  let hpDelta = 0;
  if (choice.effects) {
    if (choice.effects.hp) {
      player.hp = Math.min(player.maxHp, player.hp + choice.effects.hp);
      hpDelta = choice.effects.hp;
    }
    if (choice.effects.col) player.col = Math.max(0, player.col + choice.effects.col);
    if (choice.effects.sanity) player.sanity = Math.max(0, Math.min(100, player.sanity + choice.effects.sanity));
    if (choice.effects.courage) player.courage = Math.max(0, player.courage + choice.effects.courage);
  }

  if (hpDelta < 0) {
    sfx.damage();
  } else if (hpDelta > 0) {
    sfx.heal();
  }

  updateHUD();

  // Detect Life Path change
  if (choice.nextEvent && choice.nextEvent.startsWith('path_')) {
    if (choice.nextEvent.includes('frontliner')) player.path = 'frontliner';
    if (choice.nextEvent.includes('solo')) player.path = 'solo';
    if (choice.nextEvent.includes('merchant')) player.path = 'merchant';
    if (choice.nextEvent.includes('refugee')) player.path = 'refugee';
    if (choice.nextEvent.includes('orange')) player.path = 'orange';
    updateHUD();
  }

  // Show Feedback
  el.feedbackText.textContent = choice.feedback || 'การตัดสินใจของคุณส่งผลต่ออนาคตใน Aincrad...';
  el.feedbackBox.style.display = 'block';

  // Check Death or Next Event
  if (player.hp <= 0 || player.sanity <= 0) {
    pendingNextEvent = 'trigger_endings';
    el.nextBtn.textContent = 'ดูชะตากรรมสุดท้ายของคุณ... 💀';
  } else if (choice.nextEvent === 'trigger_endings') {
    pendingNextEvent = 'trigger_endings';
    el.nextBtn.textContent = 'ชมบทสรุปของตำนาน... 🏆';
  } else {
    pendingNextEvent = choice.nextEvent;
    el.nextBtn.textContent = 'ดำเนินชีวิตต่อไป... ▶';
  }
}

// Trigger Game Endings
function triggerGameEnding() {
  let matchedEnding = null;

  // Find priority matching ending
  for (const end of ENDINGS) {
    try {
      if (end.condition && end.condition(player)) {
        matchedEnding = end;
        break;
      }
    } catch (e) {}
  }

  if (!matchedEnding) {
    matchedEnding = player.hp <= 0 ? ENDINGS[0] : ENDINGS.find(e => e.id === 'end_nameless_survivor');
  }

  saveUnlockedEnding(matchedEnding.id);

  initRenderers();
  if (endingPixelRenderer && matchedEnding.scene) {
    endingPixelRenderer.setScene(matchedEnding.scene);
  }

  if (matchedEnding.type === 'bad') {
    sfx.death();
  } else {
    sfx.victory();
  }

  el.endingIcon.textContent = matchedEnding.icon || '🏆';
  el.endingTitle.textContent = matchedEnding.title;
  el.endingDesc.textContent = matchedEnding.description;
  
  el.endingBadge.className = `ending-type-badge badge-${matchedEnding.type}`;
  el.endingBadge.textContent = matchedEnding.type.toUpperCase() + ' END';

  showScreen(el.screenEnding);
}

// Gallery Rendering
function renderGallery() {
  const unlocked = getUnlockedEndings();
  el.galleryCount.textContent = `ปลดล็อกแล้ว ${unlocked.length} / ${ENDINGS.length} ฉากจบ`;
  el.galleryGrid.innerHTML = '';

  ENDINGS.forEach(end => {
    const isUnlocked = unlocked.includes(end.id);
    const card = document.createElement('div');
    card.className = `gallery-card ${isUnlocked ? 'unlocked' : 'locked'}`;

    if (isUnlocked) {
      card.innerHTML = `
        <div class="gallery-icon">${end.icon}</div>
        <div class="gallery-title">${end.title}</div>
        <p style="font-size:0.75rem; color:#8b9bb4; margin-top:6px;">${end.description.substring(0, 70)}...</p>
      `;
    } else {
      card.innerHTML = `
        <div class="gallery-icon">🔒</div>
        <div class="gallery-title">??? (ยังไม่ปลดล็อก)</div>
        <p style="font-size:0.75rem; color:#606a78; margin-top:6px;">เล่นและตัดสินใจเลือกทางเดินเพื่อค้นพบฉากจบนี้</p>
      `;
    }
    el.galleryGrid.appendChild(card);
  });
}

// Event Listeners
if (el.startBtn) {
  el.startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.click(); } catch(err) {}
    const name = el.playerNameInput ? el.playerNameInput.value.trim() : '';
    if (name) player.name = name;
    performRoll();
    showScreen(el.screenRoll);
  });
}

if (el.rerollBtn) {
  el.rerollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    performRoll();
  });
}

if (el.confirmRollBtn) {
  el.confirmRollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.saoSelect(); } catch(err) {}
    showScreen(el.screenGame);
    loadEvent('day1_intro');
  });
}

if (el.nextBtn) {
  el.nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.click(); } catch(err) {}
    if (pendingNextEvent === 'trigger_endings') {
      triggerGameEnding();
    } else if (pendingNextEvent) {
      loadEvent(pendingNextEvent);
    }
  });
}

if (el.endingRestartBtn) {
  el.endingRestartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.click(); } catch(err) {}
    showScreen(el.screenTitle);
  });
}

if (el.openGalleryBtn) {
  el.openGalleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.click(); } catch(err) {}
    renderGallery();
    el.galleryModal.classList.add('active');
  });
}

if (el.closeGalleryBtn) {
  el.closeGalleryBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { sfx.click(); } catch(err) {}
    el.galleryModal.classList.remove('active');
  });
}

// Sound Toggle
const soundBtn = document.getElementById('sound-toggle-btn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    soundBtn.textContent = sfx.enabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
  });
}
