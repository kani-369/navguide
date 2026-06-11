/**
 * aiService.js
 * Mock AI Mentor "Nav" — structured to accept a real API key later.
 * Generates context-aware responses using the student's profile data.
 */

// Context-aware response templates
const MENTOR_RESPONSES = {
  greet: (name) => [
    `Hey ${name}! I'm Nav, your AI mentor. How can I guide you today?`,
    `Welcome back, ${name}! Ready to make some progress together?`,
    `Hi ${name}! I've been analyzing your profile. What's on your mind?`
  ],
  marks: (marks, stream) => [
    `With ${marks}% in ${stream}, you're in a solid position. Focus on competitive exam prep to push into the top-tier colleges.`,
    `Your ${marks}% score in ${stream} is a great foundation. Shall I suggest specific exam strategies for you?`,
    `${marks}% is good! For ${stream} students, I'd recommend starting with KCET mock tests to calibrate your target score.`
  ],
  colleges: (location, budget) => [
    `Based on your location preference (${location}) and budget of ₹${(budget/1000).toFixed(0)}k/year, I've already ranked the best matches on your Colleges page.`,
    `For your criteria, colleges like NITK and NMAM Institute offer excellent placements. Check your /colleges page for the full ranked list.`,
    `Your budget filters are set to ₹${(budget/1000).toFixed(0)}k/year. I can refine suggestions further — just tell me your preferred stream.`
  ],
  career: (goal) => [
    `${goal || 'Your career goal'} is a fantastic direction. I suggest building a portfolio project alongside your studies to stand out.`,
    `For reaching "${goal || 'your goal'}", the key milestones are: master the fundamentals, build projects, and start networking on LinkedIn.`,
    `Great ambition! To achieve "${goal || 'your career goal'}", focus on 3 things: consistent practice, peer collaboration, and mock interview prep.`
  ],
  tasks: [
    `I notice you have pending high-priority tasks. Let's knock them out — start with the one linked to your top goal.`,
    `Your task board needs attention! Completing high-priority items now will directly improve your Next Best Action score.`,
    `I recommend tackling your High priority tasks first. Would you like me to break them into smaller steps?`
  ],
  decision: [
    `I've run your career options through my decision engine on the /decision page. The scoring factors in interest, salary potential, and job security.`,
    `Career decisions are tough. My recommendation: go with the option that scores highest in *interest* — motivation is the strongest predictor of success.`,
    `Use your Decision page to add and compare options. I'll score them objectively so you can decide with confidence.`
  ],
  general: [
    `That's a great question! As your AI mentor, I'll give you a personalized answer. Could you give me a bit more context?`,
    `I'm here to help you navigate your educational journey. Ask me about colleges, exams, tasks, or career decisions!`,
    `Let me think about that... Based on your profile, I'd say the best approach is to start small, stay consistent, and iterate.`,
    `Great initiative asking that! Focus, consistency, and smart planning are the three pillars of academic success.`
  ]
}

/**
 * Generates a context-aware AI response.
 * @param {string} userMessage - the user's typed message
 * @param {object} userProfile - the logged-in student's profile object
 * @returns {Promise<string>} - resolves with the AI mentor's response text
 */
export async function generateAIResponse(userMessage, userProfile) {
  try {
    const token = localStorage.getItem('navguide_token')
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: userMessage })
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch AI response.')
    }
    return data.response
  } catch (error) {
    console.error('Error generating AI response:', error)
    throw error
  }
}
