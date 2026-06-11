import React, { useState, useMemo } from 'react'
import { GitCompare, Plus, Trash2, Trophy, ThumbsUp, ThumbsDown, Sparkles, Info } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { scoreDecisions } from '../utils/scoring'
import Button from '../components/UI/Button'

const FACTOR_META = {
  interest: { label: 'Personal Interest', description: 'How passionate are you about this path? (1=low, 10=high)', color: 'text-mint' },
  salary: { label: 'Salary Potential', description: 'Earning potential in the long run (1=low, 10=high)', color: 'text-sand' },
  security: { label: 'Job Security', description: 'How stable is this career market? (1=volatile, 10=stable)', color: 'text-emerald-400' },
  difficulty: { label: 'Skill Difficulty', description: 'How hard is it to acquire the required skills? (1=easy, 10=hard)', color: 'text-coral' }
}

export function Decision() {
  const { decisions, addDecisionOption, deleteDecisionOption } = useApp()

  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newFactors, setNewFactors] = useState({ interest: 5, salary: 5, security: 5, difficulty: 5 })

  const scored = useMemo(() => scoreDecisions(decisions), [decisions])

  const handleAdd = () => {
    if (!newTitle.trim()) return
    addDecisionOption(newTitle.trim(), newFactors)
    setNewTitle('')
    setNewFactors({ interest: 5, salary: 5, security: 5, difficulty: 5 })
    setShowAddForm(false)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-cream flex items-center space-x-3">
            <GitCompare size={28} className="text-coral" />
            <span>Decision <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-sand">Assistant</span></span>
          </h1>
          <p className="text-sm text-cream/50 mt-1">
            Compare career paths objectively. Nav AI scores each option using a multi-factor algorithm.
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowAddForm(!showAddForm)}
          className="space-x-1.5 shrink-0">
          <Plus size={15} />
          <span>Add Option</span>
        </Button>
      </div>

      {/* How it works */}
      <div className="flex items-start space-x-3 p-4 rounded-xl bg-mint/5 border border-mint/15">
        <Info size={16} className="text-mint shrink-0 mt-0.5" />
        <p className="text-xs text-cream/60 leading-relaxed">
          Rate each option from 1–10 across four factors. <span className="text-mint font-semibold">Interest (30%)</span>, <span className="text-sand font-semibold">Salary (25%)</span>, <span className="text-emerald-400 font-semibold">Security (25%)</span>, and <span className="text-coral font-semibold">Difficulty (20%, inverse)</span> are combined into a weighted score. The highest scorer is recommended.
        </p>
      </div>

      {/* Add New Option Form */}
      {showAddForm && (
        <div className="p-6 glass-card rounded-2xl border-mint/20 space-y-5">
          <h3 className="text-base font-bold text-cream">Define New Option</h3>
          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="e.g. AI Engineer, Business Analyst, Product Designer..."
            className="w-full bg-black/30 border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none focus:border-mint transition-colors"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(FACTOR_META).map(([key, meta]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-bold ${meta.color}`}>{meta.label}</label>
                  <span className={`text-sm font-black ${meta.color}`}>{newFactors[key]}</span>
                </div>
                <input
                  type="range" min="1" max="10" step="1"
                  value={newFactors[key]}
                  onChange={e => setNewFactors(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  className="w-full cursor-pointer"
                />
                <p className="text-[10px] text-cream/30">{meta.description}</p>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleAdd} className="flex-1">Add to Comparison</Button>
            <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Ranked Results */}
      {scored.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <GitCompare size={40} className="text-cream/10 mx-auto mb-4" />
          <p className="text-cream/40 text-sm">No options added yet. Click "Add Option" to start comparing.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {scored.map((option, idx) => {
            const isTop = idx === 0
            return (
              <div key={option.id}
                className={`relative p-5 md:p-6 rounded-2xl border transition-all duration-300 ${
                  isTop
                    ? 'border-sand/30 bg-gradient-to-r from-sand/5 via-black/20 to-transparent shadow-[0_0_30px_rgba(255,227,148,0.08)]'
                    : 'border-white/5 bg-white/5 hover:border-white/10'
                }`}>
                {/* Top gradient accent */}
                {isTop && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sand via-coral to-transparent rounded-t-2xl" />}

                <div className="flex flex-col md:flex-row justify-between gap-5">
                  {/* Left: Option details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      {isTop ? (
                        <div className="w-8 h-8 rounded-xl bg-sand/15 border border-sand/30 flex items-center justify-center text-sand">
                          <Trophy size={16} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-cream/30 font-bold text-sm">
                          #{idx + 1}
                        </div>
                      )}
                      <div>
                        <h3 className={`text-lg font-black ${isTop ? 'text-sand' : 'text-cream'}`}>{option.title}</h3>
                        {isTop && (
                          <span className="flex items-center text-[10px] text-sand/70 font-bold space-x-1">
                            <Sparkles size={10} />
                            <span>Nav AI Recommended Option</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Factor bars */}
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(FACTOR_META).map(([key, meta]) => (
                        <div key={key}>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className={`font-semibold ${meta.color}`}>{meta.label}</span>
                            <span className="text-cream/40">{option.factors[key]}/10</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all`}
                              style={{
                                width: `${option.factors[key] * 10}%`,
                                background: key === 'interest' ? 'rgba(139,223,221,0.7)' :
                                  key === 'salary' ? 'rgba(255,227,148,0.7)' :
                                  key === 'security' ? 'rgba(52,211,153,0.7)' :
                                  'rgba(244,143,104,0.7)'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Score + Pros/Cons */}
                  <div className="md:w-64 space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-5">
                    {/* Score */}
                    <div className="text-center">
                      <div className="text-[10px] text-cream/30 font-bold uppercase tracking-widest mb-1">Total Score</div>
                      <div className={`text-4xl font-black ${isTop ? 'text-sand' : 'text-cream'}`}>
                        {option.totalScore}
                        <span className="text-base text-cream/30">/100</span>
                      </div>
                      <div className="mt-2 w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-mint to-sand transition-all"
                          style={{ width: `${option.totalScore}%` }} />
                      </div>
                    </div>

                    {/* Pros */}
                    {option.pros.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-emerald-400 font-black uppercase flex items-center space-x-1">
                          <ThumbsUp size={10} /><span>Pros</span>
                        </p>
                        {option.pros.map((pro, i) => (
                          <p key={i} className="text-[10px] text-cream/50 leading-relaxed">+ {pro}</p>
                        ))}
                      </div>
                    )}

                    {/* Cons */}
                    {option.cons.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[10px] text-coral font-black uppercase flex items-center space-x-1">
                          <ThumbsDown size={10} /><span>Cons</span>
                        </p>
                        {option.cons.map((con, i) => (
                          <p key={i} className="text-[10px] text-cream/50 leading-relaxed">- {con}</p>
                        ))}
                      </div>
                    )}

                    <button onClick={() => deleteDecisionOption(option.id)}
                      className="flex items-center space-x-1.5 text-[10px] text-cream/20 hover:text-coral transition-colors">
                      <Trash2 size={11} />
                      <span>Remove option</span>
                    </button>
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

export default Decision
