import React, { useState, useMemo } from 'react'
import { GraduationCap, MapPin, Shield, Star, TrendingUp, BookOpen, Filter, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { COLLEGES } from '../utils/constants'
import { scoreAndRankColleges } from '../utils/algorithms'
import { getRecommendedExams, getCollegeEligibility } from '../services/recommendationService'
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../components/UI/Card'

export function Colleges() {
  const { user } = useAuth()

  const [budgetLimit, setBudgetLimit] = useState(user?.preferences?.budget || 200000)
  const [typeFilter, setTypeFilter] = useState('All')
  const [interestFilter, setInterestFilter] = useState('All')
  const [showExams, setShowExams] = useState(true)

  // Course interest filter map
  const INTEREST_FILTERS = [
    { id: 'All', label: 'All Courses' },
    { id: 'cs', label: 'Computer Science' },
    { id: 'ai', label: 'AI / AIML' },
    { id: 'is', label: 'Information Science' },
    { id: 'other', label: 'Others' }
  ]

  const getCourseCategory = (course) => {
    const c = course.toLowerCase()
    if (c.includes('ai') || c.includes('artificial') || c.includes('robotics') || c.includes('aiml') || c.includes('ml')) return 'ai'
    if (c.includes('information')) return 'is'
    if (c.includes('computer') || c.includes('cse')) return 'cs'
    return 'other'
  }

  // Ranked & filtered colleges
  const rankedColleges = useMemo(() => {
    const updatedProfile = { ...user, preferences: { ...user?.preferences, budget: budgetLimit } }
    let results = scoreAndRankColleges(COLLEGES, updatedProfile)
    if (typeFilter !== 'All') results = results.filter(c => c.college_type === typeFilter)
    if (interestFilter !== 'All') results = results.filter(c => getCourseCategory(c.top_course) === interestFilter)
    return results
  }, [user, budgetLimit, typeFilter, interestFilter])

  // Exam recommendations
  const exams = useMemo(() => getRecommendedExams(user), [user])

  const formatCurrency = (val) => `₹${(val / 100000).toFixed(2)}L`

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-cream flex items-center space-x-3">
          <GraduationCap size={28} className="text-sand" />
          <span>Colleges & <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-sand">Exam Guidance</span></span>
        </h1>
        <p className="text-sm text-cream/50 mt-1">
          Personalized recommendations for {user?.academic?.stream} students with {user?.academic?.marks}% marks.
        </p>
      </div>

      {/* Exam Recommendations */}
      <div className="rounded-2xl glass-card border-white/5 overflow-hidden">
        <button
          onClick={() => setShowExams(!showExams)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <BookOpen size={20} className="text-mint" />
            <div>
              <h2 className="text-base font-bold text-cream">Recommended Entrance Exams</h2>
              <p className="text-xs text-cream/40">{exams.length} exams matched your academic profile</p>
            </div>
          </div>
          <ChevronDown size={18} className={`text-cream/40 transition-transform ${showExams ? 'rotate-180' : ''}`} />
        </button>

        {showExams && (
          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-4">
            {exams.length === 0 ? (
              <p className="text-sm text-cream/40 col-span-2 text-center py-6">
                No eligible exams found based on your current marks. Improve your score to unlock more options.
              </p>
            ) : exams.map(exam => (
              <div key={exam.id}
                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-mint/20 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{exam.icon}</span>
                    <div>
                      <h3 className="text-sm font-bold text-cream group-hover:text-mint transition-colors">{exam.name}</h3>
                      <p className="text-[10px] text-cream/40">{exam.fullName}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    exam.readiness === 'Well Prepared' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' :
                    exam.readiness === 'Ready' ? 'text-mint bg-mint/10 border-mint/25' :
                    exam.readiness === 'Borderline Eligible' ? 'text-sand bg-sand/10 border-sand/25' :
                    'text-coral bg-coral/10 border-coral/25'
                  }`}>{exam.readiness}</span>
                </div>
                <p className="text-xs text-cream/50 leading-relaxed mb-2">{exam.description}</p>
                <p className="text-[10px] text-cream/30"><span className="text-cream/50 font-semibold">Covers:</span> {exam.covers}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${
                    exam.difficulty === 'Very High' ? 'text-coral bg-coral/5 border-coral/20' :
                    exam.difficulty === 'High' ? 'text-orange-400 bg-orange-400/5 border-orange-400/20' :
                    'text-mint bg-mint/5 border-mint/20'
                  }`}>{exam.difficulty} Difficulty</span>
                  <div className="w-20 bg-white/5 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-mint to-sand h-full rounded-full"
                      style={{ width: `${exam.matchScore}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* College Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center space-x-2 text-xs text-cream/50">
          <Filter size={13} />
          <span className="font-semibold">Filters:</span>
        </div>
        {['All', 'Government', 'Private'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              typeFilter === t ? 'border-mint/30 text-mint bg-mint/10' : 'border-cream/10 text-cream/40 hover:text-cream'
            }`}>{t}</button>
        ))}
        <span className="text-cream/20">|</span>
        {INTEREST_FILTERS.map(f => (
          <button key={f.id} onClick={() => setInterestFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              interestFilter === f.id ? 'border-sand/30 text-sand bg-sand/10' : 'border-cream/10 text-cream/40 hover:text-cream'
            }`}>{f.label}</button>
        ))}
        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-xs text-cream/40">Budget/yr:</span>
          <input type="range" min="10000" max="300000" step="5000" value={budgetLimit}
            onChange={e => setBudgetLimit(parseInt(e.target.value))}
            className="w-28 cursor-pointer" />
          <span className="text-xs text-sand font-bold">₹{(budgetLimit/1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-cream flex items-center space-x-2">
          <TrendingUp size={18} className="text-mint" />
          <span>Ranked College Matches</span>
          <span className="text-xs text-cream/30 font-normal">({rankedColleges.length} found)</span>
        </h2>
      </div>

      {/* College Cards */}
      {rankedColleges.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <p className="text-cream/40 text-sm mb-3">No colleges matched your current filters.</p>
          <button onClick={() => { setBudgetLimit(300000); setTypeFilter('All'); setInterestFilter('All') }}
            className="text-xs text-mint underline">Reset all filters</button>
        </div>
      ) : (
        <div className="space-y-4">
          {rankedColleges.map((college, idx) => {
            const eligibility = getCollegeEligibility(college, user?.academic?.marks)
            const matchPct = Math.min(100, Math.round((college.score / 170) * 100))

            return (
              <div key={college.id}
                className="p-5 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-mint/25 hover:bg-white/8 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row justify-between gap-5">

                  {/* Left: Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-cream/30">#{idx + 1}</span>

                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        college.college_type === 'Government'
                          ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                          : 'bg-indigo-400/10 text-indigo-400 border-indigo-400/20'
                      }`}>{college.college_type}</span>

                      {college.naac_grade !== 'NA' && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-sand/10 text-sand border border-sand/20 flex items-center space-x-1">
                          <Shield size={9} />
                          <span>NAAC {college.naac_grade}</span>
                        </span>
                      )}

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${eligibility.color}`}>
                        {eligibility.label}
                      </span>

                      <span className="text-xs text-cream/35 flex items-center space-x-1">
                        <MapPin size={11} />
                        <span>{college.location}</span>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-cream group-hover:text-mint transition-colors">
                        {college.college_name}
                      </h3>
                      <p className="text-xs text-cream/50 mt-0.5">
                        Top Program: <span className="text-sand font-semibold">{college.top_course}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {college.matchReasons?.map((r, i) => (
                        <span key={i} className="text-[10px] text-cream/35 bg-black/20 border border-white/5 px-2 py-1 rounded-lg">
                          · {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Stats */}
                  <div className="flex flex-row md:flex-col justify-between items-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right space-y-1">
                      <div className="text-xs text-cream/40">Annual Fees</div>
                      <div className="text-sm font-bold text-cream">{formatCurrency(college.annual_fee)}</div>
                      <div className="text-xs text-cream/40">Top Package</div>
                      <div className="text-sm font-bold text-mint">{formatCurrency(college.highest_package)}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-cream/30 font-semibold uppercase">Match Score</div>
                      <div className="text-2xl font-black text-sand">{matchPct}%</div>
                      <div className="flex items-center justify-end space-x-1">
                        <Star size={11} className="text-sand fill-sand" />
                        <span className="text-xs font-bold text-sand">{college.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Colleges
