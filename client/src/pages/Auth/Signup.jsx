import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Mail, Lock, GraduationCap, Percent, BookOpen, 
  Target, Briefcase, School, DollarSign, MapPin, 
  ArrowLeft, ArrowRight, Check, Sparkles, MessageSquare
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Card, { CardContent } from '../../components/UI/Card'
import Input from '../../components/UI/Input'
import Button from '../../components/UI/Button'

// Interests list with visual identifiers
const AVAILABLE_INTERESTS = [
  { id: 'coding', label: 'Coding & Dev', color: 'border-mint text-mint bg-mint/5 hover:bg-mint/15' },
  { id: 'ai', label: 'AI & Data Science', color: 'border-sand text-sand bg-sand/5 hover:bg-sand/15' },
  { id: 'business', label: 'Business & Startups', color: 'border-coral text-coral bg-coral/5 hover:bg-coral/15' },
  { id: 'design', label: 'UI/UX & Design', color: 'border-mint text-mint bg-mint/5 hover:bg-mint/15' },
  { id: 'marketing', label: 'Digital Marketing', color: 'border-sand text-sand bg-sand/5 hover:bg-sand/15' },
  { id: 'finance', label: 'Finance & Trading', color: 'border-coral text-coral bg-coral/5 hover:bg-coral/15' },
  { id: 'humanities', label: 'Literature & Arts', color: 'border-mint text-mint bg-mint/5 hover:bg-mint/15' },
  { id: 'engineering', label: 'Hardware & Biotech', color: 'border-sand text-sand bg-sand/5 hover:bg-sand/15' }
]

export function Signup() {
  const { signup, saveSignupProgress, getSignupProgress } = useAuth()
  const navigate = useNavigate()

  // Steps state
  const [step, setStep] = useState(1)
  
  // Master form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    academicLevel: 'PUC',
    academicMarks: '',
    academicStream: 'Science',
    interests: [],
    careerGoal: '',
    preferredCollegeType: 'Government',
    budget: 60000,
    location: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [loadingText, setLoadingText] = useState('Creating account...')
  const [direction, setDirection] = useState(1) // 1 for next, -1 for back

  // Load saved progress if it exists
  useEffect(() => {
    const saved = getSignupProgress()
    if (saved) {
      if (saved.formData) setFormData(saved.formData)
      if (saved.step) setStep(saved.step)
    }
  }, [])

  // Save progress on form data or step changes
  useEffect(() => {
    saveSignupProgress({ formData, step })
  }, [formData, step])

  // AI Mentor dialog text per step
  const getMentorGuidance = () => {
    switch (step) {
      case 1:
        return {
          title: 'Secure Your Identity',
          text: `Welcome! I'm NavGuide, your AI educational advisor. Let's start by securing your account details so we can set up your private dashboard.`,
          hint: 'Your password should be strong — at least 6 characters.'
        }
      case 2:
        return {
          title: 'Understand Your Profile',
          text: `Awesome, ${formData.name || 'friend'}! Next, enter your academic information. Knowing your current grades and streams helps me align recommendation algorithms for college match-making.`,
          hint: 'We accept percentage (%) or CGPA out of 10. Enter numbers only.'
        }
      case 3:
        return {
          title: 'Discover Interests',
          text: `Now, let's explore what excites you. Select your learning interests. I will build personalized skills maps and recommend specific projects based on these topics.`,
          hint: 'You can select multiple topics. Feel free to type in your ultimate dream job below!'
        }
      case 4:
        return {
          title: 'Establish Bounds',
          text: `Lastly, tell me about your college constraints. This allows me to rank government vs. private institutes in your preferred locations, respecting your budget.`,
          hint: 'Setting Location to "Anywhere" will expand options across the region.'
        }
      default:
        return {
          title: 'Ready for Launch',
          text: 'Everything is locked and loaded. Let\'s initialize your personalized study plan.',
          hint: ''
        }
    }
  }

  const guidance = getMentorGuidance()

  // Validations per step
  const validateStep = () => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required.'
      if (!formData.email) {
        newErrors.email = 'Email address is required.'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.'
      }
      if (!formData.password) {
        newErrors.password = 'Password is required.'
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.'
      }
    }

    if (step === 2) {
      if (!formData.academicLevel) newErrors.academicLevel = 'Please select a level.'
      if (!formData.academicMarks) {
        newErrors.academicMarks = 'Please enter your score.'
      } else {
        const marksNum = parseFloat(formData.academicMarks)
        if (isNaN(marksNum) || marksNum <= 0) {
          newErrors.academicMarks = 'Please enter a positive numeric value.'
        } else if (marksNum > 100) {
          newErrors.academicMarks = 'Marks cannot exceed 100% or a 10.0 CGPA.'
        }
      }
      if (!formData.academicStream) newErrors.academicStream = 'Please select a stream.'
    }

    if (step === 3) {
      if (formData.interests.length === 0) {
        newErrors.interests = 'Please select at least one interest area.'
      }
    }

    if (step === 4) {
      if (!formData.location.trim()) {
        newErrors.location = 'Please state your location preference (or type "Anywhere").'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation handlers
  const handleNext = () => {
    if (!validateStep()) return
    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  // Multi-select toggle helper
  const handleToggleInterest = (id) => {
    const isSelected = formData.interests.includes(id)
    let updatedInterests = []
    if (isSelected) {
      updatedInterests = formData.interests.filter((i) => i !== id)
    } else {
      updatedInterests = [...formData.interests, id]
    }
    
    setFormData({ ...formData, interests: updatedInterests })
    if (errors.interests && updatedInterests.length > 0) {
      setErrors({ ...errors, interests: '' })
    }
  }

  // Final submit handler
  const handleCreateAccount = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validateStep()) return

    setIsSubmitting(true)
    
    // Cycle text
    const submits = [
      'Configuring database...',
      'Matching interest vectors...',
      'Assembling study checklist...',
      'Deploying AI guide...'
    ]
    let idx = 0
    const interval = setInterval(() => {
      idx = (idx + 1) % submits.length
      setLoadingText(submits[idx])
    }, 500)

    try {
      await signup(formData)
      clearInterval(interval)
      navigate('/dashboard')
    } catch (err) {
      clearInterval(interval)
      setSubmitError(err.message || 'Signup failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  // Framer Motion Animation Config
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.25, ease: 'easeInOut' }
    })
  }

  return (
    <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[75vh]">
      
      {/* LEFT SIDE: AI Mentor Assistant Interface */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 md:p-8 glass-card rounded-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-mint/5 rounded-full filter blur-2xl pointer-events-none"></div>
        
        {/* Top Header */}
        <Link to="/" className="flex items-center space-x-2.5 relative z-10 cursor-pointer group">
          <div className="w-8 h-8 rounded-lg bg-mint/10 flex items-center justify-center border border-mint/20 text-mint transition-transform group-hover:scale-105">
            <Sparkles size={16} />
          </div>
          <span className="font-extrabold tracking-wide text-lg text-cream">
            Nav<span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-sand">Guide</span> AI
          </span>
        </Link>

        {/* Middle AI Dialog */}
        <div className="my-8 space-y-6 relative z-10 flex-1 flex flex-col justify-center">
          {/* Avatar and Text bubble */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-mint to-sand flex items-center justify-center text-dark-bg font-extrabold shadow-[0_0_15px_rgba(139,223,221,0.2)] shrink-0 animate-bounce">
              NG
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-mint/10 border border-mint/20 text-[10px] text-mint uppercase font-bold tracking-wider">
                <MessageSquare size={10} />
                <span>AI Assistant</span>
              </div>
              <h3 className="text-lg font-bold text-sand text-glow-sand">
                {guidance.title}
              </h3>
              <p className="text-sm text-cream/80 leading-relaxed min-h-[70px]">
                {guidance.text}
              </p>
            </div>
          </div>

          {/* Assistant Tip box */}
          {guidance.hint && (
            <div className="p-4 bg-black/20 border border-white/5 rounded-xl text-xs text-cream/50 leading-relaxed">
              <span className="text-mint font-semibold">Tip: </span>
              {guidance.hint}
            </div>
          )}
        </div>

        {/* Onboarding Steps Indicators */}
        <div className="relative z-10 pt-4 border-t border-white/5 space-y-3">
          <div className="flex justify-between text-xs text-cream/40 font-semibold uppercase tracking-wider">
            <span>Setup Progress</span>
            <span className="text-mint font-bold">Step {step} of 4</span>
          </div>

          {/* Glowing Track progress bar */}
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden relative">
            <div 
              className="bg-gradient-to-r from-mint to-sand h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(139,223,221,0.4)]"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>

          {/* Multi-step checkpoints list (desktop only) */}
          <div className="hidden md:flex justify-between text-[10px] text-cream/35">
            <span className={step >= 1 ? 'text-mint font-bold' : ''}>1. Identity</span>
            <span className={step >= 2 ? 'text-mint font-bold' : ''}>2. Academic</span>
            <span className={step >= 3 ? 'text-mint font-bold' : ''}>3. Interests</span>
            <span className={step >= 4 ? 'text-mint font-bold' : ''}>4. College</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Multi-step Form Card */}
      <div className="lg:col-span-7 flex flex-col justify-center">
        <Card className="glass-card max-w-full w-full h-full min-h-[500px] flex flex-col justify-between p-6 md:p-10 relative">
          
          <CardContent className="flex flex-col justify-center">
            {submitError && (
              <div className="mb-6 p-4 bg-coral/10 border border-coral/35 rounded-xl text-xs text-coral font-medium flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-coral rounded-full inline-block animate-ping"></span>
                <span>{submitError}</span>
              </div>
            )}

            <AnimatePresence mode="wait" custom={direction}>
              {/* STEP 1: BASIC INFO */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl font-bold text-cream">Create your account</h2>
                    <p className="text-xs text-cream/50">Ensure email matches your school/academic profiles.</p>
                  </div>

                  <Input
                    id="name"
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    icon={User}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: '' })
                    }}
                    error={errors.name}
                    disabled={isSubmitting}
                  />

                  <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      if (errors.email) setErrors({ ...errors, email: '' })
                    }}
                    error={errors.email}
                    disabled={isSubmitting}
                  />

                  <Input
                    id="password"
                    label="Choose Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    error={errors.password}
                    disabled={isSubmitting}
                  />
                </motion.div>
              )}

              {/* STEP 2: ACADEMIC INFO */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl font-bold text-cream">Academic Background</h2>
                    <p className="text-xs text-cream/50">This information calculates match scores for universities.</p>
                  </div>

                  {/* Level selection dropdown */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/70 pl-1">
                      Current Level
                    </label>
                    <div className="relative">
                      <select
                        value={formData.academicLevel}
                        onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value })}
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-black/30 border border-cream/10 rounded-xl text-cream text-sm outline-none backdrop-blur-md focus:border-mint transition-all"
                      >
                        <option value="PUC">Pre-University College (PUC / 12th)</option>
                        <option value="Diploma">Diploma Program</option>
                        <option value="School">Secondary School (10th)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 pointer-events-none">
                        <GraduationCap size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Score/Marks */}
                  <Input
                    id="marks"
                    label="Current Marks (CGPA or %)"
                    type="text"
                    placeholder="e.g. 92.5 or 9.2"
                    icon={Percent}
                    value={formData.academicMarks}
                    onChange={(e) => {
                      setFormData({ ...formData, academicMarks: e.target.value })
                      if (errors.academicMarks) setErrors({ ...errors, academicMarks: '' })
                    }}
                    error={errors.academicMarks}
                    disabled={isSubmitting}
                  />

                  {/* Stream Radio options */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/70 pl-1">
                      Academic Stream
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Science', 'Commerce', 'Arts'].map((stream) => (
                        <button
                          key={stream}
                          type="button"
                          onClick={() => setFormData({ ...formData, academicStream: stream })}
                          disabled={isSubmitting}
                          className={`
                            py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer
                            ${formData.academicStream === stream
                              ? 'border-mint bg-mint/15 text-mint shadow-[0_0_10px_rgba(139,223,221,0.1)]'
                              : 'border-cream/10 bg-black/10 text-cream/70 hover:border-cream/25 hover:text-cream'
                            }
                          `}
                        >
                          {stream}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: INTERESTS & GOALS */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl font-bold text-cream">Interests & Aspirations</h2>
                    <p className="text-xs text-cream/50">Pick fields you wish to master. Career goal is optional.</p>
                  </div>

                  {/* Chips Selection */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/70 pl-1">
                      What are you interested in?
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {AVAILABLE_INTERESTS.map((item) => {
                        const selected = formData.interests.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleToggleInterest(item.id)}
                            disabled={isSubmitting}
                            className={`
                              px-3.5 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5
                              ${selected 
                                ? `${item.color} border-current ring-1 ring-current shadow-lg scale-105` 
                                : 'border-cream/10 bg-black/20 text-cream/60 hover:text-cream hover:border-cream/20'
                              }
                            `}
                          >
                            <span>{item.label}</span>
                            {selected && <Check size={12} className="ml-1" />}
                          </button>
                        )
                      })}
                    </div>
                    {errors.interests && (
                      <span className="text-xs text-coral font-medium pl-1 mt-1">{errors.interests}</span>
                    )}
                  </div>

                  {/* Career Goal */}
                  <Input
                    id="careerGoal"
                    label="What is your Dream Career? (Optional)"
                    type="text"
                    placeholder="e.g. AI Researcher, Financial Analyst, Product Designer"
                    icon={Target}
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    disabled={isSubmitting}
                  />
                </motion.div>
              )}

              {/* STEP 4: PREFERENCES */}
              {step === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl font-bold text-cream">College Preferences</h2>
                    <p className="text-xs text-cream/50">Set limits so our recommendations align with your details.</p>
                  </div>

                  {/* Preferred College Type */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-cream/70 pl-1">
                      Preferred College Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Government', 'Private'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, preferredCollegeType: type })}
                          disabled={isSubmitting}
                          className={`
                            py-3 px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center space-x-2
                            ${formData.preferredCollegeType === type
                              ? 'border-mint bg-mint/15 text-mint shadow-[0_0_10px_rgba(139,223,221,0.1)]'
                              : 'border-cream/10 bg-black/10 text-cream/70 hover:border-cream/25 hover:text-cream'
                            }
                          `}
                        >
                          <School size={16} />
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-cream/70 pl-1">
                      <span>Maximum Fees (Annual)</span>
                      <span className="text-sand font-bold text-glow-sand">
                        ₹{(formData.budget / 1000).toFixed(0)}k / year
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <DollarSign size={16} className="text-cream/40" />
                      <input
                        type="range"
                        min="10000"
                        max="300000"
                        step="5000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                        disabled={isSubmitting}
                        className="w-full cursor-pointer focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-cream/30">
                      <span>₹10k</span>
                      <span>₹1.5L</span>
                      <span>₹3L+</span>
                    </div>
                  </div>

                  {/* Location Preference */}
                  <Input
                    id="location"
                    label="Preferred Location"
                    type="text"
                    placeholder="e.g. Bangalore, Delhi, or Anywhere"
                    icon={MapPin}
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value })
                      if (errors.location) setErrors({ ...errors, location: '' })
                    }}
                    error={errors.location}
                    disabled={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          {/* Form Actions Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isSubmitting}
                className="space-x-1.5"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </Button>
            ) : (
              <div className="text-xs text-cream/40">
                Have an account?{' '}
                <Link to="/login" className="text-mint font-bold hover:text-sand transition-colors">
                  Sign in
                </Link>
              </div>
            )}

            {step < 4 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={isSubmitting}
                className="space-x-1.5"
              >
                <span>Next Step</span>
                <ArrowRight size={16} />
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={handleCreateAccount}
                isLoading={isSubmitting}
                className="space-x-1.5"
              >
                <span>Create Account</span>
                <Check size={16} />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Signup
