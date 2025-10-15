const MAX_CONCURRENT = 3; // how many at once
const STAR_SPEED = 8; // base speed factor
const MAX_LIFETIME = 500; // in 60fps frames (used as a base)
const ANGLE = Math.PI / 3.5;
const SPAWN_MIN_MS = 250; // min delay between stars
const SPAWN_MAX_MS = 1000; // max delay between stars
const LINE_WIDTH = 1.35; 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class ShootingStar {
    constructor() {
        this.maxTrail = 50;
        this.history = [];
        this.reset(true);
    }

    update(dt = 1) {
        this.lifetime -= dt;
        this.x -= Math.cos(ANGLE) * this.speed * dt;
        this.y += Math.sin(ANGLE) * this.speed * dt;

        if (this.lifetime <= 0 || this.x < -this.length || this.y - this.length > H) {
            this.dead = true;
        }
    }

    reset(initial = false) {
        this.x = Math.random() * (W + 200) - 100;
        this.y = initial ? Math.random() * 60 - 20 : -20;
        this.length = Math.random() * 20 + 35;
        this.speed = Math.random() * STAR_SPEED + 2;
        this.lifeMax = Math.random() * MAX_LIFETIME + MAX_LIFETIME * 0.5;
        this.lifetime = this.lifeMax;
        this.dead = false;
        this.history.length = 0;
        this.history.push({ x: this.x, y: this.y });
    }

    draw() {
        const t = Math.max(0, Math.min(1, this.lifetime / this.lifeMax));
        const len = this.history.length;
        for (let i = 1; i < len; i++) {
            const p0 = this.history[i - 1];
            const p1 = this.history[i];
            const k = i / len;
            const alpha = 0.28 * k * t;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = LINE_WIDTH * (0.4 + 0.6 * k);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        }
    }
}

const stars = [];
let nextSpawnAt = performance.now() + (Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS) + SPAWN_MIN_MS);

function spawnStar(initial = false) {
    if (stars.length >= MAX_CONCURRENT) return;
    const s = new ShootingStar();
    if (initial) {
        s.y = Math.random() * 40 - 10;
    }
    stars.push(s);
}

let lastTs = performance.now();
anime({
    duration: Infinity,
    easing: 'linear',
    update: () => {
        const now = performance.now();
        const dt = (now - lastTs) / (1000 / 60);
        lastTs = now;

        ctx.clearRect(0, 0, W, H);

        if (now >= nextSpawnAt) {
            spawnStar();
            nextSpawnAt = now + (Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS) + SPAWN_MIN_MS);
        }

        for (let i = stars.length - 1; i >= 0; i--) {
            const s = stars[i];
            s.update(dt);
            const h = s.history;
            const last = h[h.length - 1];
            if (!last || last.x !== s.x || last.y !== s.y) {
                h.push({ x: s.x, y: s.y });
                if (h.length > s.maxTrail) h.shift();
            }
            s.draw();
            if (s.dead) stars.splice(i, 1);
        }
    }
});

spawnStar(true);
