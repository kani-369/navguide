import React, { useState } from 'react'
import { User, GraduationCap, Heart, Target, School, MapPin, DollarSign, Save, Edit3, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/UI/Card'
import Button from '../components/UI/Button'

const AVAILABLE_INTERESTS = [
  { id: 'coding', label: 'Coding & Dev' },
  { id: 'ai', label: 'AI & Data Science' },
  { id: 'business', label: 'Business & Startups' },
  { id: 'design', label: 'UI/UX & Design' },
  { id: 'marketing', label: 'Digital Marketing' },
  { id: 'finance', label: 'Finance & Trading' },
  { id: 'humanities', label: 'Literature & Arts' },
  { id: 'engineering', label: 'Hardware & Biotech' }
]

export function Profile() {
  const { user, logout, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  // Local editable form state — pre-filled with user data
  const [form, setForm] = useState({
    name: user?.name || '',
    academicLevel: user?.academic?.level || 'PUC',
    academicMarks: user?.academic?.marks || '',
    academicStream: user?.academic?.stream || 'Science',
    interests: user?.interests || [],
    careerGoal: user?.careerGoal || '',
    collegeType: user?.preferences?.collegeType || 'Government',
    budget: user?.preferences?.budget || 100000,
    location: user?.preferences?.location || ''
  })

  const toggleInterest = (id) => {
    const isSelected = form.interests.includes(id)
    setForm(prev => ({
      ...prev,
      interests: isSelected ? prev.interests.filter(i => i !== id) : [...prev.interests, id]
    }))
  }

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name,
        academicLevel: form.academicLevel,
        academicMarks: form.academicMarks,
        academicStream: form.academicStream,
        interests: form.interests,
        careerGoal: form.careerGoal,
        collegeType: form.collegeType,
        budget: form.budget,
        location: form.location
      })
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert(error.message || 'Error updating profile. Please try again.')
    }
  }

  const getInterestName = (id) => AVAILABLE_INTERESTS.find(i => i.id === id)?.label || id

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-cream flex items-center space-x-3">
            <User size={26} className="text-mint" />
            <span>Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-sand">Profile</span></span>
          </h1>
          <p className="text-sm text-cream/50 mt-1">Academic summary, interests, and preferences.</p>
        </div>
        <div className="flex items-center space-x-3">
          {saved && (
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold animate-pulse">
              <CheckCircle2 size={14} />
              <span>Saved!</span>
            </div>
          )}
          {editing ? (
            <Button variant="primary" onClick={handleSave} className="space-x-1.5 py-2 px-4 text-xs">
              <Save size={13} />
              <span>Save Changes</span>
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)} className="space-x-1.5 py-2 px-4 text-xs">
              <Edit3 size={13} />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      {/* Name Card */}
      <Card className="glass-card max-w-full">
        <CardHeader className="mb-4">
          <CardTitle className="text-base flex items-center space-x-2">
            <User size={17} className="text-mint" />
            <span>Identity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              className="w-full bg-black/30 border border-cream/10 rounded-xl px-4 py-2.5 text-sm text-cream outline-none focus:border-mint transition-colors" />
          ) : (
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-mint to-sand flex items-center justify-center text-dark-bg font-black text-2xl shadow-[0_0_20px_rgba(139,223,221,0.2)]">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <p className="text-xl font-black text-cream">{user?.name}</p>
                <p className="text-sm text-cream/50">{user?.email}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Academic Info */}
      <Card className="glass-card max-w-full">
        <CardHeader className="mb-4">
          <CardTitle className="text-base flex items-center space-x-2">
            <GraduationCap size={17} className="text-sand" />
            <span>Academic Background</span>
          </CardTitle>
          <CardDescription>Used to calculate college eligibility and exam recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-cream/50 font-bold uppercase tracking-wider block mb-1.5">Current Level</label>
                  <select value={form.academicLevel} onChange={e => setForm(p => ({...p, academicLevel: e.target.value}))}
                    className="w-full bg-black/30 border border-cream/10 rounded-xl px-3 py-2 text-sm text-cream outline-none focus:border-mint">
                    <option value="PUC">PUC / 12th</option>
                    <option value="Diploma">Diploma</option>
                    <option value="School">School (10th)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-cream/50 font-bold uppercase tracking-wider block mb-1.5">Marks (%)</label>
                  <input type="number" min="0" max="100" value={form.academicMarks}
                    onChange={e => setForm(p => ({...p, academicMarks: e.target.value}))}
                    className="w-full bg-black/30 border border-cream/10 rounded-xl px-3 py-2 text-sm text-cream outline-none focus:border-mint" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-cream/50 font-bold uppercase tracking-wider block mb-2">Stream</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Science', 'Commerce', 'Arts'].map(s => (
                    <button key={s} type="button" onClick={() => setForm(p => ({...p, academicStream: s}))}
                      className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        form.academicStream === s ? 'border-mint/30 bg-mint/10 text-mint' : 'border-cream/10 text-cream/50 hover:text-cream'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'Level', value: user?.academic?.level },
                { label: 'Stream', value: user?.academic?.stream },
                { label: 'Marks', value: `${user?.academic?.marks}%` }
              ].map(({ label, value }) => (
                <div key={label} className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-[10px] text-cream/40 font-bold uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-lg font-black text-cream">{value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="glass-card max-w-full">
        <CardHeader className="mb-4">
          <CardTitle className="text-base flex items-center space-x-2">
            <Heart size={17} className="text-coral" />
            <span>Interests & Career Goal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_INTERESTS.map(item => (
                  <button key={item.id} type="button" onClick={() => toggleInterest(item.id)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                      form.interests.includes(item.id)
                        ? 'border-mint/40 bg-mint/15 text-mint'
                        : 'border-cream/10 text-cream/40 hover:text-cream'
                    }`}>{item.label}</button>
                ))}
              </div>
              <input value={form.careerGoal} onChange={e => setForm(p => ({...p, careerGoal: e.target.value}))}
                placeholder="Your career goal (e.g. AI Researcher, Product Manager)"
                className="w-full bg-black/30 border border-cream/10 rounded-xl px-4 py-2.5 text-sm text-cream placeholder-cream/30 outline-none focus:border-mint transition-colors" />
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {(user?.interests || []).map(id => (
                  <span key={id} className="px-3 py-1 rounded-full border border-mint/20 bg-mint/5 text-mint text-xs font-semibold">
                    {getInterestName(id)}
                  </span>
                ))}
              </div>
              {user?.careerGoal && (
                <div className="p-3.5 bg-black/20 border border-white/5 rounded-xl flex items-center space-x-2.5">
                  <Target size={16} className="text-coral" />
                  <span className="text-sm text-cream">{user.careerGoal}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* College Preferences */}
      <Card className="glass-card max-w-full">
        <CardHeader className="mb-4">
          <CardTitle className="text-base flex items-center space-x-2">
            <School size={17} className="text-emerald-400" />
            <span>College Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {editing ? (
            <>
              <div>
                <label className="text-[10px] text-cream/50 font-bold uppercase tracking-wider block mb-2">Preferred Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Government', 'Private'].map(t => (
                    <button key={t} type="button" onClick={() => setForm(p => ({...p, collegeType: t}))}
                      className={`py-3 rounded-xl border text-sm font-semibold transition-all ${
                        form.collegeType === t ? 'border-mint/30 bg-mint/10 text-mint' : 'border-cream/10 text-cream/50 hover:text-cream'
                      }`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-cream/50 font-bold uppercase tracking-wider mb-2">
                  <span>Annual Budget</span>
                  <span className="text-sand">₹{(form.budget/1000).toFixed(0)}k/yr</span>
                </div>
                <input type="range" min="10000" max="300000" step="5000" value={form.budget}
                  onChange={e => setForm(p => ({...p, budget: parseInt(e.target.value)}))}
                  className="w-full cursor-pointer" />
              </div>
              <div>
                <label className="text-[10px] text-cream/50 font-bold uppercase tracking-wider block mb-1.5">Location Preference</label>
                <input value={form.location} onChange={e => setForm(p => ({...p, location: e.target.value}))}
                  placeholder="e.g. Mangalore, Anywhere"
                  className="w-full bg-black/30 border border-cream/10 rounded-xl px-4 py-2.5 text-sm text-cream placeholder-cream/30 outline-none focus:border-mint transition-colors" />
              </div>
            </>
          ) : (
            <div className="space-y-3 text-sm">
              {[
                { icon: School, label: 'College Type', value: user?.preferences?.collegeType },
                { icon: DollarSign, label: 'Annual Budget Cap', value: `₹${(user?.preferences?.budget/1000).toFixed(0)}k` },
                { icon: MapPin, label: 'Preferred Location', value: user?.preferences?.location }
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                  <span className="text-cream/50 flex items-center space-x-2">
                    <Icon size={14} className="text-cream/30" />
                    <span>{label}</span>
                  </span>
                  <span className="font-semibold text-cream">{value}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile
