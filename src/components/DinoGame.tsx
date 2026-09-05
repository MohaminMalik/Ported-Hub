'use client';
import { useEffect, useRef, useState } from 'react';

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [discountWon, setDiscountWon] = useState(false);
  const [winCode, setWinCode] = useState('');
  
  useEffect(() => {
    const handleStartGameKey = (e: KeyboardEvent) => {
      if (!isPlaying && !discountWon && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault();
        setScore(0);
        setIsGameOver(false);
        setIsPlaying(true);
      }
    };
    
    window.addEventListener('keydown', handleStartGameKey);
    return () => window.removeEventListener('keydown', handleStartGameKey);
  }, [isPlaying, discountWon]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let frame = 0;
    let currentScore = 0;
    let gameEnded = false;
    
    const player = {
      x: 50,
      y: 200,
      width: 40,
      height: 40,
      dy: 0,
      gravity: 0.6,
      jumpPower: -12,
      grounded: false
    };
    
    const obstacles: any[] = [];
    const collectibles: any[] = [];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && player.grounded) {
        player.dy = player.jumpPower;
        player.grounded = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    const gameLoop = () => {
      if (gameEnded) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update player
      player.dy += player.gravity;
      player.y += player.dy;
      
      // Ground collision
      if (player.y + player.height > canvas.height - 20) {
        player.y = canvas.height - 20 - player.height;
        player.dy = 0;
        player.grounded = true;
      }
      
      // Draw ground
      ctx.fillStyle = '#1a1d24';
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
      
      // Draw player (Guy)
      ctx.font = '40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.save();
      const pCenterX = player.x + player.width/2;
      const pCenterY = player.y + player.height/2 + 5;
      ctx.translate(pCenterX, pCenterY);
      
      // Flip horizontally so the emoji faces right
      ctx.scale(-1, 1);
      
      const playerEmoji = player.grounded ? (Math.floor(frame / 8) % 2 === 0 ? '🏃‍♂️' : '🚶‍♂️') : '🏃‍♂️';
      const playerYOffset = player.grounded && Math.floor(frame / 8) % 2 === 0 ? -3 : 0;
      
      ctx.fillText(playerEmoji, 0, playerYOffset);
      ctx.restore();
      
      // Dynamic difficulty based on score - Hard but fair
      const gameSpeed = 7.5 + (currentScore * 0.05);
      const obstacleSpawnRate = Math.max(45, 95 - Math.floor(currentScore * 0.5));
      const collectibleSpawnRate = Math.max(70, 130 - Math.floor(currentScore * 0.5));
      
      // Spawning
      if (frame % obstacleSpawnRate === 0) {
        obstacles.push({
          x: canvas.width,
          y: canvas.height - 20 - 40,
          width: 40,
          height: 40
        });
      }
      
      if (frame % collectibleSpawnRate === 0) {
        collectibles.push({
          x: canvas.width,
          y: canvas.height - 20 - 120 - Math.random() * 40,
          width: 30,
          height: 30
        });
      }
      
      // Update and draw obstacles (cops)
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        
        // Draw obstacle (Cop hitting)
        ctx.font = '40px Arial';
        ctx.fillText("👮‍♂️", obs.x + obs.width/2, obs.y + obs.height/2 + 5);
        
        ctx.save();
        ctx.translate(obs.x + 5, obs.y + 15);
        ctx.rotate(Math.sin(frame * 0.25) * 0.8 - 0.5);
        ctx.font = '25px Arial';
        ctx.fillText("🏏", -15, -15);
        ctx.restore();
        
        // Collision
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          gameEnded = true;
          setIsPlaying(false);
          setIsGameOver(true);
        }
        
        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
        }
      }
      
      // Update and draw collectibles (clothes)
      for (let i = collectibles.length - 1; i >= 0; i--) {
        const col = collectibles[i];
        col.x -= gameSpeed;
        
        // Draw collectible (Clothes)
        ctx.font = '30px Arial';
        ctx.fillText("👕", col.x + col.width/2, col.y + col.height/2 + 5);
        
        // Collection collision
        if (
          player.x < col.x + col.width &&
          player.x + player.width > col.x &&
          player.y < col.y + col.height &&
          player.y + player.height > col.y
        ) {
          collectibles.splice(i, 1);
          currentScore += 10;
          setScore(currentScore);
          
          if (currentScore >= 100) {
            setDiscountWon(true);
            gameEnded = true;
            setIsPlaying(false);
            
            if (!winCode) {
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let code = 'DINO-';
              for (let c = 0; c < 6; c++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              setWinCode(code);
              
              const expiration = new Date().getTime() + 24 * 60 * 60 * 1000;
              const existing = JSON.parse(localStorage.getItem('dinoCoupons') || '[]');
              existing.push({ code, expires: expiration, discount: 0.10 });
              localStorage.setItem('dinoCoupons', JSON.stringify(existing));
            }
          }
        } else if (col.x + col.width < 0) {
          collectibles.splice(i, 1);
        }
      }
      
      // Score text
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.font = '20px Outfit';
      ctx.fillText(`Score: ${currentScore}/100`, 20, 30);
      
      frame++;
      if (!gameEnded) {
        animationFrameId = requestAnimationFrame(gameLoop);
      }
    };
    
    animationFrameId = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying]);

  return (
    <div className="card" style={{ padding: '32px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-4 text-gradient" style={{ fontSize: '2.5rem' }}>Thrift Runner</h2>
      <p className="mb-8 text-secondary">
        Collect clothes (👕) and jump over the fashion cops (👮‍♂️) to win a 10% discount code! Reach 100 points to win. Use SPACE or UP ARROW to jump.
      </p>
      
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto', overflow: 'hidden' }}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300} 
          style={{ width: '100%', background: '#0d0f12', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'block' }}
        />
        
        {!isPlaying && !discountWon && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(13, 15, 18, 0.85)', borderRadius: '12px' }}>
            <h3 className="mb-4" style={{ fontSize: '1.5rem', color: isGameOver ? '#ff4757' : 'white' }}>
              {isGameOver ? `Busted! Final Score: ${score}` : 'Ready to Run?'}
            </h3>
            <button className="btn-primary" onClick={() => { setScore(0); setIsGameOver(false); setIsPlaying(true); }}>
              {isGameOver ? 'Try Again' : 'Start Game'}
            </button>
          </div>
        )}
        
        {discountWon && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(13, 15, 18, 0.95)', borderRadius: '12px' }}>
            <h3 className="mb-2 text-gradient" style={{ fontSize: '2rem' }}>You Won!</h3>
            <p className="mb-4 text-secondary">Here is your 10% off discount code:</p>
            <div style={{ background: 'var(--bg-color)', padding: '12px 24px', borderRadius: '8px', fontSize: '1.5rem', fontWeight: 'bold', border: '1px dashed var(--accent-color)', letterSpacing: '2px', color: 'white' }}>
              {winCode}
            </div>
            <p className="mt-2 text-secondary" style={{ fontSize: '0.85rem' }}>This code is valid for 24 hours.</p>
          </div>
        )}
      </div>
    </div>
  );
}
