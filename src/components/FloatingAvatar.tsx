'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FloatingAvatarProps {
  src?: string
  alt?: string
  size?: number
  className?: string
}

const FloatingAvatar = ({ 
  src = '/avatar.jpg', 
  alt = 'Avatar', 
  size = 80,
  className = '' 
}: FloatingAvatarProps) => {
  const { t } = useLanguage()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [constraints, setConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const [centerX, setCenterX] = useState(20)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    // Compute drag constraints and center position only on the client
    const updateConstraintsAndCenter = () => {
      if (typeof window !== 'undefined') {
        setConstraints({
          left: 0,
          right: Math.max(0, window.innerWidth - size),
          top: 0,
          bottom: Math.max(0, window.innerHeight - size),
        })
        setCenterX((window.innerWidth / 2) - (size / 2))
      }
    }

    updateConstraintsAndCenter()
    window.addEventListener('resize', updateConstraintsAndCenter)
    return () => window.removeEventListener('resize', updateConstraintsAndCenter)
  }, [size])

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <motion.div
      className={`fixed pointer-events-auto z-20 ${className}`}
      style={{
        width: size,
        height: size,
      }}
      initial={{ 
        x: centerX,
        y: 20,
        scale: 0,
        rotate: 0,
      }}
      animate={{ 
        scale: 1,
        rotate: isHovered ? 360 : 0,
        y: [20, 40, 20],
      }}
      transition={{
        scale: { duration: 0.5, delay: 1 },
        rotate: { duration: 0.8 },
        y: { 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.2,
        rotate: 15,
        transition: { duration: 0.3 }
      }}
      whileTap={{
        scale: 0.9,
        rotate: -15,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      drag
      dragConstraints={constraints}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(45deg, #4ee1ff, #7b61ff, #f2a900)',
          filter: 'blur(8px)',
          opacity: 0.6,
        }}
        animate={{
          scale: isHovered ? 1.3 : 1.1,
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 0.3 },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
        }}
      />
      
      {/* Avatar container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 shadow-2xl"
        style={{
          background: 'linear-gradient(45deg, #4ee1ff20, #7b61ff20)',
        }}
        animate={{
          borderColor: isHovered 
            ? ['#4ee1ff', '#7b61ff', '#f2a900', '#4ee1ff']
            : '#ffffff33',
        }}
        transition={{
          borderColor: { duration: 2, repeat: Infinity },
        }}
      >
        {/* Placeholder avatar if no image */}
        <div className="w-full h-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-2xl font-bold">
          🦊
        </div>
        
        {/* Overlay effects */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10"
          animate={{
            opacity: isHovered ? 0.8 : 0.3,
          }}
        />
        
        {/* Sparkle effects */}
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${20 + (index * 10)}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
      
      {/* Floating text on hover */}
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.2 }}
      >
        {t('avatar.drag')}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
      </motion.div>
    </motion.div>
  )
}

export default FloatingAvatar