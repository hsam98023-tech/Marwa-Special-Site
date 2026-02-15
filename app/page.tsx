'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Send, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// Supabase configuration
const SUPABASE_URL = 'https://wzlkkbitespgurpncamy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6bGtrYml0ZXNwZ3VycG5jYW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjgzODEsImV4cCI6MjA4NjUwNDM4MX0.xSz72jXv7QWckfGrvc5GjpQjXylFupVsGX4mpuqu7Cc'

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; hue: number;
}

export default function MarwaBirthdayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let particles: Particle[] = []
    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      const count = window.innerWidth < 768 ? 40 : 80
      particles = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2,
          opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() * 20 + 40 
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.opacity})`
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    resize(); createParticles(); draw()
    window.addEventListener('resize', () => { resize(); createParticles(); })
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/Marwa%20happy%20birthday`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ sender_name: senderName, Message: message })
      })
      if (res.ok) {
        setSubmitStatus('success')
        setSenderName(''); setMessage('')
      } else { setSubmitStatus('error') }
    } catch { setSubmitStatus('error') }
    setIsSubmitting(false)
    setTimeout(() => setSubmitStatus('idle'), 5000)
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Sparkles className="w-12 h-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-b from-yellow-200 to-yellow-600 bg-clip-text text-transparent">
            Happy Birthday Marwa
          </h1>
          <p className="mt-4 text-gray-400 text-lg">A special day for a special person</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="w-full max-w-md p-8 rounded-2xl border border-yellow-500/20 bg-white/5 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Your Name</label>
              <input value={senderName} onChange={(e) => setSenderName(e.target.value)} required
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Your Wish</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors" />
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSubmitting ? "Sending..." : "Send Wish"} <Send className="w-4 h-4" />
            </button>
          </form>

          <AnimatePresence>
            {submitStatus === 'success' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-green-400 text-center flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 fill-current" /> Sent with love!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  )
}
