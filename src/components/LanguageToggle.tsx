'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { Globe } from 'lucide-react'

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi')
  }

  return (
    <motion.button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 glass-dark rounded-full p-3 border border-gray-700/50 hover:border-neon-cyan/50 transition-all duration-300 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan transition-colors" />
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
          {language === 'vi' ? 'EN' : 'VI'}
        </span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
      </div>
    </motion.button>
  )
}