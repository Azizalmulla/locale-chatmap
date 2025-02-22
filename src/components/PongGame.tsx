import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PongGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paddleHeight = 60;
    const paddleWidth = 10;
    const ballSize = 8;
    
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;
    
    let paddle1Y = canvas.height / 2 - paddleHeight / 2;
    let paddle2Y = canvas.height / 2 - paddleHeight / 2;
    let player1Score = 0;
    let player2Score = 0;
    
    const aiSpeed = 4;
    
    function drawRect(x: number, y: number, width: number, height: number) {
      ctx.fillStyle = '#0DF5E3';
      ctx.fillRect(x, y, width, height);
    }
    
    function drawCircle(x: number, y: number, radius: number) {
      ctx.fillStyle = '#0DF5E3';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    function drawText(text: string, x: number, y: number) {
      ctx.fillStyle = '#0DF5E3';
      ctx.font = '30px VT323';
      ctx.fillText(text, x, y);
    }
    
    function moveEverything() {
      if (!gameStarted) return;
      
      // AI Movement
      if (paddle2Y + paddleHeight / 2 < ballY) {
        paddle2Y += aiSpeed;
      } else if (paddle2Y + paddleHeight / 2 > ballY) {
        paddle2Y -= aiSpeed;
      }
      
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      
      // Left paddle collision
      if (ballX < paddleWidth + 10) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          let deltaY = ballY - (paddle1Y + paddleHeight / 2);
          ballSpeedY = deltaY * 0.15;
        } else if (ballX < 0) {
          player2Score++;
          ballReset();
        }
      }
      
      // Right paddle collision
      if (ballX > canvas.width - paddleWidth - 10) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          let deltaY = ballY - (paddle2Y + paddleHeight / 2);
          ballSpeedY = deltaY * 0.15;
        } else if (ballX > canvas.width) {
          player1Score++;
          ballReset();
        }
      }
      
      // Top and bottom collision
      if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
      }
    }
    
    function ballReset() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
      ballSpeedY = 4;
    }
    
    function drawEverything() {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (!gameStarted) {
        drawText('CLICK TO START', canvas.width / 2 - 100, canvas.height / 2);
        return;
      }
      
      // Draw paddles
      drawRect(10, paddle1Y, paddleWidth, paddleHeight);
      drawRect(canvas.width - paddleWidth - 10, paddle2Y, paddleWidth, paddleHeight);
      
      // Draw ball
      drawCircle(ballX, ballY, ballSize);
      
      // Draw scores
      drawText(player1Score.toString(), 100, 100);
      drawText(player2Score.toString(), canvas.width - 100, 100);
      
      // Draw center line
      for (let i = 0; i < canvas.height; i += 40) {
        drawRect(canvas.width / 2 - 1, i, 2, 20);
      }
    }
    
    function handleMouseMove(event: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = event.clientY - rect.top - root.scrollTop;
      paddle1Y = mouseY - paddleHeight / 2;
      
      // Keep paddle within canvas bounds
      if (paddle1Y < 0) {
        paddle1Y = 0;
      }
      if (paddle1Y > canvas.height - paddleHeight) {
        paddle1Y = canvas.height - paddleHeight;
      }
    }
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', () => setGameStarted(true));
    
    const gameLoop = setInterval(() => {
      moveEverything();
      drawEverything();
    }, 1000 / 60);
    
    return () => {
      clearInterval(gameLoop);
      canvas.removeEventListener('mousemove', handleMouseMove);
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

export default PongGame;
