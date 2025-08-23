'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MusicWidget() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const isMobile = useIsMobile()
  const { t } = useLanguage()

  const currentTrack = {
    title: 'Good News',
    artist: 'Mac Miller',
    src: '/music/Mac Miller - Good News.mp3'
  }

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', () => {
      if (isLooping) {
        audio.currentTime = 0
        audio.play().catch(console.error)
      } else {
        setIsPlaying(false)
      }
    })

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', () => setIsPlaying(false))
    }
  }, [isLooping])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Set initial volume when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className={`fixed z-40 ${
        isMobile 
          ? 'top-2 left-1/2 transform -translate-x-1/2' 
          : 'top-4 left-1/2 transform -translate-x-1/2'
      }`}
    >
      <div className={`music-controls rounded-xl border border-neon-cyan/20 ${
        isMobile ? 'px-2 py-1 max-w-[200px]' : 'px-3 py-2 max-w-xs'
      }`}>
        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
          crossOrigin="anonymous"
          autoPlay={false}
          muted={false}
        />

        <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
          {/* Track Info - Compact */}
          {!isMobile && (
            <div className="text-left min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">
                {currentTrack.title}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {currentTrack.artist}
              </div>
            </div>
          )}

          {/* Controls - Simplified for mobile */}
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-1'}`}>
            <button
              onClick={togglePlay}
              className={`rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg hover:scale-105 transition-all duration-300 focus-visible:focus ${
                isMobile ? 'p-1.5' : 'p-2'
              }`}
              aria-label={isPlaying ? t('music.pause') : t('music.play')}
            >
              {isPlaying ? <Pause size={isMobile ? 12 : 14} /> : <Play size={isMobile ? 12 : 14} />}
            </button>

            {!isMobile && (
              <button
                onClick={toggleLoop}
                className={`p-1.5 rounded-full transition-colors focus-visible:focus ${
                  isLooping 
                    ? 'bg-neon-purple/20 text-neon-purple' 
                    : 'hover:bg-white/10 text-gray-400'
                }`}
                aria-label={isLooping ? t('music.loop.off') : t('music.loop.on')}
                title={isLooping ? t('music.loop.off') : t('music.loop.on')}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                </svg>
              </button>
            )}
          </div>

          {/* Volume Control - Compact */}
          <button
            onClick={toggleMute}
            className={`rounded-full hover:bg-white/10 transition-colors focus-visible:focus ${
              isMobile ? 'p-1' : 'p-1.5'
            }`}
            aria-label={isMuted ? t('music.unmute') : t('music.mute')}
          >
            {isMuted ? <VolumeX size={isMobile ? 10 : 12} /> : <Volume2 size={isMobile ? 10 : 12} />}
          </button>
        </div>
      </div>


    </motion.div>
  )
}