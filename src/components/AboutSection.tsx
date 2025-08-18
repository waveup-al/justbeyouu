'use client'

import { motion } from 'framer-motion'
import { Download, Github, Linkedin, Mail, MapPin, Calendar, Guitar, Plane, Beer, Youtube, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AboutSection() {
  const { t } = useLanguage()
  const skills = [
    { name: 'AI Agent Development', level: 95, color: 'neon-cyan' },
    { name: 'Automation & Workflow', level: 90, color: 'neon-purple' },
    { name: 'Data Analytics', level: 85, color: 'warm-amber' },
    { name: 'Full Stack Development', level: 88, color: 'teal-accent' },
    { name: 'Python & JavaScript', level: 92, color: 'neon-cyan' },
    { name: 'Machine Learning', level: 80, color: 'neon-purple' },
  ]

  const interests = [
    { icon: Guitar, label: t('about.interests.guitar.label'), description: t('about.interests.guitar.description') },
    { icon: Plane, label: t('about.interests.travel.label'), description: t('about.interests.travel.description') },
    { icon: Beer, label: t('about.interests.beer.label'), description: t('about.interests.beer.description') },
  ]

  const socialLinks = [
    { icon: Github, label: 'GitHub', url: 'https://github.com/hieudev', color: 'text-white' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/hi%E1%BA%BFu-nguy%E1%BB%85n-c%C3%B4ng-324394361/', color: 'text-blue-400' },
    { icon: Mail, label: 'Email', url: 'mailto:alwaveup@gmail.com', color: 'text-red-400' },
    { icon: MessageCircle, label: 'Facebook', url: 'https://www.facebook.com/hieu.nguyen.784537/?locale=vi_VN', color: 'text-blue-500' },
    { icon: Youtube, label: 'YouTube', url: 'https://www.youtube.com/@mrkent6868', color: 'text-red-500' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 font-mono">
          <span className="text-neon-purple neon-text">About Me</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {t('about.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:col-span-1"
        >
          <div className="glass-dark rounded-2xl p-8 text-center border border-neon-purple/20">
            {/* Avatar with Enhanced Floating Effects */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Floating Energy Particles */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <motion.div
                  className="absolute w-2.5 h-2.5 bg-neon-cyan/50 rounded-full blur-[1px]"
                  animate={{
                    x: [0, 25, -15, 20, 0],
                    y: [0, -20, -35, -15, 0],
                    opacity: [0.5, 0.9, 0.2, 0.8, 0.5],
                    scale: [1, 1.3, 0.7, 1.1, 1]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ top: '15%', left: '8%' }}
                />
                <motion.div
                  className="absolute w-3.5 h-3.5 bg-neon-purple/45 rounded-full blur-[1px]"
                  animate={{
                    x: [0, -20, 25, -8, 0],
                    y: [0, -25, -40, -18, 0],
                    opacity: [0.4, 0.8, 0.1, 0.7, 0.4],
                    scale: [1, 0.8, 1.4, 0.9, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.2
                  }}
                  style={{ top: '65%', right: '12%' }}
                />
                <motion.div
                  className="absolute w-2 h-2 bg-warm-amber/60 rounded-full blur-[1px]"
                  animate={{
                    x: [0, 15, -25, 12, 0],
                    y: [0, -30, -45, -22, 0],
                    opacity: [0.6, 1, 0.1, 0.8, 0.6],
                    scale: [1, 1.5, 0.5, 1.2, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5
                  }}
                  style={{ top: '42%', left: '75%' }}
                />
                <motion.div
                  className="absolute w-1.5 h-1.5 bg-teal-accent/70 rounded-full blur-[1px]"
                  animate={{
                    x: [0, -18, 22, -10, 0],
                    y: [0, -15, -28, -12, 0],
                    opacity: [0.7, 0.9, 0.3, 0.8, 0.7],
                    scale: [1, 1.2, 0.8, 1.4, 1]
                  }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8
                  }}
                  style={{ top: '28%', right: '20%' }}
                />
                <motion.div
                  className="absolute w-2.5 h-2.5 bg-pink-400/40 rounded-full blur-[1px]"
                  animate={{
                    x: [0, 12, -28, 18, 0],
                    y: [0, -22, -38, -16, 0],
                    opacity: [0.4, 0.7, 0.2, 0.9, 0.4],
                    scale: [1, 1.1, 0.6, 1.3, 1]
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3.2
                  }}
                  style={{ top: '8%', left: '45%' }}
                />
              </div>
              
              {/* Avatar Container with Floating Motion */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full p-1"
                animate={{
                  scale: [1, 1.03, 0.97, 1.01, 1],
                  rotate: [0, 2, -2, 1, 0],
                  opacity: [0.8, 1, 0.6, 0.9, 0.8]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center overflow-hidden"
                  animate={{
                    y: [0, -6, 0, -3, 0],
                    x: [0, 2, -2, 1, 0]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.img
                    src="/avatar/ANH2.jpg"
                    alt="Nguyễn Công Hiếu"
                    className="w-full h-full object-cover rounded-full"
                    animate={{
                      scale: [1, 1.02, 0.98, 1.01, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>

            <h3 className="text-2xl font-bold mb-2">Nguyễn Công Hiếu</h3>
            <p className="text-neon-cyan mb-4">AI Agent & Automation Developer</p>
            
            {/* Quick Info */}
            <div className="space-y-3 mb-6 text-sm text-gray-300">
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} className="text-warm-amber" />
                <span>{t('about.location')}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar size={16} className="text-warm-amber" />
                <span>{t('about.experience')}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4 mb-6">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-full glass border border-gray-600 hover:scale-110 transition-all duration-300 ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>

            {/* Download CV */}
            <a
              href="/assets/CV-Nguyen-Cong-Hieu.pdf"
              download
              className="inline-flex items-center gap-2 bg-gradient-to-r from-warm-amber to-orange-500 text-dark-bg px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 neon-glow"
            >
              <Download size={20} />
              {t('about.download.cv')}
            </a>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Bio */}
          <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-semibold mb-4 text-neon-cyan">{t('about.bio.title')}</h4>
            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p dangerouslySetInnerHTML={{ __html: t('about.intro.p1') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.intro.p2') }} />
              <p dangerouslySetInnerHTML={{ __html: t('about.intro.p3') }} />
            </div>
          </div>

          {/* Skills */}
          <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-semibold mb-6 text-neon-purple">{t('about.skills.title')}</h4>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">{skill.name}</span>
                    <span className="text-gray-400 text-sm">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      viewport={{ once: true }}
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        skill.color === 'neon-cyan' ? 'from-neon-cyan to-blue-400' :
                        skill.color === 'neon-purple' ? 'from-neon-purple to-purple-400' :
                        skill.color === 'warm-amber' ? 'from-warm-amber to-orange-400' :
                        'from-teal-accent to-green-400'
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="glass-dark rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-xl font-semibold mb-6 text-warm-amber">{t('about.interests.title')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {interests.map((interest, index) => {
                const Icon = interest.icon
                return (
                  <motion.div
                    key={interest.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-4 glass rounded-lg border border-warm-amber/20 hover:border-warm-amber/50 transition-colors"
                  >
                    <Icon size={32} className="text-warm-amber mx-auto mb-3" />
                    <h5 className="font-semibold text-white mb-2">{interest.label}</h5>
                    <p className="text-sm text-gray-400">{interest.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}