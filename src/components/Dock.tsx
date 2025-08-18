'use client'

import { motion } from 'framer-motion'
import { Home, User, Briefcase, Mail, Coffee } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useIsMobile } from '@/hooks/useIsMobile'

interface DockProps {
  activeSection: string
  onNavigate: (section: string) => void
}



export default function Dock({ activeSection, onNavigate }: DockProps) {
  const { t } = useLanguage()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const isMobile = useIsMobile()
  
  const dockItems = [
    { id: 'hero', label: t('nav.home'), icon: Home, key: '1' },
    { id: 'about', label: t('nav.about'), icon: User, key: '2' },
    { id: 'projects', label: t('nav.projects'), icon: Briefcase, key: '3' },
    { id: 'contact', label: t('nav.contact'), icon: Mail, key: '4' },
  ]

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Handle keyboard shortcuts (Alt + number)
      if (e.altKey) {
        const item = dockItems.find(item => item.key === e.key)
        if (item) {
          e.preventDefault()
          onNavigate(item.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onNavigate])

  return (
    <motion.nav
      initial={isMobile ? { y: 100, opacity: 0 } : { x: -100, opacity: 0 }}
      animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className={`fixed z-50 ${
        isMobile 
          ? 'bottom-4 left-1/2 transform -translate-x-1/2' 
          : 'left-6 top-1/2 transform -translate-y-1/2'
      }`}
      role="navigation"
      aria-label={t('nav.main')}
    >
      <div className={`dock rounded-2xl p-3 ${
        isMobile ? 'flex space-x-2 space-y-0' : 'space-y-2'
      }`}>
        {dockItems.map((item, index) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          const isHovered = hoveredItem === item.id

          return (
            <motion.div
              key={item.id}
              className="relative"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
            >
              <button
                onClick={() => onNavigate(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  relative rounded-xl flex items-center justify-center
                  transition-all duration-300 focus-visible:focus
                  ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg neon-glow'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }
                `}
                aria-label={`${item.label} (Alt+${item.key})`}
                title={`${item.label} (Alt+${item.key})`}
              >
                <Icon size={isMobile ? 16 : 20} />
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute bg-neon-cyan rounded-full ${
                      isMobile 
                        ? '-bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1' 
                        : '-right-1 top-1/2 transform -translate-y-1/2 w-1 h-6'
                    }`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>

              {/* Tooltip - Hidden on mobile */}
              {!isMobile && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? 0 : -10
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-16 top-1/2 transform -translate-y-1/2 pointer-events-none"
                >
                  <div className="glass-dark px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                    {item.label}
                    <span className="text-xs text-gray-400 ml-2">Alt+{item.key}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}

        {/* Misc Section - Hidden on mobile */}
        {!isMobile && (
          <motion.div
            className="pt-2 border-t border-gray-700/50"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <button
              className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-warm-amber hover:bg-warm-amber/10 transition-all duration-300 focus-visible:focus"
              aria-label={t('nav.interests')}
              title={t('nav.interests')}
            >
              <Coffee size={20} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Keyboard shortcuts hint - Hidden on mobile */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        className="mt-4 text-xs text-gray-500 text-center"
      >
          <div className="glass-dark px-2 py-1 rounded text-xs">
            Alt + 1-4
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}