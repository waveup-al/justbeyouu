'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Phone, MapPin, Github, Linkedin, MessageCircle, Youtube } from 'lucide-react'
import axios from 'axios'
import { useLanguage } from '@/contexts/LanguageContext'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactSection() {
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'alwaveup@gmail.com',
      href: 'mailto:alwaveup@gmail.com',
      color: 'text-neon-cyan'
    },
    {
      icon: Phone,
      label: t('contact.info.phone.label'),
      value: '0888846467',
      href: 'tel:0888846467',
      color: 'text-neon-purple'
    },
    {
      icon: MapPin,
      label: t('contact.info.address.label'),
      value: t('contact.info.address'),
      href: null,
      color: 'text-warm-amber'
    }
  ]

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/hieudev',
      color: 'hover:text-white'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hi%E1%BA%BFu-nguy%E1%BB%85n-c%C3%B4ng-324394361/',
      color: 'hover:text-blue-400'
    },
    {
      icon: MessageCircle,
      label: 'Facebook',
      url: 'https://www.facebook.com/hieu.nguyen.784537/?locale=vi_VN',
      color: 'hover:text-blue-500'
    },
    {
      icon: Youtube,
      label: 'YouTube',
      url: 'https://www.youtube.com/@mrkent6868',
      color: 'hover:text-red-500'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await axios.post('/api/contact', formData)
      
      if (response.data.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
        
        if (response.data.mock) {
          // Show mock success message
          setTimeout(() => setSubmitStatus('idle'), 3000)
        }
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
          <span className="text-warm-amber neon-text">{t('contact.title')}</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {t('contact.subtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="glass-dark rounded-xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-6 text-white">{t('contact.info.title')}</h3>
            
            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                const content = (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 glass rounded-lg border border-gray-600/50 hover:border-gray-500 transition-colors"
                  >
                    <div className={`p-3 rounded-full glass ${info.color}`}>
                      <Icon size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{info.label}</div>
                      <div className="text-white font-medium">{info.value}</div>
                    </div>
                  </motion.div>
                )

                return info.href ? (
                  <a key={info.label} href={info.href} className="block">
                    {content}
                  </a>
                ) : (
                  <div key={info.label}>{content}</div>
                )
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-dark rounded-xl p-8 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-6 text-white">{t('contact.social.title')}</h3>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`p-4 glass rounded-lg border border-gray-600 text-gray-400 ${social.color} hover:scale-110 transition-all duration-300`}
                    aria-label={social.label}
                  >
                    <Icon size={24} />
                  </motion.a>
                )
              })}
            </div>
            
            <div className="mt-6 p-4 bg-teal-accent/10 border border-teal-accent/30 rounded-lg">
              <p className="text-teal-accent text-sm">
                {t('contact.tip')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="glass-dark rounded-xl p-8 border border-gray-700/50">
            <h3 className="text-2xl font-bold mb-6 text-white">{t('contact.form.send')}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder={t('contact.form.name')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder={t('contact.form.email')}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.subject')} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none transition-colors text-white placeholder-gray-400"
                  placeholder={t('contact.form.subject')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 glass border border-gray-600 rounded-lg focus:border-neon-cyan focus:outline-none transition-colors text-white placeholder-gray-400 resize-none"
                  placeholder={t('contact.form.message')}
                />
              </div>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400">
                  ✅ {t('contact.form.success')}
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400">
                  ❌ {t('contact.form.error')}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <div className="loading-dots">{t('contact.form.sending')}</div>
                ) : (
                  <>
                    <Send size={20} />
                    {t('contact.form.send')}
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 p-4 bg-warm-amber/10 border border-warm-amber/30 rounded-lg">
              <p className="text-warm-amber text-sm">
                🔧 <strong>{t('contact.form.demo.title')}:</strong> {t('contact.form.demo.description')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}