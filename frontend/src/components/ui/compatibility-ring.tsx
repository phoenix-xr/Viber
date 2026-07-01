"use client";

import { motion } from "framer-motion";

interface CompatibilityRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CompatibilityRing({
  score,
  size = 60,
  strokeWidth = 6,
  className = "",
}: CompatibilityRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/5"
        />
        {/* Score circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="url(#compatibility-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="compatibility-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9F75FF" />
            <stop offset="100%" stopColor="#547AFF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-headline font-bold text-xs" style={{ color: "white" }}>
        {score}%
      </span>
    </div>
  );
}
