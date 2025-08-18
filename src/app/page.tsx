'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hero from '@/components/Hero'
import Dock from '@/components/Dock'
import MusicWidget from '@/components/MusicWidget'
import ProjectsSection from '@/components/ProjectsSection'
import AboutSection from '@/components/AboutSection'
import ContactSection from '@/components/ContactSection'
import FoxMascot from '@/components/FoxMascot'
import EasterEggPanel from '@/components/EasterEggPanel'
import FloatingIcons from '@/components/FloatingIcons'
import FloatingAvatar from '@/components/FloatingAvatar'
import DailyLifeScene from '@/components/DailyLifeScene'
import ShootingStarsAndDinosaurs from '@/components/ShootingStarsAndDinosaurs'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function Home() {
  const [activeSection, setActiveSection] = useState('hero')
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Skip Navigation */}
      <a href="#main-content" className="skip-nav">
        Chuyển đến nội dung chính
      </a>

      {/* Floating Background Icons - Reduced on mobile */}
      {!isMobile && <FloatingIcons />}

      {/* Floating Avatar - Hidden on mobile */}
      {!isMobile && <FloatingAvatar />}

      {/* Daily Life Scene - Hidden on mobile */}
      {!isMobile && <DailyLifeScene />}

      {/* Shooting Stars and Dinosaurs - Hidden on mobile */}
      {!isMobile && <ShootingStarsAndDinosaurs />}

      {/* Music Widget - Simplified on mobile */}
      <MusicWidget />

      {/* Left Dock Navigation - Hidden on mobile */}
      {!isMobile && (
        <Dock 
          activeSection={activeSection} 
          onNavigate={scrollToSection}
        />
      )}

      {/* Main Content */}
      <main id="main-content" className="relative">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4">
          <Hero onNavigate={scrollToSection} />
        </section>

        {/* About Section */}
        <section id="about" className="min-h-screen py-20 px-4">
          <AboutSection />
        </section>

        {/* Projects Section */}
        <section id="projects" className="min-h-screen py-20 px-4">
          <ProjectsSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="min-h-screen py-20 px-4">
          <ContactSection />
        </section>
      </main>

      {/* Fox Mascot */}
      <FoxMascot onClick={() => setShowEasterEgg(true)} />

      {/* Easter Egg Panel */}
      <EasterEggPanel 
        isOpen={showEasterEgg} 
        onClose={() => setShowEasterEgg(false)} 
      />
    </>
  )
}