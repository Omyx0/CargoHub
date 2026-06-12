"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cardHover } from "@/lib/animations";

interface StatCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function StatCard({ label, value, prefix = "", suffix = "", change, isPositive, icon, color }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <motion.div 
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="card relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4 relative z-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ background: `${color}15`, color: color }}
        >
          {icon}
        </motion.div>
        
        {/* Mock Sparkline */}
        <div className="w-16 h-8 opacity-40">
          <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
            <motion.path 
              d={isPositive ? "M 0 30 Q 20 25, 40 15 T 80 5 L 100 0" : "M 0 10 Q 20 15, 40 25 T 80 30 L 100 25"} 
              fill="none" 
              stroke={color} 
              strokeWidth="3" 
              strokeLinecap="round"
              className="animate-draw-stroke"
              style={{ strokeDasharray: 150, strokeDashoffset: 150 }}
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        <p className="stat-label mb-1">{label}</p>
        <p className="stat-value mb-2">
          {prefix}{typeof displayValue === 'number' ? displayValue.toLocaleString("en-IN") : displayValue}{suffix}
        </p>
        <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '▲' : '▼'} {change}
        </p>
      </div>

      {/* Decorative background glow on hover */}
      <motion.div 
        className="absolute -inset-1 opacity-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 80% 20%, ${color}10 0%, transparent 70%)` }}
        whileHover={{ opacity: 1 }}
      />
    </motion.div>
  );
}
