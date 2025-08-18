'use client'

import { motion } from 'framer-motion'
import { Download, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeroProps {
  onNavigate: (section: string) => void
}

export default function Hero({ onNavigate }: HeroProps) {
  const { t, language } = useLanguage()
  
  // Typewriter effect for the name
  const fullName = language === 'vi' ? 'Nguyễn Công Hiếu' : 'Nguyen Cong Hieu'
  const [typedName, setTypedName] = useState('')

  useEffect(() => {
    let i = 0
    const speed = 70 // ms per character
    const timer = setInterval(() => {
      setTypedName(fullName.slice(0, i + 1))
      i += 1
      if (i >= fullName.length) {
        clearInterval(timer)
      }
    }, speed)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Terminal Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(2px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-dark rounded-lg p-8 mb-8 border border-neon-cyan/20"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-sm text-gray-400 font-mono">terminal</div>
        </div>

        {/* Avatar with Floating Effects */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-4 h-4 bg-neon-cyan/40 rounded-full blur-sm"
            animate={{
              x: [0, 30, -20, 25, 0],
              y: [0, -25, -40, -15, 0],
              opacity: [0.4, 0.8, 0.3, 0.9, 0.4],
              scale: [1, 1.2, 0.8, 1.1, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '10%', left: '15%' }}
          />
          <motion.div
            className="absolute w-3 h-3 bg-neon-purple/50 rounded-full blur-sm"
            animate={{
              x: [0, -25, 30, -10, 0],
              y: [0, -30, -45, -20, 0],
              opacity: [0.5, 0.7, 0.2, 0.8, 0.5],
              scale: [1, 0.8, 1.3, 0.9, 1]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
            style={{ top: '70%', right: '10%' }}
          />
          <motion.div
            className="absolute w-2 h-2 bg-warm-amber/60 rounded-full blur-sm"
            animate={{
              x: [0, 20, -30, 15, 0],
              y: [0, -35, -50, -25, 0],
              opacity: [0.6, 0.9, 0.1, 0.7, 0.6],
              scale: [1, 1.4, 0.6, 1.2, 1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
            style={{ top: '45%', left: '80%' }}
          />
          <motion.div
            className="absolute w-3.5 h-3.5 bg-teal-accent/35 rounded-full blur-sm"
            animate={{
              x: [0, -20, 25, -15, 0],
              y: [0, -20, -35, -10, 0],
              opacity: [0.3, 0.6, 0.4, 0.8, 0.3],
              scale: [1, 1.1, 0.7, 1.3, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
            style={{ top: '25%', right: '25%' }}
          />
          
          {/* Main Avatar Container with Floating Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full blur-lg opacity-50"
            animate={{
              scale: [1, 1.05, 0.95, 1.02, 1],
              opacity: [0.5, 0.7, 0.3, 0.6, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-2 border-gray-600 flex items-center justify-center overflow-hidden"
            animate={{
              y: [0, -8, 0, -5, 0],
              rotate: [0, 1, -1, 0.5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.img 
              src="/avatar/ANH2.jpg" 
              alt="Nguyen Cong Hieu" 
              className="w-full h-full object-cover rounded-full"
              animate={{
                scale: [1, 1.02, 0.98, 1.01, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        {/* Terminal Content */}
        <motion.div className="text-left font-mono text-sm space-y-2">
          <motion.div
            className="text-gray-400"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            $ whoami
          </motion.div>

          <motion.div
            className="text-neon-cyan"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {t('hero.greeting')}{' '}
            <span className="text-white font-bold text-2xl whitespace-pre" aria-live="polite">
              {typedName}
            </span>
            <span className="terminal-cursor ml-1">|</span>
          </motion.div>

          <motion.div
            className="text-gray-400 mt-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            $ cat about.txt
          </motion.div>

          <motion.div
            className="text-warm-amber"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            dangerouslySetInnerHTML={{ __html: t('hero.subtitle') }}
          />

          <motion.div
            className="text-gray-400 mt-4"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            $ ls skills/
          </motion.div>

          <motion.div
            className="text-teal-accent"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            next.js  react  typescript  python  ai-agents  automation
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl text-gray-300 mb-8 font-light"
      >
        <span dangerouslySetInnerHTML={{ __html: t('hero.description') }} />
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <button
          onClick={() => onNavigate('projects')}
          className="group flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple px-8 py-3 rounded-lg font-semibold text-dark-bg hover:scale-105 transition-all duration-300 neon-glow"
        >
          <Eye size={20} />
          {t('hero.cta.projects')}
          <motion.div
            className="ml-1"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.div>
        </button>


      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-16"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full mx-auto flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
          />
        </motion.div>
        <p className="text-gray-400 text-sm mt-2">
          {t('hero.scroll')}
        </p>
      </motion.div>
    </div>
  )
}