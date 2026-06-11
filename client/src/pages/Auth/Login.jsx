import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Sparkles } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'

const loadingTexts = [
  'Verifying credentials…',
  'Establishing secure link…',
  'Syncing your profile…',
  'Readying AI mentor…'
]

export function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [errors,     setErrors]     = useState({})
  const [apiError,   setApiError]   = useState('')
  const [isLoading,  setIsLoading]  = useState(false)
  const [loadText,   setLoadText]   = useState(loadingTexts[0])

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email address is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    if (!validate()) return
    setIsLoading(true)
    let i = 0
    const interval = setInterval(() => { i = (i + 1) % loadingTexts.length; setLoadText(loadingTexts[i]) }, 600)
    try {
      await login(email, password)
      clearInterval(interval)
      navigate('/dashboard')
    } catch (err) {
      clearInterval(interval)
      setApiError(err.message || 'Invalid credentials. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      {/* Card */}
      <div className="bg-white rounded-2xl p-8 md:p-10" style={{ boxShadow: 'var(--shadow-lg)', border: '1px solid var(--c-border)' }}>

        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex flex-col items-center group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
              style={{ background: 'rgba(139,223,221,0.18)', border: '1.5px solid rgba(139,223,221,0.40)' }}>
              <Sparkles size={22} style={{ color: 'var(--c-teal-dk)' }} />
            </div>
            <h1 className="text-3xl font-900" style={{ fontFamily: 'Outfit, sans-serif', color: 'var(--c-text)' }}>
              Nav<span className="gradient-text">Guide</span>
            </h1>
          </Link>
          <p className="text-sm text-gray-500 mt-1.5 text-center">
            Sign in to connect with your AI academic mentor.
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-500"
            style={{ background: 'rgba(244,143,104,0.10)', border: '1px solid rgba(244,143,104,0.30)', color: 'var(--c-orange-dk)' }}>
            <span className="w-2 h-2 rounded-full animate-ping shrink-0" style={{ background: 'var(--c-orange)' }} />
            {apiError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input id="email" label="Email Address" type="email"
            placeholder="student@navguide.com" icon={Mail}
            value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({...p, email: ''})) }}
            error={errors.email} disabled={isLoading} />

          <Input id="password" label="Password" type="password"
            placeholder="••••••••" icon={Lock}
            value={password} onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({...p, password: ''})) }}
            error={errors.password} disabled={isLoading} />

          <div className="flex justify-end">
            <a href="#" className="text-xs font-600" style={{ color: 'var(--c-teal-dk)' }}>Forgot password?</a>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            {isLoading ? loadText : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-700" style={{ color: 'var(--c-teal-dk)' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
