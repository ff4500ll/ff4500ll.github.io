// sonstants
const NUM_STARS = 10;
const STAR_SPEED = 2;
const MAX_LIFETIME = 500;
const ANGLE = Math.PI / 3.5; 

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// How the fuck do you make a trailing effect

class ShootingStar {
    constructor() {
        // random start from the top
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 20 + 50; // star length
        this.speed = Math.random() * STAR_SPEED + 1;
        this.lifetime = Math.random() * MAX_LIFETIME;
    }

    update() {
        this.lifetime--;
        // update `x` and `y` based on the fixed angle and reversed `x` direction
        this.x -= Math.cos(ANGLE) * this.speed;
        this.y += Math.sin(ANGLE) * this.speed;

        // reset star position
        if (this.lifetime <= 0 || this.x < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * STAR_SPEED + 1;
        this.lifetime = Math.random() * MAX_LIFETIME;
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length * Math.cos(ANGLE), this.y + this.length * Math.sin(ANGLE));
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.globalAlpha = 0.5; // line transparency
    }
}

const stars = Array.from({ length: NUM_STARS }, () => new ShootingStar());

// animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

animate();
