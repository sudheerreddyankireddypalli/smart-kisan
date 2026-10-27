/**
 * Sky High: Isometric Tower Rush
 * 100% Zero-Investment Monetization-Ready Hyper-Casual Game
 */

// ==========================================
// 1. AUDIO SYNTHESIZER (Pure Web Audio API)
// ==========================================
class SoundFX {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    playPlace(combo) {
        if (!this.enabled) return;
        this.init();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const freqIndex = Math.min(combo, this.pentatonic.length - 1);
        const freq = this.pentatonic[freqIndex];

        osc.type = combo > 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (combo > 0 ? 0.35 : 0.15));

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }

    playFall() {
        if (!this.enabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.42);
    }

    playCoin() {
        if (!this.enabled) return;
        this.init();

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, this.ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.26);
    }
}

// ==========================================
// 2. THEMES & SKINS
// ==========================================
const SKINS = [
    { id: 'cyber', name: 'Cyber Neon', cost: 0, baseHue: 190, hueStep: 5, sat: 85, light: 55 },
    { id: 'sunset', name: 'Sunset Glow', cost: 50, baseHue: 15, hueStep: 6, sat: 90, light: 56 },
    { id: 'matrix', name: 'Emerald Flux', cost: 120, baseHue: 140, hueStep: 4, sat: 80, light: 50 },
    { id: 'pastel', name: 'Pastel Dream', cost: 200, baseHue: 280, hueStep: 6, sat: 65, light: 70 },
    { id: 'gold', name: 'Imperial Gold', cost: 350, baseHue: 45, hueStep: 2, sat: 95, light: 55 }
];

// ==========================================
// 3. CORE GAME ENGINE
// ==========================================
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sound = new SoundFX();

        // Game State
        this.state = 'MENU';
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('skyhigh_best') || '0', 10);
        this.totalCoins = parseInt(localStorage.getItem('skyhigh_coins') || '0', 10);
        this.unlockedSkins = JSON.parse(localStorage.getItem('skyhigh_skins') || '["cyber"]');
        this.currentSkinId = localStorage.getItem('skyhigh_active_skin') || 'cyber';

        this.combo = 0;
        this.revivedThisRun = false;
        this.runCoins = 0;

        // Block Parameters
        this.BLOCK_HEIGHT = 18;
        this.BASE_SIZE = 140;
        this.blocks = [];
        this.debrisList = [];
        this.particles = [];

        // Active Moving Block
        this.activeBlock = null;
        this.moveAxis = 'x';
        this.moveDirection = 1;
        this.moveSpeed = 3.2;

        // Camera
        this.cameraY = 0;
        this.targetCameraY = 0;

        this.setupDOM();
        this.resize();
        window.addEventListener('resize', () => this.resize());

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    get currentSkin() {
        return SKINS.find(s => s.id === this.currentSkinId) || SKINS[0];
    }

    setupDOM() {
        this.scoreEl = document.getElementById('current-score');
        this.comboEl = document.getElementById('combo-pill');
        this.coinEl = document.getElementById('coin-counter');
        this.startScreen = document.getElementById('start-screen');
        this.gameoverScreen = document.getElementById('gameover-screen');
        this.shopScreen = document.getElementById('shop-screen');
        this.tapHint = document.getElementById('tap-hint');

        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.startGame());
        document.getElementById('sound-btn').addEventListener('click', (e) => {
            const enabled = this.sound.toggle();
            e.currentTarget.innerText = enabled ? '🔊' : '🔇';
        });

        document.getElementById('shop-btn').addEventListener('click', () => this.openShop());
        document.getElementById('menu-shop-btn').addEventListener('click', () => this.openShop());
        document.getElementById('close-shop-btn').addEventListener('click', () => this.closeShop());

        document.getElementById('revive-btn').addEventListener('click', () => this.handleReviveAd());
        document.getElementById('double-coins-btn').addEventListener('click', () => this.handleDoubleCoinsAd());

        const handleAction = (e) => {
            if (e.target.closest('button') || e.target.closest('.card')) return;
            if (this.state === 'PLAYING') {
                this.placeBlock();
            } else if (this.state === 'MENU') {
                this.startGame();
            }
        };

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                handleAction(e);
            }
        });

        this.canvas.addEventListener('pointerdown', (e) => {
            handleAction(e);
        });

        this.updateHUD();
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.resetTransform();
        this.ctx.scale(dpr, dpr);
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
    }

    updateHUD() {
        this.scoreEl.innerText = this.score;
        this.coinEl.innerText = this.totalCoins;
        document.getElementById('menu-best-score').innerText = this.bestScore;
        document.getElementById('menu-coins').innerText = this.totalCoins;
        document.getElementById('final-score').innerText = this.score;
        document.getElementById('final-best').innerText = this.bestScore;
    }

    startGame() {
        this.state = 'PLAYING';
        this.score = 0;
        this.combo = 0;
        this.revivedThisRun = false;
        this.runCoins = 0;
        this.moveSpeed = 3.2;

        this.startScreen.classList.remove('active');
        this.gameoverScreen.classList.remove('active');
        this.shopScreen.classList.remove('active');
        this.tapHint.style.display = 'block';

        this.blocks = [];
        this.debrisList = [];
        this.particles = [];

        const baseBlock = {
            x: 0,
            z: 0,
            y: 0,
            w: this.BASE_SIZE,
            d: this.BASE_SIZE,
            hue: this.currentSkin.baseHue
        };
        this.blocks.push(baseBlock);

        this.cameraY = 0;
        this.targetCameraY = 0;
        this.spawnNextBlock();
        this.updateHUD();
    }

    spawnNextBlock() {
        const prev = this.blocks[this.blocks.length - 1];
        const layer = this.blocks.length;

        this.moveAxis = (layer % 2 === 1) ? 'x' : 'z';
        this.moveDirection = Math.random() > 0.5 ? 1 : -1;

        this.moveSpeed = 3.2 + Math.min(layer * 0.05, 3.8);

        const spawnDistance = 220;
        const startX = this.moveAxis === 'x' ? -spawnDistance * this.moveDirection : prev.x;
        const startZ = this.moveAxis === 'z' ? -spawnDistance * this.moveDirection : prev.z;

        const skin = this.currentSkin;
        const hue = (skin.baseHue + layer * skin.hueStep) % 360;

        this.activeBlock = {
            x: startX,
            z: startZ,
            y: layer * this.BLOCK_HEIGHT,
            w: prev.w,
            d: prev.d,
            hue: hue
        };

        this.targetCameraY = layer * this.BLOCK_HEIGHT;
    }

    placeBlock() {
        if (!this.activeBlock) return;

        const prev = this.blocks[this.blocks.length - 1];
        const cur = this.activeBlock;

        let isPerfect = false;
        const PERFECT_THRESHOLD = 3.5;

        if (this.moveAxis === 'x') {
            const diff = cur.x - prev.x;
            const absDiff = Math.abs(diff);

            if (absDiff <= PERFECT_THRESHOLD) {
                cur.x = prev.x;
                isPerfect = true;
            } else if (absDiff >= cur.w) {
                this.gameOver(cur);
                return;
            } else {
                const slicedWidth = cur.w - absDiff;
                const keptX = (cur.x + prev.x) / 2;
                const debrisX = diff > 0 ? (prev.x + cur.w / 2 + absDiff / 2) : (prev.x - cur.w / 2 - absDiff / 2);

                this.debrisList.push({
                    x: debrisX,
                    z: cur.z,
                    y: cur.y,
                    w: absDiff,
                    d: cur.d,
                    hue: cur.hue,
                    vy: 0,
                    vx: diff > 0 ? 1.8 : -1.8,
                    vz: 0,
                    rot: 0,
                    vrot: diff > 0 ? 0.05 : -0.05
                });

                cur.w = slicedWidth;
                cur.x = keptX;
            }
        } else {
            const diff = cur.z - prev.z;
            const absDiff = Math.abs(diff);

            if (absDiff <= PERFECT_THRESHOLD) {
                cur.z = prev.z;
                isPerfect = true;
            } else if (absDiff >= cur.d) {
                this.gameOver(cur);
                return;
            } else {
                const slicedDepth = cur.d - absDiff;
                const keptZ = (cur.z + prev.z) / 2;
                const debrisZ = diff > 0 ? (prev.z + cur.d / 2 + absDiff / 2) : (prev.z - cur.d / 2 - absDiff / 2);

                this.debrisList.push({
                    x: cur.x,
                    z: debrisZ,
                    y: cur.y,
                    w: cur.w,
                    d: absDiff,
                    hue: cur.hue,
                    vy: 0,
                    vx: 0,
                    vz: diff > 0 ? 1.8 : -1.8,
                    rot: 0,
                    vrot: diff > 0 ? 0.05 : -0.05
                });

                cur.d = slicedDepth;
                cur.z = keptZ;
            }
        }

        if (isPerfect) {
            this.combo++;
            this.sound.playPlace(this.combo);
            this.spawnSparkles(cur);

            const bonusCoins = this.combo >= 3 ? 5 : 2;
            this.addCoins(bonusCoins);

            this.comboEl.innerText = `PERFECT x${this.combo}`;
            this.comboEl.classList.add('active');

            if (this.combo % 5 === 0) {
                cur.w = Math.min(cur.w + 6, this.BASE_SIZE);
                cur.d = Math.min(cur.d + 6, this.BASE_SIZE);
            }
        } else {
            this.combo = 0;
            this.sound.playPlace(0);
            this.comboEl.classList.remove('active');
        }

        this.blocks.push(cur);
        this.score++;
        this.addCoins(1);

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('skyhigh_best', this.bestScore.toString());
        }

        this.updateHUD();
        this.spawnNextBlock();
    }

    addCoins(amount) {
        this.runCoins += amount;
        this.totalCoins += amount;
        localStorage.setItem('skyhigh_coins', this.totalCoins.toString());
        this.sound.playCoin();
        this.updateHUD();
    }

    gameOver(fallingBlock) {
        this.state = 'GAMEOVER';
        this.sound.playFall();

        if (fallingBlock) {
            this.debrisList.push({
                x: fallingBlock.x,
                z: fallingBlock.z,
                y: fallingBlock.y,
                w: fallingBlock.w,
                d: fallingBlock.d,
                hue: fallingBlock.hue,
                vy: 0,
                vx: (Math.random() - 0.5) * 2,
                vz: (Math.random() - 0.5) * 2,
                rot: 0,
                vrot: 0.06
            });
        }
        this.activeBlock = null;

        const reviveBtn = document.getElementById('revive-btn');
        reviveBtn.style.display = this.revivedThisRun ? 'none' : 'flex';

        const doubleCoinsBtn = document.getElementById('double-coins-btn');
        doubleCoinsBtn.disabled = false;
        doubleCoinsBtn.innerHTML = '<span>⭐</span> 2X COINS (WATCH AD)';

        setTimeout(() => {
            this.gameoverScreen.classList.add('active');
            this.tapHint.style.display = 'none';
            this.updateHUD();

            if (this.score >= 5 && Math.random() < 0.35) {
                window.adManager.showInterstitialAd({});
            }
        }, 600);
    }

    handleReviveAd() {
        window.adManager.showRewardedAd({
            onReward: () => {
                this.revivedThisRun = true;
                this.gameoverScreen.classList.remove('active');
                this.tapHint.style.display = 'block';
                this.state = 'PLAYING';
                this.debrisList = [];
                this.spawnNextBlock();
            }
        });
    }

    handleDoubleCoinsAd() {
        window.adManager.showRewardedAd({
            onReward: () => {
                this.totalCoins += this.runCoins;
                localStorage.setItem('skyhigh_coins', this.totalCoins.toString());
                this.updateHUD();
                
                const dBtn = document.getElementById('double-coins-btn');
                dBtn.disabled = true;
                dBtn.innerText = '✓ COINS DOUBLED!';
            }
        });
    }

    openShop() {
        this.shopScreen.classList.add('active');
        const container = document.getElementById('skins-container');
        container.innerHTML = '';

        SKINS.forEach(skin => {
            const isUnlocked = this.unlockedSkins.includes(skin.id);
            const isSelected = this.currentSkinId === skin.id;

            const card = document.createElement('div');
            card.className = `skin-card ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="skin-preview" style="background: hsl(${skin.baseHue}, ${skin.sat}%, ${skin.light}%);"></div>
                <div class="skin-name">${skin.name}</div>
                <div class="skin-cost">${isUnlocked ? (isSelected ? 'EQUIPPED' : 'SELECT') : `${skin.cost} COINS`}</div>
            `;

            card.addEventListener('click', () => {
                if (isUnlocked) {
                    this.currentSkinId = skin.id;
                    localStorage.setItem('skyhigh_active_skin', skin.id);
                    this.openShop();
                } else if (this.totalCoins >= skin.cost) {
                    this.totalCoins -= skin.cost;
                    this.unlockedSkins.push(skin.id);
                    this.currentSkinId = skin.id;
                    localStorage.setItem('skyhigh_coins', this.totalCoins.toString());
                    localStorage.setItem('skyhigh_skins', JSON.stringify(this.unlockedSkins));
                    localStorage.setItem('skyhigh_active_skin', skin.id);
                    this.sound.playCoin();
                    this.openShop();
                    this.updateHUD();
                } else {
                    alert(`Need ${skin.cost - this.totalCoins} more coins! Play or watch ads to earn.`);
                }
            });

            container.appendChild(card);
        });
    }

    closeShop() {
        this.shopScreen.classList.remove('active');
    }

    spawnSparkles(block) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: block.x + (Math.random() - 0.5) * block.w,
                z: block.z + (Math.random() - 0.5) * block.d,
                y: block.y + this.BLOCK_HEIGHT,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2,
                vz: (Math.random() - 0.5) * 3,
                hue: block.hue,
                alpha: 1.0,
                size: Math.random() * 4 + 2
            });
        }
    }

    toScreen(x, y, z) {
        const originX = this.viewportWidth / 2;
        const originY = this.viewportHeight * 0.65 + this.cameraY;
        const angle = Math.PI / 6;

        const sx = (x - z) * Math.cos(angle) + originX;
        const sy = (x + z) * Math.sin(angle) - y + originY;
        return { x: sx, y: sy };
    }

    drawBlock(block, isDebris = false, rot = 0) {
        const { x, z, y, w, d, hue } = block;
        const h = this.BLOCK_HEIGHT;

        if (isDebris && rot) {
            const center = this.toScreen(x, y + h / 2, z);
            this.ctx.save();
            this.ctx.translate(center.x, center.y);
            this.ctx.rotate(rot);
            this.ctx.translate(-center.x, -center.y);
        }

        const p1 = this.toScreen(x - w / 2, y + h, z - d / 2);
        const p2 = this.toScreen(x + w / 2, y + h, z - d / 2);
        const p3 = this.toScreen(x + w / 2, y + h, z + d / 2);
        const p4 = this.toScreen(x - w / 2, y + h, z + d / 2);

        const b2 = this.toScreen(x + w / 2, y, z - d / 2);
        const b3 = this.toScreen(x + w / 2, y, z + d / 2);
        const b4 = this.toScreen(x - w / 2, y, z + d / 2);

        const skin = this.currentSkin;

        // Right Face
        this.ctx.fillStyle = `hsl(${hue}, ${skin.sat}%, ${skin.light * 0.72}%)`;
        this.ctx.beginPath();
        this.ctx.moveTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.lineTo(b3.x, b3.y);
        this.ctx.lineTo(b2.x, b2.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Left / Front Face
        this.ctx.fillStyle = `hsl(${hue}, ${skin.sat}%, ${skin.light * 0.55}%)`;
        this.ctx.beginPath();
        this.ctx.moveTo(p3.x, p3.y);
        this.ctx.lineTo(p4.x, p4.y);
        this.ctx.lineTo(b4.x, b4.y);
        this.ctx.lineTo(b3.x, b3.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Top Face
        this.ctx.fillStyle = `hsl(${hue}, ${skin.sat}%, ${skin.light}%)`;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p3.x, p3.y);
        this.ctx.lineTo(p4.x, p4.y);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = `hsla(${hue}, 100%, 85%, 0.25)`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        if (isDebris && rot) {
            this.ctx.restore();
        }
    }

    loop(time) {
        const dt = Math.min((time - this.lastTime) / 1000, 0.1);
        this.lastTime = time;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        this.cameraY += (this.targetCameraY - this.cameraY) * 0.08;

        if (this.state === 'PLAYING' && this.activeBlock) {
            const limit = 220;
            if (this.moveAxis === 'x') {
                this.activeBlock.x += this.moveSpeed * this.moveDirection;
                if (this.activeBlock.x > limit) {
                    this.activeBlock.x = limit;
                    this.moveDirection = -1;
                } else if (this.activeBlock.x < -limit) {
                    this.activeBlock.x = -limit;
                    this.moveDirection = 1;
                }
            } else {
                this.activeBlock.z += this.moveSpeed * this.moveDirection;
                if (this.activeBlock.z > limit) {
                    this.activeBlock.z = limit;
                    this.moveDirection = -1;
                } else if (this.activeBlock.z < -limit) {
                    this.activeBlock.z = -limit;
                    this.moveDirection = 1;
                }
            }
        }

        for (let i = this.debrisList.length - 1; i >= 0; i--) {
            const deb = this.debrisList[i];
            deb.vy -= 18 * dt;
            deb.y += deb.vy;
            deb.x += deb.vx;
            deb.z += deb.vz;
            deb.rot += deb.vrot;

            if (deb.y < this.cameraY - 400) {
                this.debrisList.splice(i, 1);
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;
            p.vy -= 4 * dt;
            p.alpha -= 1.8 * dt;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.viewportWidth, this.viewportHeight);

        for (let i = 0; i < this.blocks.length; i++) {
            this.drawBlock(this.blocks[i]);
        }

        if (this.activeBlock) {
            this.drawBlock(this.activeBlock);
        }

        for (let i = 0; i < this.debrisList.length; i++) {
            this.drawBlock(this.debrisList[i], true, this.debrisList[i].rot);
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            const pt = this.toScreen(p.x, p.y, p.z);
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${p.alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
