'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Coffee, Music, MapPin, Code, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface EasterEggPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function EasterEggPanel({ isOpen, onClose }: EasterEggPanelProps) {
  const { t } = useLanguage()
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const quotes = [
    t('easter.quotes.coding'),
    t('easter.quotes.debugging'),
    t('easter.quotes.travel'),
    t('easter.quotes.ai'),
    t('easter.quotes.data'),
    t('easter.quotes.music')
  ]

  const funFacts = [
    { icon: <Code className="w-5 h-5" />, text: t('easter.facts.code') },
    { icon: <Coffee className="w-5 h-5" />, text: t('easter.facts.coffee') },
    { icon: <Music className="w-5 h-5" />, text: t('easter.facts.guitar') },
    { icon: <MapPin className="w-5 h-5" />, text: t('easter.facts.travel') },
    { icon: <Heart className="w-5 h-5" />, text: t('easter.facts.beer') }
  ]

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, quotes.length])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="glass-dark border border-warm-amber/30 rounded-2xl p-8 max-w-md w-full mx-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🦊</div>
                  <h2 className="text-xl font-bold text-warm-amber font-mono">
                    {t('easter.title')}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={t('easter.close')}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Rotating Quote */}
              <motion.div
                key={currentQuote}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-6 p-4 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-lg border border-neon-cyan/20"
              >
                <p className="text-center text-sm text-gray-300 italic">
                  {quotes[currentQuote]}
                </p>
              </motion.div>

              {/* Fun Facts */}
              <div className="space-y-3 mb-6">
                <h3 className="text-lg font-semibold text-neon-cyan mb-3">
                  {t('easter.funfacts')}
                </h3>
                {funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="text-warm-amber">
                      {fact.icon}
                    </div>
                    <span className="text-sm text-gray-300">
                      {fact.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Secret Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center p-4 bg-gradient-to-r from-warm-amber/10 to-neon-purple/10 rounded-lg border border-warm-amber/20"
              >
                <p className="text-xs text-gray-400 mb-2">
                  🎉 {t('easter.congratulations')}
                </p>
                <p className="text-sm text-neon-cyan font-mono">
                  {t('easter.console')}
                </p>
              </motion.div>

              {/* Interactive Elements */}
              <div className="mt-6 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-neon-cyan/25 transition-all"
                  onClick={() => {
                    // Play a fun sound effect (if audio context allows)
                    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
                    audio.volume = 0.1
                    audio.play().catch(() => {})
                  }}
                >
                  🎵 {t('easter.play')}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-warm-amber to-orange-500 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-warm-amber/25 transition-all"
                  onClick={() => {
                    navigator.clipboard?.writeText('🦊 Hiếu\'s Portfolio Easter Egg! 🎸🍺')
                  }}
                >
                  📋 {t('easter.copy')}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}