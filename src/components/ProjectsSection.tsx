'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Eye, X } from 'lucide-react'
import axios from 'axios'
import { useLanguage } from '@/contexts/LanguageContext'

interface Project {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  badges: string[]
  status: 'completed' | 'in-progress' | 'planned'
  demoUrl: string | null
  repoUrl: string
  screenshots: string[]
  technologies: string[]
}

interface DemoModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

function DemoModal({ project, isOpen, onClose }: DemoModalProps) {
  const { t } = useLanguage()
  const [demoData, setDemoData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && project?.demoUrl) {
      setLoading(true)
      // Simulate API call for demo
      const fetchDemo = async () => {
        try {
          let response
          if (project.demoUrl?.includes('gmaps-search')) {
            response = await axios.get('/api/demo/gmaps-search?q=restaurant')
          } else if (project.demoUrl?.includes('trade-report')) {
            response = await axios.get('/api/demo/trade-report?symbol=AAPL')
          } else {
            response = { data: { mock: true, message: 'Demo not available' } }
          }
          setDemoData(response.data)
        } catch (error) {
          setDemoData({ error: 'Failed to load demo', mock: true })
        } finally {
          setLoading(false)
        }
      }
      fetchDemo()
    }
  }, [isOpen, project])

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass-dark rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-300">{project.longDescription}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label={t('projects.close')}
          >
            <X size={24} />
          </button>
        </div>

        {/* Demo Content */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-neon-cyan">Demo Interactive</h4>
          <div className="glass rounded-lg p-4 min-h-[200px]">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="loading-dots text-neon-cyan">{t('projects.loading.demo')}</div>
              </div>
            ) : demoData ? (
              <div className="space-y-4">

                <pre className="text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(demoData, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                Demo không khả dụng cho project này
              </div>
            )}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3 text-neon-purple">{t('projects.technologies')}</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 glass border border-gray-600 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Github size={16} />
            Xem Code
          </a>
          {project.demoUrl && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg rounded-lg hover:scale-105 transition-all duration-300">
              <ExternalLink size={16} />
              Live Demo
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  const { t } = useLanguage()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects')
        setProjects(response.data.projects)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const openDemo = (project: Project) => {
    setSelectedProject(project)
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20'
      case 'in-progress': return 'text-warm-amber bg-warm-amber/20'
      case 'planned': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('projects.status.completed')
      case 'in-progress': return t('projects.status.in-progress')
      case 'planned': return t('projects.status.planned')
      default: return t('projects.status.unknown')
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 font-mono">
          <span className="text-neon-cyan neon-text">{t('projects.title')}</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          {t('projects.subtitle')}
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading-dots text-neon-cyan text-xl">{t('projects.loading')}</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-dark rounded-xl p-6 border border-gray-700/50 card-hover"
            >
              {/* Status Badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>

              {/* Project Info */}
              <h3 className="text-xl font-bold mb-3 text-white">{project.title}</h3>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.badges.slice(0, 3).map((badge) => (
                  <span
                    key={badge}
                    className="px-2 py-1 bg-teal-accent/20 text-teal-accent rounded text-xs"
                  >
                    {badge}
                  </span>
                ))}
                {project.badges.length > 3 && (
                  <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded text-xs">
                    +{project.badges.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {project.demoUrl && (
                  <button
                    onClick={() => openDemo(project)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg rounded-lg hover:scale-105 transition-all duration-300 text-sm font-medium"
                  >
                    <Eye size={16} />
                    {t('projects.demo')}
                  </button>
                )}
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 glass border border-gray-600 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                  <Github size={16} />
                  {t('projects.code')}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Demo Modal */}
      <DemoModal
        project={selectedProject}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}