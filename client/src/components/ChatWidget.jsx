import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles, Minimize2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { generateAIResponse } from '../services/aiService'

export function ChatWidget() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([{
    id: 1,
    sender: 'nav',
    text: `Hey ${user?.name?.split(' ')[0] || 'there'}! I'm Nav 👋 Ask me anything about colleges, exams, or your career!`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 100) }, [isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(p => [...p, { id: Date.now(), sender: 'user', text: trimmed, time: now }])
    setInput('')
    setIsTyping(true)
    try {
      const aiText = await generateAIResponse(trimmed, user)
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'nav', text: aiText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } catch {
      setMessages(p => [...p, { id: Date.now() + 1, sender: 'nav', text: 'I had a small glitch. Please try again!', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    } finally { setIsTyping(false) }
  }

  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-80 md:w-96 flex flex-col rounded-2xl overflow-hidden bg-white border"
          style={{ height: 440, borderColor: 'var(--c-border)', boxShadow: '0 12px 48px rgba(0,0,0,0.14)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--c-border)', background: 'rgba(139,223,221,0.08)' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center font-800 text-xs"
                style={{ background: 'linear-gradient(135deg,#8BDFDD,#FFE394)', color: '#333' }}>
                NG
              </div>
              <div>
                <p className="text-sm font-700 text-gray-800">Nav AI Mentor</p>
                <p className="text-[10px] text-emerald-600 font-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-black/5">
              <Minimize2 size={15} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: '#FAFAF8' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white text-gray-800 border rounded-br-sm'
                    : 'rounded-bl-sm'
                }`}
                style={msg.sender === 'nav'
                  ? { background: 'rgba(139,223,221,0.15)', color: '#222', border: '1px solid rgba(139,223,221,0.30)' }
                  : { borderColor: 'var(--c-border)' }
                }>
                  <p>{msg.text}</p>
                  <p className="text-[9px] text-gray-400 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-4 py-3"
                  style={{ background: 'rgba(139,223,221,0.12)', border: '1px solid rgba(139,223,221,0.25)' }}>
                  <div className="flex gap-1.5">
                    {[0,150,300].map(d => (
                      <span key={d} className="w-2 h-2 rounded-full animate-bounce"
                        style={{ background: 'var(--c-teal)', animationDelay: d + 'ms' }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t flex items-center gap-2 bg-white"
            style={{ borderColor: 'var(--c-border)' }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder="Ask Nav anything…" disabled={isTyping}
              className="flex-1 input-base" />
            <button onClick={sendMessage} disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
              style={{ background: 'var(--c-teal)', color: '#111', boxShadow: '0 4px 12px rgba(139,223,221,0.40)' }}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: isOpen ? '#FFFFFF' : 'var(--c-teal)',
          color: isOpen ? 'var(--c-teal-dk)' : '#111',
          border: isOpen ? '1.5px solid rgba(139,223,221,0.50)' : 'none',
          boxShadow: '0 6px 24px rgba(139,223,221,0.45)'
        }}
        aria-label="Open AI chat">
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>
    </div>
  )
}

export default ChatWidget
