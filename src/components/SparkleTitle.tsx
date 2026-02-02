"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export function SparkleTitle() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 8; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 10 + 10,
          delay: Math.random() * 2,
          duration: Math.random() * 1.5 + 1,
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="relative inline-block">
      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 relative z-10">
        8000+ Free N8N <br className="hidden sm:block" />
        <span className="relative inline-block">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
            Workflow Templates
          </span>
          {/* Stars */}
          {stars.map((star) => (
            <motion.span
              key={star.id}
              className="absolute text-accent"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                fontSize: `${star.size}px`,
                zIndex: -1,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✨
            </motion.span>
          ))}
        </span>
      </h1>
    </div>
  );
}
