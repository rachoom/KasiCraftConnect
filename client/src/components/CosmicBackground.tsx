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
      {/* Cosmic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gold/5 to-transparent opacity-30" />
      
      {/* Particle field */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-gold via-yellow-400 to-gold animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `cosmicFloat ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(212, 165, 116, 0.5)`,
          }}
        />
      ))}
      
      {/* Additional cosmic elements */}
      <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-gold rounded-full animate-ping opacity-40" />
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-50" />
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-gold rounded-full animate-bounce opacity-30" />
      <div className="absolute bottom-1/4 left-1/2 w-2.5 h-2.5 bg-gold/60 rounded-full animate-pulse opacity-25" />
    </div>
  );
}