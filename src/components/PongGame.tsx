import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SpaceGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game entities
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      width: 30,
      height: 20,
      speed: 5
    };

    const bullets: { x: number; y: number; speed: number }[] = [];
    const enemies: { x: number; y: number; width: number; height: number }[] = [];
    let score = 0;

    // Create initial enemies
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        enemies.push({
          x: 80 + i * 60,
          y: 50 + j * 50,
          width: 30,
          height: 20
        });
      }
    }

    function drawPlayer() {
      ctx.fillStyle = '#0DF5E3';
      ctx.beginPath();
      ctx.moveTo(player.x, player.y);
      ctx.lineTo(player.x - player.width / 2, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height);
      ctx.closePath();
      ctx.fill();
    }

    function drawBullets() {
      ctx.fillStyle = '#0DF5E3';
      bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2, bullet.y - 8, 4, 8);
      });
    }

    function drawEnemies() {
      ctx.fillStyle = '#0DF5E3';
      enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y + enemy.height);
        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
        ctx.closePath();
        ctx.fill();
      });
    }

    function drawScore() {
      ctx.fillStyle = '#0DF5E3';
      ctx.font = '30px VT323';
      ctx.fillText(`SCORE: ${score}`, 10, 30);
    }

    function moveEverything() {
      if (!gameStarted) return;

      // Move bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
          bullets.splice(i, 1);
        }
      }

      // Check collisions
      for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
          if (bullets[j] && enemies[i] &&
              bullets[j].x > enemies[i].x &&
              bullets[j].x < enemies[i].x + enemies[i].width &&
              bullets[j].y > enemies[i].y &&
              bullets[j].y < enemies[i].y + enemies[i].height) {
            enemies.splice(i, 1);
            bullets.splice(j, 1);
            score += 100;
            break;
          }
        }
      }

      // Respawn enemies if all destroyed
      if (enemies.length === 0) {
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 3; j++) {
            enemies.push({
              x: 80 + i * 60,
              y: 50 + j * 50,
              width: 30,
              height: 20
            });
          }
        }
      }
    }

    function drawEverything() {
      // Clear canvas with retro effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!gameStarted) {
        ctx.fillStyle = '#0DF5E3';
        ctx.font = '30px VT323';
        ctx.fillText('CLICK TO START', canvas.width / 2 - 100, canvas.height / 2);
        return;
      }

      drawPlayer();
      drawBullets();
      drawEnemies();
      drawScore();
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseX = event.clientX - rect.left - root.scrollLeft;
      player.x = mouseX;

      // Keep player within canvas bounds
      if (player.x < player.width / 2) {
        player.x = player.width / 2;
      }
      if (player.x > canvas.width - player.width / 2) {
        player.x = canvas.width - player.width / 2;
      }
    }

    function handleClick() {
      if (!gameStarted) {
        setGameStarted(true);
        return;
      }

      // Create new bullet
      bullets.push({
        x: player.x,
        y: player.y,
        speed: 7
      });
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const gameLoop = setInterval(() => {
      moveEverything();
      drawEverything();
    }, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [gameStarted]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="w-full max-w-3xl mx-auto p-4"
    >
      <div className="relative border border-[#0DF5E3]/20 rounded-lg overflow-hidden retro-glow">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full bg-black/40 cursor-pointer"
        />
      </div>
    </motion.div>
  );
};

export default SpaceGame;
