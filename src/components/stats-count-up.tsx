'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
}

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = value / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-extrabold tracking-tight">
      {prefix}
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

export function StatsCountUp() {
  const stats: StatItemProps[] = [
    {
      value: 1250,
      suffix: '+',
      label: 'Luxury Properties',
      description: 'Handpicked verified homes & commercial suites',
    },
    {
      value: 3800,
      suffix: '+',
      label: 'Happy Families',
      description: 'Seamlessly relocated across top metro hubs',
    },
    {
      value: 5,
      suffix: '',
      label: 'Prime Metros',
      description: 'Mumbai, Bangalore, Delhi NCR, Hyd, Pune',
    },
    {
      value: 99,
      suffix: '%',
      label: 'Satisfaction Rate',
      description: 'Verified reviews & 5-star concierge ratings',
    },
  ];

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="relative p-6 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/60 shadow-lg shadow-black/5 hover:border-indigo-500/40 transition-all duration-300 group"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mb-2">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 dark:group-hover:text-pink-400 transition-colors">
                {stat.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
