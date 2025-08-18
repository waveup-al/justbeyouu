'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FoxMascotProps {
  onClick: () => void
}

export default function FoxMascot({ onClick }: FoxMascotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 2 }}
      className="fixed bottom-8 right-8 z-40 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-full right-0 mb-4 pointer-events-none"
      >
        <div className="glass-dark px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-warm-amber/30">
          <span className="text-warm-amber">🎸 {t('fox.tooltip')}</span>
        </div>
      </motion.div>

      {/* Fox with Guitar and Beer */}
      <motion.div
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Breathing Animation Container */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-24 h-24"
        >
          {/* Fox SVG */}
          <svg
            width="96"
            height="96"
            viewBox="0 0 96 96"
            className="drop-shadow-lg"
          >
            {/* Fox Body */}
            <ellipse cx="48" cy="60" rx="20" ry="15" fill="#FF6B35" />
            
            {/* Fox Head */}
            <circle cx="48" cy="35" r="18" fill="#FF6B35" />
            
            {/* Fox Ears */}
            <path d="M35 25 L40 15 L45 25 Z" fill="#FF6B35" />
            <path d="M51 25 L56 15 L61 25 Z" fill="#FF6B35" />
            <path d="M37 23 L40 18 L43 23 Z" fill="#FFE5B4" />
            <path d="M53 23 L56 18 L59 23 Z" fill="#FFE5B4" />
            
            {/* Fox Face */}
            <ellipse cx="48" cy="40" rx="12" ry="10" fill="#FFE5B4" />
            
            {/* Eyes */}
            <circle cx="43" cy="35" r="2" fill="#000" />
            <circle cx="53" cy="35" r="2" fill="#000" />
            <circle cx="43.5" cy="34.5" r="0.5" fill="#FFF" />
            <circle cx="53.5" cy="34.5" r="0.5" fill="#FFF" />
            
            {/* Nose */}
            <path d="M48 38 L46 40 L50 40 Z" fill="#000" />
            
            {/* Mouth */}
            <path d="M48 41 Q45 43 42 41" stroke="#000" strokeWidth="1" fill="none" />
            <path d="M48 41 Q51 43 54 41" stroke="#000" strokeWidth="1" fill="none" />
            
            {/* Fox Tail */}
            <ellipse cx="25" cy="55" rx="8" ry="20" fill="#FF6B35" transform="rotate(-30 25 55)" />
            <ellipse cx="23" cy="50" rx="4" ry="12" fill="#FFE5B4" transform="rotate(-30 23 50)" />
          </svg>

          {/* Guitar */}
          <motion.div
            animate={{
              rotate: [0, -2, 2, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.1, 0.2, 0.3, 1]
            }}
            className="absolute -right-2 top-8"
          >
            <svg width="20" height="32" viewBox="0 0 20 32">
              {/* Guitar Body */}
              <ellipse cx="10" cy="20" rx="8" ry="10" fill="#8B4513" stroke="#654321" strokeWidth="1" />
              <ellipse cx="10" cy="20" rx="6" ry="8" fill="#DEB887" />
              
              {/* Sound Hole */}
              <circle cx="10" cy="20" r="3" fill="#000" />
              
              {/* Guitar Neck */}
              <rect x="8" y="2" width="4" height="18" fill="#8B4513" />
              
              {/* Strings */}
              <line x1="9" y1="2" x2="9" y2="30" stroke="#C0C0C0" strokeWidth="0.5" />
              <line x1="10" y1="2" x2="10" y2="30" stroke="#C0C0C0" strokeWidth="0.5" />
              <line x1="11" y1="2" x2="11" y2="30" stroke="#C0C0C0" strokeWidth="0.5" />
              
              {/* Tuning Pegs */}
              <circle cx="7" cy="3" r="1" fill="#FFD700" />
              <circle cx="13" cy="3" r="1" fill="#FFD700" />
            </svg>
          </motion.div>

          {/* Beer Mug */}
          <motion.div
            animate={{
              y: [0, -1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -left-3 top-12"
          >
            <svg width="16" height="20" viewBox="0 0 16 20">
              {/* Beer Mug */}
              <rect x="2" y="4" width="10" height="14" rx="1" fill="#FFD700" stroke="#DAA520" strokeWidth="1" />
              
              {/* Beer Foam */}
              <ellipse cx="7" cy="4" rx="5" ry="2" fill="#FFFACD" />
              <circle cx="5" cy="3" r="1" fill="#FFFACD" />
              <circle cx="9" cy="2.5" r="0.8" fill="#FFFACD" />
              <circle cx="7" cy="2" r="0.6" fill="#FFFACD" />
              
              {/* Handle */}
              <path d="M12 8 Q15 8 15 12 Q15 16 12 16" stroke="#DAA520" strokeWidth="1.5" fill="none" />
              
              {/* Beer Level */}
              <rect x="3" y="6" width="8" height="10" fill="#FFA500" opacity="0.8" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Floating Musical Notes */}
        <motion.div
          animate={{
            y: [-20, -40, -20],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute -top-8 left-8 text-neon-cyan text-lg"
        >
          ♪
        </motion.div>
        
        <motion.div
          animate={{
            y: [-15, -35, -15],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
          className="absolute -top-6 right-4 text-warm-amber text-sm"
        >
          ♫
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-warm-amber to-neon-cyan rounded-full blur-xl -z-10"
        />
      </motion.div>
    </motion.div>
  )
}