import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function AnimatedButton({
  children,
  onClick,
  className,
  variant = "default",
  size = "default",
  type = "button",
  disabled = false
}: AnimatedButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button
        onClick={onClick}
        className={className}
        variant={variant}
        size={size}
        type={type}
        disabled={disabled}
      >
        {children}
      </Button>
    </motion.div>
  );
}