import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function CosmicBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = 50;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          duration: Math.random() * 20 + 10,
          delay: Math.random() * 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Royal cosmic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-600/10 to-transparent opacity-50" />
      
      {/* Royal gold particle field */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity * 1.2,
            animation: `cosmicFloat ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(218, 165, 32, 0.6)`,
          }}
        />
      ))}
      
      {/* Additional royal cosmic elements */}
      <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-amber-600 rounded-full animate-ping opacity-60" />
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-yellow-600 rounded-full animate-pulse opacity-70" />
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-amber-700 rounded-full animate-bounce opacity-50" />
      <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-amber-600/70 rounded-full animate-pulse opacity-45" />
      <div className="absolute top-1/6 right-1/3 w-1.2 h-1.2 bg-yellow-500 rounded-full animate-ping opacity-55" />
      <div className="absolute bottom-1/3 right-1/6 w-1.8 h-1.8 bg-amber-500 rounded-full animate-pulse opacity-40" />
    </div>
  );
}