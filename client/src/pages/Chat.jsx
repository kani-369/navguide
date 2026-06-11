import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2, MessageSquare } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { generateAIResponse } from '../services/aiService'

const CHAT_HISTORY_KEY = 'navguide_chat_history'

const QUICK_PROMPTS = [
  'Which colleges match my profile?',
  'What exams should I prepare for?',
  'How are my marks rated?',
  'Help me choose a career path',
  'What are my pending tasks?',
  'Give me a study tip'
]

export function Chat() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const initMessages = () => {
    try {
      const stored = localStorage.getItem(CHAT_HISTORY_KEY)
      if (stored) return JSON.parse(stored)
    } catch { /* ignore */ }
    return [{
      id: 'init',
      sender: 'nav',
      text: `Hello ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm **Nav**, your personal AI academic mentor.\n\nI know your profile — ${user?.academic?.marks}% in ${user?.academic?.stream}, interested in ${(user?.interests || []).slice(0, 2).join(' & ')}, and aiming for "${user?.careerGoal || 'your goals'}".\n\nAsk me anything — college advice, exam preparation, career decisions, or just a motivational boost! 🎓`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]
  }

  const [messages, setMessages] = useState(initMessages)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages))
    } catch { /* ignore */ }
  }, [messages])

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim()
    if (!trimmed || isTyping) return

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    try {
      const aiText = await generateAIResponse(trimmed, user)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'nav',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'nav',
        text: "Oops — something went wrong on my end. Please try again!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const clearHistory = () => {
    localStorage.removeItem(CHAT_HISTORY_KEY)
    setMessages(initMessages())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Render markdown-style bold text
  const renderText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="text-mint font-bold">{part}</strong> : part
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-cream flex items-center space-x-3">
            <MessageSquare size={26} className="text-mint" />
            <span>Chat with <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint to-sand">Nav AI</span></span>
          </h1>
          <p className="text-sm text-cream/50 mt-1">Your personal academic advisor, powered by AI.</p>
        </div>
        <button onClick={clearHistory}
          className="flex items-center space-x-1.5 text-xs text-cream/30 hover:text-coral transition-colors border border-transparent hover:border-coral/20 px-3 py-2 rounded-xl">
          <Trash2 size={13} />
          <span>Clear history</span>
        </button>
      </div>

      {/* Chat window */}
      <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden border-white/5">
        {/* Nav info bar */}
        <div className="flex items-center space-x-3 px-5 py-4 border-b border-white/5 bg-gradient-to-r from-mint/5 to-transparent shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint to-sand flex items-center justify-center text-dark-bg font-extrabold shadow-[0_0_15px_rgba(139,223,221,0.25)]">
            NG
          </div>
          <div>
            <p className="text-sm font-bold text-cream">Nav — AI Academic Mentor</p>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
              <span>Always here to help you navigate your future</span>
            </p>
          </div>
          <div className="ml-auto flex items-center space-x-1.5 text-[10px] text-cream/30">
            <Sparkles size={11} className="text-mint animate-pulse" />
            <span className="font-semibold">{messages.length - 1} messages</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-3`}>
              {msg.sender === 'nav' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mint to-sand flex items-center justify-center text-dark-bg font-extrabold text-xs shrink-0 shadow-[0_0_10px_rgba(139,223,221,0.2)]">
                  NG
                </div>
              )}
              <div className={`max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-mint/20 text-cream border border-mint/20 rounded-br-sm'
                    : 'bg-white/5 text-cream/90 border border-white/5 rounded-bl-sm'
                }`}>
                  {renderText(msg.text)}
                </div>
                <span className="text-[9px] text-cream/25 mt-1 px-1">{msg.time}</span>
              </div>
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-cream/60 font-bold text-xs shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start items-end space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-mint to-sand flex items-center justify-center text-dark-bg font-extrabold text-xs shrink-0">
                NG
              </div>
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-sm px-5 py-3.5">
                <div className="flex space-x-1.5">
                  <span className="w-2 h-2 bg-mint/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-mint/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-mint/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-5 pt-3 pb-2 flex gap-2 overflow-x-auto border-t border-white/5 shrink-0 scrollbar-none">
          {QUICK_PROMPTS.map((prompt, i) => (
            <button key={i} onClick={() => sendMessage(prompt)} disabled={isTyping}
              className="shrink-0 text-[10px] text-cream/50 border border-cream/10 rounded-full px-3 py-1.5 hover:text-mint hover:border-mint/30 transition-all whitespace-nowrap disabled:opacity-30">
              {prompt}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-4 py-4 border-t border-white/5 flex items-center space-x-3 shrink-0">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask Nav anything about your studies, colleges, or career...`}
            disabled={isTyping}
            className="flex-1 bg-black/30 border border-cream/10 rounded-xl px-4 py-3 text-sm text-cream placeholder-cream/30 outline-none focus:border-mint transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-mint to-sand flex items-center justify-center text-dark-bg disabled:opacity-30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(139,223,221,0.3)]"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
