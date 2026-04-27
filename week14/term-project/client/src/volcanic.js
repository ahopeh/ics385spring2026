export function initVolcanicEffects() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let mouseX = 0;
    let mouseY = 0;
    let particles = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (Math.random() < 0.4) {
            particles.push(createParticle(mouseX, mouseY));
        }
    });

    function createParticle(x, y) {
        const isSpark = Math.random() < 0.2;
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -Math.random() * 1.2 - 0.3,
            life: 1,
            decay: Math.random() * 0.02 + 0.015,
            size: isSpark
                ? Math.random() * 1.5 + 0.5
                : Math.random() * 4 + 2,
            isSpark,
            color: isSpark
                ? `rgba(232, 160, 48,`
                : `rgba(180, 160, 140,`,
        };
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles = particles.filter(p => p.life > 0);

        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 0.01;
            p.life -= p.decay;

            ctx.beginPath();
            if (p.isSpark) {
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${p.life})`;
                ctx.fill();
            } else {
                const radius = p.size * (1 + (1 - p.life)) * 3;
                const gradient = ctx.createRadialGradient(
                    p.x, p.y, 0,
                    p.x, p.y, radius
                );
                gradient.addColorStop(0, `${p.color}${p.life * 0.12})`);
                gradient.addColorStop(1, `${p.color}0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
              }
        }

        requestAnimationFrame(animate);
    }

    animate();
  }