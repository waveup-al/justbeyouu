'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

type ShootingStar = { id: number; startX: number; startY: number; endX: number; endY: number }
type Dinosaur = { id: number; startX: number; y: number; direction: 'left' | 'right'; variant: 'ptero' | 'stego' | 'raptor' }

const ShootingStarsAndDinosaurs = () => {
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const [dinosaurs, setDinosaurs] = useState<Dinosaur[]>([])
  const [starCounter, setStarCounter] = useState(0)
  const [dinoCounter, setDinoCounter] = useState(0)

  // Create shooting stars with low frequency (every 8-15 seconds)
  useEffect(() => {
    const createShootingStar = () => {
      if (typeof window === 'undefined') return
      
      const id = starCounter
      const startX = -50
      const startY = Math.random() * (window.innerHeight * 0.3) // Only in the upper part of the screen
      const endX = window.innerWidth + 100
      const endY = startY + 100
      
      setShootingStars(prev => [...prev, { id, startX, startY, endX, endY }])
      setStarCounter(prev => prev + 1)
      
      // Remove shooting star after animation completes
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id))
      }, 3000)
    }

    const interval = setInterval(createShootingStar, Math.random() * 7000 + 8000) // 8-15 seconds
    return () => clearInterval(interval)
  }, [starCounter])

  // Create dinosaurs flying by with low frequency (every 12-20 seconds)
  useEffect(() => {
    const createDinosaur = () => {
      if (typeof window === 'undefined') return
      
      const id = dinoCounter
      const direction = 'left'
      const startX = -150
      const y = Math.random() * (window.innerHeight * 0.4) + window.innerHeight * 0.1 // Upper-middle part of the screen
      const variants: Dinosaur['variant'][] = ['ptero', 'stego', 'raptor']
      const variant = variants[Math.floor(Math.random() * variants.length)]
      
      setDinosaurs(prev => [...prev, { id, startX, y, direction, variant }])
      setDinoCounter(prev => prev + 1)
      
      // Remove dinosaur after animation completes
      setTimeout(() => {
        setDinosaurs(prev => prev.filter(dino => dino.id !== id))
      }, 8000)
    }

    const interval = setInterval(createDinosaur, Math.random() * 8000 + 12000) // 12-20 seconds
    return () => clearInterval(interval)
  }, [dinoCounter])

  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* Shooting stars with impressive effects */}
      <AnimatePresence>
        {shootingStars.map((star) => (
          <motion.div
            key={`star-${star.id}`}
            className="absolute"
            initial={{
              x: star.startX,
              y: star.startY,
              opacity: 0,
              scale: 0
            }}
            animate={{
              x: star.endX,
              y: star.endY,
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
          >
            {/* Scattered light particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: -i * 15 - Math.random() * 10,
                  top: Math.random() * 6 - 3,
                  boxShadow: '0 0 4px #ffffff, 0 0 8px #22d3ee'
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Main shooting star tail with rainbow gradient */}
            <motion.svg
              width="120"
              height="8"
              className="absolute"
              style={{
                left: -120,
                top: -4,
                transform: `rotate(${Math.atan2(star.endY - star.startY, star.endX - star.startX)}rad)`
              }}
              animate={{
                opacity: [0, 1, 0.8, 0]
              }}
              transition={{
                duration: 3,
                ease: "easeOut"
              }}
            >
              <defs>
                <linearGradient id={`starGradient-${star.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="20%" stopColor="#ff6b6b" stopOpacity="0.8" />
                  <stop offset="40%" stopColor="#4ecdc4" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#45b7d1" stopOpacity="1" />
                  <stop offset="80%" stopColor="#96ceb4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffeaa7" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <rect 
                width="120" 
                height="8" 
                fill={`url(#starGradient-${star.id})`}
                rx="4"
              />
            </motion.svg>
            
            {/* Star core with explosion effect */}
            <motion.div
              className="relative"
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 3,
                ease: "linear"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" className="absolute -left-2 -top-2">
                <defs>
                  <radialGradient id={`starCore-${star.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="50%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </radialGradient>
                </defs>
                <path
                  d="M8 0 l2.4 5.6 L16 6.4 l-4 4.8 L13.6 16 L8 13.2 L2.4 16 L4 11.2 L0 6.4 l5.6-0.8 Z"
                  fill={`url(#starCore-${star.id})`}
                  style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
                />
              </svg>
            </motion.div>
            
            {/* Glowing ring around */}
            <motion.div
              className="absolute w-8 h-8 border-2 border-cyan-400 rounded-full -left-4 -top-4"
              animate={{
                scale: [0, 2, 0],
                opacity: [1, 0.3, 0],
                rotate: 360
              }}
              transition={{
                duration: 3,
                ease: "easeOut"
              }}
              style={{ borderColor: '#22d3ee' }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Minecraft dinosaurs */}
      <AnimatePresence>
        {dinosaurs.map((dino) => (
          <motion.div
            key={`dino-${dino.id}`}
            className="absolute"
            initial={{
              x: dino.startX,
              y: dino.y,
              opacity: 0,
              scale: 0
            }}
            animate={{
              x: typeof window !== 'undefined' ? window.innerWidth + 150 : 1200,
              y: dino.y + Math.sin(Date.now() * 0.002) * 15, // Chuyển động lên xuống nhẹ
              opacity: [0, 1, 1, 1, 0],
              scale: [0, 1, 1, 1, 0],
              rotate: [0, 5, -5, 0]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 8,
              ease: "linear",
              y: { duration: 4, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            {/* Hạt sáng xanh sau đuôi khủng long */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: -i * 12 - Math.random() * 10,
                  top: Math.sin(i) * 6 - 3,
                  background: '#34d399',
                  boxShadow: '0 0 6px rgba(52,211,153,0.8), 0 0 12px rgba(34,197,94,0.6)'
                }}
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0] }}
                transition={{ duration: 2.5, delay: i * 0.08, ease: 'easeOut' }}
              />
            ))}
            
            {/* Khủng long Minecraft nhiều biến thể */}
            {dino.variant === 'ptero' && (
              <svg 
                width="90" 
                height="70" 
                viewBox="0 0 90 70" 
                className="drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))' }}
              >
                {/* Thân */}
                <rect x="28" y="30" width="34" height="16" fill="#22c55e" />
                {/* Đầu + mỏ */}
                <rect x="18" y="26" width="12" height="10" fill="#16a34a" />
                <rect x="12" y="28" width="7" height="6" fill="#16a34a" />
                <rect x="11" y="30" width="5" height="2" fill="#0f766e" />
                {/* Mắt */}
                <rect x="20" y="29" width="2" height="2" fill="#000" />
                {/* Cánh trái (trên) */}
                <motion.g
                  animate={{ rotateZ: [0, -18, 0], transformOrigin: '40px 24px' }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                >
                  <rect x="34" y="20" width="22" height="8" fill="#15803d" />
                  <rect x="38" y="16" width="16" height="5" fill="#15803d" />
                </motion.g>
                {/* Cánh phải (dưới) */}
                <motion.g
                  animate={{ rotateZ: [0, 12, 0], transformOrigin: '42px 50px' }}
                  transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 0.1 }}
                >
                  <rect x="34" y="48" width="20" height="7" fill="#15803d" />
                </motion.g>
                {/* Đuôi */}
                <rect x="62" y="33" width="16" height="8" fill="#16a34a" />
                <rect x="74" y="35" width="8" height="4" fill="#16a34a" />
                {/* Chân */}
                <rect x="32" y="44" width="4" height="8" fill="#16a34a" />
                <rect x="42" y="44" width="4" height="8" fill="#16a34a" />
              </svg>
            )}

            {dino.variant === 'stego' && (
              <svg 
                width="90" 
                height="70" 
                viewBox="0 0 90 70" 
                className="drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))' }}
              >
                {/* Thân tròn hơn */}
                <rect x="26" y="32" width="38" height="16" fill="#22c55e" />
                {/* Đầu */}
                <rect x="16" y="30" width="12" height="10" fill="#16a34a" />
                {/* Mắt */}
                <rect x="18" y="32" width="2" height="2" fill="#000" />
                {/* Tấm lưng (plates) */}
                <rect x="30" y="26" width="6" height="6" fill="#16a34a" />
                <rect x="38" y="24" width="6" height="8" fill="#16a34a" />
                <rect x="46" y="24" width="6" height="8" fill="#16a34a" />
                <rect x="54" y="26" width="6" height="6" fill="#16a34a" />
                {/* Đuôi */}
                <rect x="64" y="35" width="16" height="6" fill="#16a34a" />
                <rect x="78" y="36" width="6" height="4" fill="#16a34a" />
                {/* Chân */}
                <rect x="30" y="46" width="4" height="8" fill="#16a34a" />
                <rect x="42" y="46" width="4" height="8" fill="#16a34a" />
                <rect x="54" y="46" width="4" height="8" fill="#16a34a" />
              </svg>
            )}

            {dino.variant === 'raptor' && (
              <svg 
                width="90" 
                height="70" 
                viewBox="0 0 90 70" 
                className="drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))' }}
              >
                {/* Thân mảnh */}
                <rect x="28" y="34" width="36" height="12" fill="#22c55e" />
                {/* Đầu nhọn */}
                <rect x="18" y="32" width="12" height="8" fill="#16a34a" />
                <rect x="14" y="34" width="6" height="4" fill="#16a34a" />
                {/* Mắt */}
                <rect x="20" y="34" width="2" height="2" fill="#000" />
                {/* Lông vũ (cánh) */}
                <motion.g
                  animate={{ rotateZ: [0, -12, 0], transformOrigin: '40px 28px' }}
                  transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                >
                  <rect x="36" y="26" width="18" height="6" fill="#15803d" />
                  <rect x="40" y="22" width="12" height="4" fill="#15803d" />
                </motion.g>
                {/* Đuôi dài */}
                <rect x="60" y="36" width="18" height="6" fill="#16a34a" />
                <rect x="76" y="37" width="8" height="4" fill="#16a34a" />
                {/* Chân */}
                <rect x="32" y="46" width="4" height="8" fill="#16a34a" />
                <rect x="44" y="46" width="4" height="8" fill="#16a34a" />
              </svg>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default ShootingStarsAndDinosaurs