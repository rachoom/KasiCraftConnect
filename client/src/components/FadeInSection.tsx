import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export default function FadeInSection({
  children,
  delay = 0,
  duration = 0.6,
  className = "",
  direction = "up"
}: FadeInSectionProps) {
  const directionOffset = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...directionOffset[direction]
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        x: 0
      }}
      transition={{ 
        duration,
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}