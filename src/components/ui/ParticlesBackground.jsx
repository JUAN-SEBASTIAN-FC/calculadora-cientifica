import { useEffect, useRef } from 'react';

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    const mouse = { x: null, y: null, radius: 150 };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    class Particle {
      constructor(x, y, dx, dy, size) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        
        // Theme-responsive color variable via CSS custom properties would be ideal, 
        // but drawing directly with theme-agnostic colors for tech vibe.
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(2, 132, 199, 0.4)';
        ctx.fill();
      }

      update() {
        // Natural movement
        this.x += this.dx;
        this.y += this.dy;

        // Bounce borders
        if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
        if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            // Calculate force pushing away
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * this.density * 0.4;
            const directionY = forceDirectionY * force * this.density * 0.4;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }
        
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      const numberOfParticles = (canvas.width * canvas.height) / 12000; // responsive density
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * (canvas.width - size * 2) + size * 2);
        let y = (Math.random() * (canvas.height - size * 2) + size * 2);
        let dx = (Math.random() * 0.8) - 0.4;
        let dy = (Math.random() * 0.8) - 0.4;
        particles.push(new Particle(x, y, dx, dy, size));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isDark = document.body.getAttribute('data-theme') === 'dark';
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        // Connect nodes
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.beginPath();
            const opacity = 1 - (distance / 120);
            ctx.strokeStyle = isDark 
              ? `rgba(52, 211, 153, ${opacity * 0.2})` 
              : `rgba(2, 132, 199, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        background: 'transparent',
        pointerEvents: 'none'
      }}
    />
  );
}
