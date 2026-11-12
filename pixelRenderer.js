// ========================================================
// 1 ใน 10,000 — SAO Retro Pixel Art Engine
// จำลองภาพพิกเซล 8-bit/16-bit ตามสไตล์เกม 1 ใน 65 ล้าน
// ========================================================

class PixelRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    
    // Canvas Virtual Resolution (Retro 320x200)
    this.width = 320;
    this.height = 200;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.currentScene = 'scene_kayaba_red_sky';
    this.frame = 0;
    this.animating = true;

    this.initLoop();
  }

  setScene(sceneName) {
    this.currentScene = sceneName || 'scene_grassland_boar';
  }

  initLoop() {
    const loop = () => {
      this.frame++;
      this.render();
      if (this.animating) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  }

  // --- DRAWING PRIMITIVES ---
  fillRect(x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  }

  drawSky(cTop, cBottom) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, cTop);
    grad.addColorStop(1, cBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawStars(count = 25) {
    for (let i = 0; i < count; i++) {
      const sx = (i * 37 + 13) % this.width;
      const sy = (i * 19 + 7) % 80;
      const blink = (this.frame + i * 15) % 60 > 30 ? 1 : 0.4;
      this.fillRect(sx, sy, 2, 2, `rgba(255,255,255,${blink})`);
    }
  }

  drawMountains(color, baseY = 130) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, baseY);
    this.ctx.lineTo(50, baseY - 50);
    this.ctx.lineTo(110, baseY);
    this.ctx.lineTo(170, baseY - 65);
    this.ctx.lineTo(240, baseY);
    this.ctx.lineTo(290, baseY - 45);
    this.ctx.lineTo(320, baseY);
    this.ctx.lineTo(320, 200);
    this.ctx.lineTo(0, 200);
    this.ctx.fill();
  }

  drawAincradSteelCeiling() {
    // Upper floor inverted cone ceiling
    this.fillRect(0, 0, this.width, 18, '#1e2430');
    this.fillRect(0, 18, this.width, 6, '#151922');
    for (let x = 0; x < this.width; x += 32) {
      this.fillRect(x, 24, 16, 4, '#0d1017');
    }
  }

  // --- SCENE IMPLEMENTATIONS ---

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.currentScene) {
      case 'scene_kayaba_red_sky':
        this.renderKayabaRedSky();
        break;
      case 'scene_grassland_boar':
        this.renderGrasslandBoar();
        break;
      case 'scene_grassland_coper':
        this.renderGrasslandCoper();
        break;
      case 'scene_town_street':
        this.renderTownStreet();
        break;
      case 'scene_town_inn':
        this.renderTownInn();
        break;
      case 'scene_black_iron_palace':
        this.renderBlackIronPalace();
        break;
      case 'scene_amphitheater':
        this.renderAmphitheater();
        break;
      case 'scene_boss_floor1':
        this.renderBossFloor1();
        break;
      case 'scene_dungeon_trap':
        this.renderDungeonTrap();
        break;
      case 'scene_dungeon_corridor':
        this.renderDungeonCorridor();
        break;
      case 'scene_forest_silica':
        this.renderForestSilica();
        break;
      case 'scene_forest_poh':
        this.renderForestPoH();
        break;
      case 'scene_lisbeth_forge':
        this.renderLisbethForge();
        break;
      case 'scene_lake_cottage':
        this.renderLakeCottage();
        break;
      case 'scene_gleam_eyes':
        this.renderGleamEyes();
        break;
      case 'scene_skull_reaper':
        this.renderSkullReaper();
        break;
      case 'scene_aincrad_collapse':
        this.renderAincradCollapse();
        break;
      case 'scene_hospital_bed':
        this.renderHospitalBed();
        break;
      case 'scene_grave_gameover':
        this.renderGraveGameOver();
        break;
      default:
        this.renderGrasslandBoar();
        break;
    }
  }

  // 1. วันที่ 1: ท้องฟ้าสีแดงชาด & คายาบะ
  renderKayabaRedSky() {
    this.drawSky('#4a0005', '#1a0003');
    
    // Hexagonal Grid Lines on Red Sky
    for (let y = 10; y < 120; y += 16) {
      const alpha = 0.15 + Math.sin(this.frame * 0.05) * 0.05;
      this.fillRect(0, y, this.width, 1, `rgba(255, 60, 60, ${alpha})`);
    }

    // Distant Gothic Town Buildings
    this.fillRect(0, 130, this.width, 70, '#120f18');
    for (let x = 10; x < 310; x += 36) {
      const bh = 25 + (x % 30);
      this.fillRect(x, 130 - bh, 28, bh, '#1c1626');
      this.fillRect(x + 4, 130 - bh + 6, 8, 8, '#ff9900'); // Lamp
    }

    // Gigantic Kayaba Blood Cloak in Sky
    const floatY = Math.sin(this.frame * 0.04) * 4;
    const kx = 160;
    const ky = 35 + floatY;

    // Red Hood
    this.fillRect(kx - 24, ky, 48, 55, '#8b0000');
    this.fillRect(kx - 18, ky - 10, 36, 15, '#a30000');
    // Pure Black Face Void
    this.fillRect(kx - 14, ky + 4, 28, 26, '#050204');
    // Flowing Blood Cloak
    this.fillRect(kx - 34, ky + 45, 68, 60, '#750000');
    this.fillRect(kx - 42, ky + 70, 84, 40, '#580000');
    // Bleeding drips from sky
    const dripY = (this.frame * 2) % 140;
    this.fillRect(kx - 10, dripY, 3, 10, '#ff1a2b');
    this.fillRect(kx + 12, (dripY + 40) % 140, 3, 12, '#ff1a2b');

    // Panicking Crowd Silhouettes on Ground
    for (let cx = 30; cx < 300; cx += 22) {
      const jiggle = Math.sin(this.frame * 0.2 + cx) * 2;
      this.fillRect(cx, 160 + jiggle, 6, 12, '#08060a');
      this.fillRect(cx + 1, 154 + jiggle, 4, 6, '#08060a'); // Head
    }
  }

  // 2. ทุ่งหญ้า & หมูป่า Frenzy Boar
  renderGrasslandBoar() {
    this.drawSky('#2c4b75', '#5d8bb3');
    this.drawAincradSteelCeiling();
    this.drawMountains('#2d5e48', 125);
    this.drawMountains('#3b7c5c', 140);

    // Green Grass Ground
    this.fillRect(0, 145, this.width, 55, '#40883d');
    this.fillRect(0, 155, this.width, 45, '#357032');
    this.fillRect(0, 175, this.width, 25, '#285825');

    // Pixel Grass Tufts
    for (let gx = 10; gx < 310; gx += 28) {
      this.fillRect(gx, 152, 4, 8, '#52aa4e');
      this.fillRect(gx + 3, 150, 3, 10, '#52aa4e');
    }

    // Player Pixel Sprite (Left Side)
    const px = 70;
    const py = 145;
    // Body & Cloak
    this.fillRect(px, py, 14, 22, '#202838');
    this.fillRect(px + 2, py - 10, 10, 10, '#ffccaa'); // Face
    this.fillRect(px, py - 12, 14, 6, '#181e28'); // Hair
    // Sword
    this.fillRect(px + 14, py + 4, 18, 3, '#c0d8f0');
    this.fillRect(px + 12, py + 2, 4, 7, '#d89020');

    // Frenzy Boar Pixel Sprite (Right Side)
    const bx = 220 + Math.sin(this.frame * 0.08) * 6;
    const by = 148;
    // Boar Body
    this.fillRect(bx, by, 32, 20, '#663b1e');
    this.fillRect(bx - 8, by + 6, 12, 14, '#543017'); // Snout
    // Tusks
    this.fillRect(bx - 12, by + 8, 6, 4, '#f0f0e0');
    // Red glowing eye
    this.fillRect(bx + 2, by + 4, 4, 4, '#ff2233');
    // Legs
    const step = (this.frame % 20 > 10) ? 2 : 0;
    this.fillRect(bx + 4, by + 20, 5, 8 + step, '#42240f');
    this.fillRect(bx + 22, by + 20, 5, 8 - step, '#42240f');
  }

  // 3. ทุ่งหญ้ากับดัก Coper
  renderGrasslandCoper() {
    this.drawSky('#39424e', '#5e6875');
    this.drawAincradSteelCeiling();
    this.drawMountains('#243329', 130);

    // Swampy Grass
    this.fillRect(0, 140, this.width, 60, '#2b4d32');
    this.fillRect(0, 160, this.width, 40, '#1c3622');

    // Poisonous Pitcher Plant Monster (Little Nepenthes)
    const nx = 210;
    const ny = 135;
    this.fillRect(nx, ny, 24, 35, '#2e7a3b');
    this.fillRect(nx + 4, ny - 10, 16, 12, '#912d4a'); // Flower head
    this.fillRect(nx + 8, ny - 6, 8, 4, '#ffe082');

    // Coper running away
    const cx = 270;
    this.fillRect(cx, 142, 12, 20, '#d17b28');
    this.fillRect(cx + 2, 134, 8, 8, '#f5cba7');
  }

  // 4. เมืองเริ่มต้น (Town Street)
  renderTownStreet() {
    this.drawSky('#1e2438', '#405070');
    this.drawAincradSteelCeiling();
    this.drawStars(15);

    // Stone Buildings
    this.fillRect(20, 70, 70, 90, '#363d4d');
    this.fillRect(220, 60, 80, 100, '#363d4d');
    // Windows
    this.fillRect(40, 90, 16, 20, '#ffb833');
    this.fillRect(245, 80, 18, 22, '#ffb833');

    // Cobblestone Road
    this.fillRect(0, 150, this.width, 50, '#232730');
    for (let y = 155; y < 200; y += 12) {
      for (let x = 0; x < this.width; x += 24) {
        this.fillRect(x + (y % 8), y, 20, 8, '#2e3440');
      }
    }

    // Street Lamps
    this.fillRect(100, 105, 4, 45, '#5c6475');
    this.fillRect(96, 100, 12, 6, '#ffcc44');
    // Lamp glow
    this.fillRect(92, 96, 20, 14, 'rgba(255, 204, 68, 0.2)');
  }

  // 5. ห้องพักในเมือง (Town Inn)
  renderTownInn() {
    // Room Wooden Walls
    this.fillRect(0, 0, this.width, 145, '#3b2518');
    // Wood Beams
    for (let x = 0; x < this.width; x += 40) {
      this.fillRect(x, 0, 8, 145, '#29180e');
    }
    // Floor
    this.fillRect(0, 145, this.width, 55, '#4a2f1e');
    for (let x = 0; x < this.width; x += 32) {
      this.fillRect(x, 145, 1, 55, '#2b1a10');
    }

    // Window showing night sky
    this.fillRect(40, 30, 48, 60, '#101626');
    this.fillRect(52, 40, 2, 2, '#fff'); // Star
    this.fillRect(70, 55, 2, 2, '#fff');
    this.fillRect(38, 28, 52, 4, '#543622'); // Sill

    // Bed on the right
    this.fillRect(190, 120, 100, 35, '#6b472e');
    this.fillRect(200, 115, 85, 20, '#d8d4c8'); // Blanket
    this.fillRect(205, 108, 24, 10, '#f0ede4'); // Pillow

    // Table & Candle
    this.fillRect(110, 130, 45, 25, '#543622');
    this.fillRect(128, 122, 6, 8, '#e0dcd0'); // Candle
    const flicker = Math.sin(this.frame * 0.3) * 2;
    this.fillRect(129, 117 + flicker, 4, 5, '#ffaa00'); // Flame
  }

  // 6. ปราสาทเหล็กสีดำ (Black Iron Palace / Monument of Life)
  renderBlackIronPalace() {
    this.drawSky('#080a0f', '#141824');

    // Massive Stone Pillars
    this.fillRect(20, 0, 30, 200, '#1c202b');
    this.fillRect(270, 0, 30, 200, '#1c202b');

    // Central Monument of Life Slab
    this.fillRect(90, 20, 140, 160, '#0d1017');
    this.fillRect(86, 16, 148, 6, '#262d3d'); // Slab cap

    // Glowing Names & Crossed Out Red/Black Lines
    for (let y = 35; y < 165; y += 10) {
      this.fillRect(100, y, 50, 3, '#00d2ff'); // Living
      this.fillRect(165, y, 50, 3, '#ff3344'); // Dead line
      this.fillRect(160, y + 1, 58, 1, '#111'); // Crossed strike
    }

    // Floor
    this.fillRect(0, 180, this.width, 20, '#11141c');
    // Cyan Hologram Glow on Slab
    const glowA = 0.15 + Math.sin(this.frame * 0.05) * 0.08;
    this.fillRect(90, 20, 140, 160, `rgba(0, 210, 255, ${glowA})`);
  }

  // 7. อัฒจันทร์ประชุมเดียร์เบล (Amphitheater)
  renderAmphitheater() {
    this.drawSky('#4b6584', '#778ca3');
    this.drawAincradSteelCeiling();

    // Semicircular Stone Steps
    this.fillRect(0, 110, this.width, 90, '#4b4b4b');
    this.fillRect(30, 125, this.width - 60, 75, '#595959');
    this.fillRect(60, 140, this.width - 120, 60, '#686868');
    this.fillRect(100, 155, this.width - 200, 45, '#777777');

    // Diavel Standing in Center
    const dx = 160;
    const dy = 138;
    this.fillRect(dx - 4, dy - 12, 8, 8, '#45aaf2'); // Blue Hair
    this.fillRect(dx - 3, dy - 4, 6, 6, '#ffccaa');
    this.fillRect(dx - 6, dy + 2, 12, 16, '#2d98da'); // Armor
  }

  // 8. บอสชั้น 1: Illfang the Kobold Lord
  renderBossFloor1() {
    this.drawSky('#1a0808', '#381616');

    // Dungeon Chamber Pillars
    this.fillRect(10, 0, 24, 200, '#2c2222');
    this.fillRect(286, 0, 24, 200, '#2c2222');
    // Wall Torches
    this.fillRect(20, 70, 4, 12, '#885533');
    this.fillRect(18, 62 + Math.sin(this.frame * 0.2) * 2, 8, 8, '#ff7700');
    this.fillRect(296, 70, 4, 12, '#885533');
    this.fillRect(294, 62 + Math.sin(this.frame * 0.2 + 1) * 2, 8, 8, '#ff7700');

    // Floor
    this.fillRect(0, 155, this.width, 45, '#221818');

    // Giant Boss: Illfang the Kobold Lord (Center-Right)
    const bx = 180;
    const by = 85 + Math.sin(this.frame * 0.06) * 3;
    // Horned Helmet
    this.fillRect(bx + 6, by - 16, 20, 16, '#402a2a');
    this.fillRect(bx + 2, by - 24, 6, 12, '#e0d0b0'); // Left Horn
    this.fillRect(bx + 24, by - 24, 6, 12, '#e0d0b0'); // Right Horn
    // Red Eyes
    this.fillRect(bx + 10, by - 8, 4, 3, '#ff1122');
    this.fillRect(bx + 18, by - 8, 4, 3, '#ff1122');
    // Massive Torso
    this.fillRect(bx - 6, by, 44, 45, '#5e382b');
    // Battle Axe
    this.fillRect(bx + 40, by - 15, 6, 60, '#333');
    this.fillRect(bx + 32, by - 25, 22, 20, '#8899aa');

    // Raid Players (Left)
    this.fillRect(60, 140, 10, 18, '#3867d6');
    this.fillRect(80, 142, 10, 18, '#eb3b5a');
  }

  // 9. กับดักดันเจี้ยนชั้น 27 (Anti-Crystal Trap)
  renderDungeonTrap() {
    this.drawSky('#0c0817', '#170e2b');

    // Stone Bricks
    for (let y = 0; y < 150; y += 20) {
      for (let x = 0; x < this.width; x += 40) {
        this.fillRect(x + ((y / 20) % 2 * 20), y, 38, 18, '#1e1438');
      }
    }
    this.fillRect(0, 150, this.width, 50, '#130d24');

    // Red Anti-Crystal Alarm Glow
    const alarm = Math.sin(this.frame * 0.15) > 0 ? 0.35 : 0.08;
    this.fillRect(0, 0, this.width, 200, `rgba(255, 30, 30, ${alarm})`);

    // Glowing Trap Chest in Center
    const cx = 145;
    const cy = 135;
    this.fillRect(cx, cy, 30, 20, '#b8860b');
    this.fillRect(cx - 2, cy - 4, 34, 8, '#d4af37'); // Lid open
    this.fillRect(cx + 8, cy + 4, 14, 6, '#ff0033'); // Red gem inside

    // Ominous Red Monster Eyes in Dark Corners
    this.fillRect(40, 80, 4, 2, '#ff0033');
    this.fillRect(48, 80, 4, 2, '#ff0033');
    this.fillRect(260, 70, 4, 2, '#ff0033');
    this.fillRect(268, 70, 4, 2, '#ff0033');
  }

  // 10. ดันเจี้ยนทางเดิน (Dungeon Corridor)
  renderDungeonCorridor() {
    this.drawSky('#0d1117', '#161b22');
    // Perspective Corridor
    this.ctx.fillStyle = '#21262d';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(110, 60);
    this.ctx.lineTo(110, 140);
    this.ctx.lineTo(0, 200);
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(320, 0);
    this.ctx.lineTo(210, 60);
    this.ctx.lineTo(210, 140);
    this.ctx.lineTo(320, 200);
    this.ctx.fill();

    // End of corridor doorway
    this.fillRect(110, 60, 100, 80, '#0a0d12');
    this.fillRect(145, 80, 30, 60, '#00d2ff'); // Portal light
  }

  // 11. ป่าซิลิก้า & มังกรพีน่า (Forest Silica)
  renderForestSilica() {
    this.drawSky('#1e2a38', '#385060');
    this.drawAincradSteelCeiling();

    // Giant Mystical Forest Trees
    this.fillRect(20, 40, 35, 160, '#3a271d');
    this.fillRect(0, 10, 80, 70, '#1c4a2a');
    this.fillRect(250, 30, 40, 170, '#3a271d');
    this.fillRect(220, 0, 100, 80, '#1c4a2a');

    // Forest Floor with flowers
    this.fillRect(0, 150, this.width, 50, '#2e5a36');
    this.fillRect(90, 165, 4, 4, '#ff99bb');
    this.fillRect(140, 175, 4, 4, '#77ddff');

    // Feathered Dragon Pina (Flying/Floating)
    const px = 190;
    const py = 95 + Math.sin(this.frame * 0.1) * 8;
    // Blue/Cyan Dragon Body
    this.fillRect(px, py, 18, 10, '#38ada9');
    this.fillRect(px + 14, py - 4, 8, 8, '#78e08f'); // Head
    // Feather Wings flapping
    const wingY = (this.frame % 16 > 8) ? -8 : 2;
    this.fillRect(px + 4, py + wingY, 14, 5, '#e0f8ff');

    // Silica Silhouette (Left)
    this.fillRect(110, 138, 12, 18, '#eb2f06');
    this.fillRect(112, 128, 8, 8, '#f8c291'); // Twin tails
  }

  // 12. ป่าของ Laughing Coffin (Forest PoH)
  renderForestPoH() {
    this.drawSky('#130a1c', '#2c1938');
    this.drawAincradSteelCeiling();

    // Dark Spooky Trees
    this.fillRect(30, 30, 18, 170, '#1a1020');
    this.fillRect(100, 50, 14, 150, '#1a1020');
    this.fillRect(260, 20, 24, 180, '#1a1020');

    // Purple/Dark Ground
    this.fillRect(0, 155, this.width, 45, '#1e1428');

    // PoH Mask Silhouette (Glowing red smile)
    const mx = 160;
    const my = 125;
    this.fillRect(mx, my, 16, 24, '#151515'); // Cloak
    this.fillRect(mx + 2, my - 8, 12, 10, '#333'); // Hood
    this.fillRect(mx + 4, my - 3, 8, 2, '#ff1133'); // Grin
    // Giant Meat Cleaver
    this.fillRect(mx + 16, my - 2, 8, 22, '#aaa');
  }

  // 13. ร้านตีเหล็กลิซเบ็ธ (Lisbeth's Forge)
  renderLisbethForge() {
    this.fillRect(0, 0, this.width, 145, '#2e1c14');
    this.fillRect(0, 145, this.width, 55, '#3b2518');

    // Glowing Hot Forge on Left
    this.fillRect(30, 70, 60, 75, '#1e1410');
    this.fillRect(40, 95, 40, 45, '#110a08');
    // Forge Fire
    const fireFlicker = Math.sin(this.frame * 0.2) * 4;
    this.fillRect(45, 105 + fireFlicker, 30, 30, '#ff4400');
    this.fillRect(52, 115 + fireFlicker, 16, 16, '#ffcc00');

    // Anvil in Center
    this.fillRect(150, 120, 28, 26, '#383e4a');
    this.fillRect(144, 115, 40, 10, '#555e6e');

    // Sparks from Anvil
    if (this.frame % 30 < 10) {
      this.fillRect(160 + (this.frame % 8), 105 - (this.frame % 12), 2, 2, '#ffeaa7');
      this.fillRect(168 - (this.frame % 10), 102 - (this.frame % 8), 2, 2, '#ffeaa7');
    }

    // Weapons Rack on Wall (Swords)
    this.fillRect(220, 60, 60, 40, '#22150f');
    this.fillRect(230, 65, 40, 3, '#74b9ff');
    this.fillRect(230, 78, 40, 3, '#55efc4');
    this.fillRect(230, 90, 40, 3, '#dfe6e9');
  }

  // 14. บ้านพักริมทะเลสาบชั้น 22 (Lake Cottage)
  renderLakeCottage() {
    this.drawSky('#4a69bd', '#82ccdd');
    this.drawAincradSteelCeiling();
    this.drawMountains('#38ada9', 110);

    // Lake Water (Rippling)
    this.fillRect(0, 130, this.width, 70, '#0a3d62');
    for (let rx = 10; rx < this.width; rx += 45) {
      const rw = (this.frame + rx) % 40;
      this.fillRect(rx, 145 + (rx % 30), rw, 2, 'rgba(130, 204, 221, 0.4)');
    }

    // Green Island Grass
    this.fillRect(50, 120, 140, 30, '#78e08f');

    // Log Cabin Cottage
    const cx = 80;
    const cy = 80;
    // Cabin Roof (Triangular)
    this.ctx.fillStyle = '#b71540';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 10, cy + 20);
    this.ctx.lineTo(cx + 40, cy - 10);
    this.ctx.lineTo(cx + 90, cy + 20);
    this.ctx.fill();

    // Cabin Walls
    this.fillRect(cx, cy + 20, 80, 30, '#825838');
    // Door & Window
    this.fillRect(cx + 32, cy + 30, 16, 20, '#4a2f1c');
    this.fillRect(cx + 10, cy + 26, 12, 12, '#ffeaa7');

    // Chimney with Smoke
    this.fillRect(cx + 65, cy - 2, 10, 18, '#596275');
    const smokeY = (this.frame * 0.8) % 40;
    this.fillRect(cx + 68 + Math.sin(smokeY * 0.2) * 4, cy - 10 - smokeY, 6, 6, 'rgba(255,255,255,0.4)');
  }

  // 15. บอสชั้น 74: The Gleam Eyes
  renderGleamEyes() {
    this.drawSky('#050510', '#10152b');

    // Dungeon Pillars
    this.fillRect(20, 0, 30, 200, '#1c1e2b');
    this.fillRect(270, 0, 30, 200, '#1c1e2b');
    this.fillRect(0, 160, this.width, 40, '#12141c');

    // The Gleam Eyes (Blue Demon Beast)
    const gx = 160;
    const gy = 70 + Math.sin(this.frame * 0.05) * 4;

    // Glowing Blue Horns
    this.fillRect(gx - 18, gy - 20, 8, 16, '#00d2ff');
    this.fillRect(gx + 22, gy - 20, 8, 16, '#00d2ff');
    // Demonic Blue Head
    this.fillRect(gx - 12, gy - 8, 36, 28, '#1e3799');
    // Yellow/Cyan Eyes
    this.fillRect(gx - 6, gy + 2, 6, 4, '#00ffff');
    this.fillRect(gx + 12, gy + 2, 6, 4, '#00ffff');
    // Massive Muscular Torso
    this.fillRect(gx - 26, gy + 20, 64, 60, '#0c2461');

    // Colossal Dual-Bladed Sword (Zanbato)
    this.fillRect(gx + 40, gy - 30, 10, 110, '#8395a7');
    this.fillRect(gx + 34, gy + 10, 22, 12, '#485460');
  }

  // 16. บอสชั้น 75: The Skull Reaper
  renderSkullReaper() {
    this.drawSky('#150303', '#2b0c0c');

    this.fillRect(0, 160, this.width, 40, '#1a0d0d');

    // Bone Centipede Body segments
    const sx = 180;
    const sy = 90;
    for (let i = 0; i < 6; i++) {
      const segY = sy + Math.sin(this.frame * 0.1 + i) * 3;
      this.fillRect(sx + i * 18, segY, 16, 24, '#f5f6fa');
      // Bone Legs
      this.fillRect(sx + i * 18 + 4, segY + 24, 4, 18, '#dcdde1');
    }

    // Skull Head
    this.fillRect(sx - 20, sy - 10, 28, 28, '#ffffff');
    this.fillRect(sx - 14, sy - 4, 6, 6, '#e84118'); // Red Eye
    this.fillRect(sx - 4, sy - 4, 6, 6, '#e84118');

    // Scythe Arms
    this.fillRect(sx - 40, sy - 20, 24, 8, '#f5f6fa');
    this.fillRect(sx - 45, sy - 15, 8, 40, '#ffffff');

    // Heathcliff's Red & White Cross Shield (Left)
    this.fillRect(60, 130, 22, 32, '#c23616');
    this.fillRect(60, 142, 22, 6, '#f5f6fa');
    this.fillRect(68, 130, 6, 32, '#f5f6fa');
  }

  // 17. การล่มสลายของ Aincrad (Aincrad Collapse)
  renderAincradCollapse() {
    // Beautiful Sunset Sky
    this.drawSky('#f39c12', '#8e44ad');

    // Floating Aincrad Castle in Distance
    const cx = 160;
    const cy = 70;
    this.ctx.fillStyle = '#2c3e50';
    this.ctx.beginPath();
    this.ctx.moveTo(cx - 70, cy - 20);
    this.ctx.lineTo(cx + 70, cy - 20);
    this.ctx.lineTo(cx, cy + 50);
    this.ctx.fill();

    // Polygon Shatter Particles falling
    for (let p = 0; p < 25; p++) {
      const px = (cx - 60 + (p * 23)) % this.width;
      const py = (cy - 10 + (this.frame * 1.5 + p * 15)) % 180;
      this.fillRect(px, py, 4, 4, '#00d2ff');
      this.fillRect(px + 2, py + 2, 2, 2, '#fff');
    }

    // Cloud layers below
    this.fillRect(0, 160, this.width, 40, 'rgba(255, 235, 200, 0.4)');
    this.fillRect(0, 175, this.width, 25, 'rgba(255, 255, 255, 0.6)');
  }

  // 18. เตียงโรงพยาบาลในโลกจริง (Hospital Bed)
  renderHospitalBed() {
    this.drawSky('#e0e8f0', '#ffffff');

    // Window with sunlight
    this.fillRect(180, 20, 90, 80, '#82ccdd');
    this.fillRect(170, 15, 110, 6, '#dfe4ea'); // Frame
    // Sun rays
    this.ctx.fillStyle = 'rgba(255, 230, 150, 0.25)';
    this.ctx.beginPath();
    this.ctx.moveTo(225, 20);
    this.ctx.lineTo(0, 200);
    this.ctx.lineTo(150, 200);
    this.ctx.fill();

    // Hospital Bed
    this.fillRect(40, 120, 140, 45, '#a4b0be');
    this.fillRect(50, 110, 120, 30, '#ffffff'); // Blanket
    this.fillRect(55, 100, 28, 12, '#ced6e0'); // Pillow

    // Heart Rate Monitor
    this.fillRect(230, 115, 35, 45, '#2f3542');
    this.fillRect(235, 120, 25, 18, '#1e272e');
    // ECG Green Pulse Line
    const pulseY = (this.frame % 20 < 10) ? 128 : 125;
    this.fillRect(238, pulseY, 18, 2, '#2ed573');
  }

  // 19. หลุมศพ Game Over (Grave Game Over)
  renderGraveGameOver() {
    this.drawSky('#10141a', '#222831');

    // Rain lines
    for (let r = 0; r < 20; r++) {
      const rx = (r * 29 + this.frame * 3) % this.width;
      const ry = (r * 17 + this.frame * 8) % 180;
      this.fillRect(rx, ry, 1, 6, 'rgba(150, 180, 220, 0.4)');
    }

    // Muddy Dark Ground
    this.fillRect(0, 150, this.width, 50, '#1e2022');

    // Stone Tombstone in Center
    const tx = 160;
    const ty = 110;
    this.fillRect(tx - 18, ty, 36, 45, '#57606f');
    this.fillRect(tx - 24, ty + 40, 48, 8, '#2f3542'); // Base
    // Cross carved on stone
    this.fillRect(tx - 2, ty + 8, 4, 18, '#2f3542');
    this.fillRect(tx - 8, ty + 12, 16, 4, '#2f3542');

    // Red Polygons dissipating into sky
    for (let p = 0; p < 8; p++) {
      const px = tx - 10 + (p * 7);
      const py = (ty - (this.frame * 1.2 + p * 12)) % 100;
      this.fillRect(px, 100 + py, 3, 3, '#ff3838');
    }
  }
}

// Global instance variable
window.pixelRenderer = null;
