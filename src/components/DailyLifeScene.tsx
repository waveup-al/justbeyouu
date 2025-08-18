'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Code, Guitar, Coffee, Beer, Monitor, Headphones, Gamepad2 } from 'lucide-react'

const DailyLifeScene = () => {
  const [currentActivity, setCurrentActivity] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [particlePositions, setParticlePositions] = useState<Array<{left: string, top: string}>>([])

  useEffect(() => {
    setIsClient(true)
    const positions = Array.from({ length: 15 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
    setParticlePositions(positions)
  }, [])

  const activities = [
    {
      id: 'coding',
      title: 'Coding Session',
      character: '👨‍💻',
      props: [
        { icon: Monitor, position: { x: 15, y: 8 }, color: '#4ee1ff', size: 32 },
        { icon: Coffee, position: { x: 25, y: 12 }, color: '#f2a900', size: 24 },
        { icon: Code, position: { x: 10, y: 15 }, color: '#4ee1ff', size: 20 },
      ],
      background: 'from-blue-900/10 via-cyan-900/5 to-transparent',
      duration: 10000,
    },
    {
      id: 'guitar',
      title: 'Guitar Time',
      character: '🎸',
      props: [
        { icon: Guitar, position: { x: 20, y: 10 }, color: '#f2a900', size: 36 },
        { icon: Headphones, position: { x: 10, y: 8 }, color: '#7b61ff', size: 28 },
        { icon: Coffee, position: { x: 30, y: 15 }, color: '#1fb6b3', size: 20 },
      ],
      background: 'from-amber-900/10 via-orange-900/5 to-transparent',
      duration: 8000,
    },
    {
      id: 'gaming',
      title: 'Gaming Break',
      character: '🎮',
      props: [
        { icon: Gamepad2, position: { x: 25, y: 8 }, color: '#7b61ff', size: 30 },
        { icon: Beer, position: { x: 15, y: 15 }, color: '#f2a900', size: 26 },
        { icon: Monitor, position: { x: 35, y: 12 }, color: '#4ee1ff', size: 24 },
      ],
      background: 'from-purple-900/10 via-pink-900/5 to-transparent',
      duration: 7000,
    },
    {
      id: 'beer',
      title: 'Beer Time',
      character: '🍺',
      props: [
        { icon: Beer, position: { x: 20, y: 8 }, color: '#f2a900', size: 32 },
        { icon: Coffee, position: { x: 30, y: 12 }, color: '#1fb6b3', size: 24 },
        { icon: Guitar, position: { x: 10, y: 15 }, color: '#f2a900', size: 28 },
      ],
      background: 'from-yellow-900/10 via-amber-900/5 to-transparent',
      duration: 6000,
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length)
    }, activities[currentActivity].duration)

    return () => clearInterval(interval)
  }, [currentActivity, activities])

  const currentScene = activities[currentActivity]

  if (!isClient) {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Dynamic Background Gradient */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${currentScene.background})`,
        }}
        key={currentScene.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, #4ee1ff20, transparent)',
            'radial-gradient(circle at 80% 70%, #7b61ff20, transparent)',
            'radial-gradient(circle at 50% 50%, #f2a90020, transparent)',
            'radial-gradient(circle at 30% 80%, #1fb6b320, transparent)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Character - Moved to Right Side */}
      <motion.div
        className="absolute text-6xl md:text-7xl"
        style={{
          right: '15%',
          top: '35%',
          transform: 'translate(50%, -50%)',
          zIndex: 2,
        }}
        key={currentScene.character}
        initial={{ scale: 0, rotate: -180, opacity: 0, x: 50 }}
        animate={{ 
          scale: [0, 1.1, 1],
          rotate: [0, 10, -5, 0],
          y: [0, -10, 0],
          x: [50, 0, 50],
          opacity: 1,
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {currentScene.character}
      </motion.div>

      {/* Activity Description Text */}
      <motion.div
        className="absolute text-lg md:text-xl font-mono text-white/80"
        style={{
          right: '15%',
          top: '50%',
          transform: 'translate(50%, -50%)',
          zIndex: 2,
        }}
        key={`${currentScene.id}-text`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: [0, 1, 0.8],
          y: [20, 0, 5, 0],
        }}
        transition={{ 
          duration: 2,
          delay: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <div className="text-center bg-black/20 px-4 py-2 rounded-lg backdrop-blur-sm">
          <div className="text-neon-cyan font-bold">{currentScene.title}</div>
          <div className="text-sm text-white/60 mt-1">
            {currentScene.id === 'coding' && 'Building amazing things'}
            {currentScene.id === 'guitar' && 'Making music & vibes'}
            {currentScene.id === 'gaming' && 'Taking a fun break'}
            {currentScene.id === 'beer' && 'Relaxing & enjoying'}
          </div>
        </div>
      </motion.div>

      {/* Activity Props - Scattered Around */}
      <AnimatePresence mode="wait">
        {currentScene.props.map((prop, index) => (
          <motion.div
            key={`${currentScene.id}-${index}`}
            className="absolute"
            style={{
              left: `${prop.position.x}%`,
              top: `${prop.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
            initial={{ scale: 0, rotate: 180, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 360, 0],
              opacity: [0, 1, 0.8],
              y: [0, -8, 0],
              x: [0, 5, -5, 0],
            }}
            exit={{ scale: 0, rotate: -180, opacity: 0 }}
            transition={{ 
              duration: 2,
              delay: index * 0.3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            <prop.icon 
              size={prop.size} 
              color={prop.color}
              style={{
                filter: `drop-shadow(0 0 12px ${prop.color}80)`,
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Floating Particles */}
      {particlePositions.map((position, index) => (
        <motion.div
          key={`particle-${currentScene.id}-${index}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: position.left,
            top: position.top,
            background: `linear-gradient(45deg, #4ee1ff, #7b61ff)`,
            boxShadow: '0 0 8px currentColor',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 10, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 4,
            delay: index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Scene Title - Subtle */}
      <motion.div
        className="absolute top-4 left-4 text-sm font-mono text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm"
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        key={currentScene.title}
      >
        {currentScene.title}
      </motion.div>

      {/* Activity Progress Indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
      >
        {activities.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentActivity ? 'bg-neon-cyan' : 'bg-white/20'
            }`}
            animate={{
              scale: index === currentActivity ? [1, 1.3, 1] : 1,
              opacity: index === currentActivity ? [0.8, 1, 0.8] : 0.4,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default DailyLifeScene