'use client'

import { motion } from 'framer-motion'
import { Code, Palette, Music, Coffee, Heart, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

const FloatingIcons = () => {
  const [isClient, setIsClient] = useState(false)
  const [positions, setPositions] = useState<Array<{left: string, top: string}>>([])
  
  const icons = [
    { Icon: Code, color: '#4ee1ff', size: 20, delay: 0 },
    { Icon: Palette, color: '#ff6b6b', size: 18, delay: 0.5 },
    { Icon: Music, color: '#4ecdc4', size: 22, delay: 1 },
    { Icon: Coffee, color: '#ffe66d', size: 19, delay: 1.5 },
    { Icon: Heart, color: '#ff8a80', size: 21, delay: 2 },
    { Icon: Star, color: '#7b61ff', size: 17, delay: 2.5 },
  ]

  useEffect(() => {
    setIsClient(true)
    const newPositions = Array.from({ length: icons.length + 12 }, () => ({
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
    }))
    setPositions(newPositions)
  }, [])

  if (!isClient) {
    return null
  }

  const getRandomPosition = (index: number) => positions[index] || { left: '50%', top: '50%' }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {icons.map(({ Icon, color, size, delay }, index) => {
        const position = getRandomPosition(index)
        
        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: position.left,
              top: position.top,
            }}
            initial={{ 
              opacity: 0, 
              scale: 0,
              rotate: 0,
            }}
            animate={{ 
              opacity: [0, 0.6, 0.3, 0.8, 0.4],
              scale: [0, 1.2, 0.8, 1.1, 0.9],
              rotate: [0, 10, -5, 15, -10, 0],
              y: [0, -20, 10, -15, 5, 0],
              x: [0, 10, -5, 8, -3, 0],
            }}
            transition={{
              duration: 8,
              delay: delay,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.5,
              rotate: 360,
              transition: { duration: 0.5 }
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Icon 
                size={size} 
                color={color}
                className="drop-shadow-lg filter"
                style={{
                  filter: `drop-shadow(0 0 8px ${color}40)`,
                }}
              />
            </motion.div>
          </motion.div>
        )
      })}
      
      {/* Additional floating particles */}
      {Array.from({ length: 12 }).map((_, index) => {
        const particlePosition = positions[index + icons.length] || { left: '50%', top: '50%' }
        return (
          <motion.div
            key={`particle-${index}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: particlePosition.left,
              top: particlePosition.top,
              background: `linear-gradient(45deg, #4ee1ff, #7b61ff)`,
              boxShadow: '0 0 6px currentColor',
              }}
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: index * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}

export default FloatingIcons