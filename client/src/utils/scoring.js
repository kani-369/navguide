/**
 * scoring.js
 * DAA scoring engines:
 * 1. Next Best Action — selects the single highest-value task for the student.
 * 2. Decision Matrix — scores and ranks career pathway options.
 */

// Priority weights for task scoring
const PRIORITY_WEIGHTS = { High: 100, Medium: 60, Low: 25 }

/**
 * Analyzes tasks, goals, and student marks to determine the single Next Best Action.
 * Returns the highest-priority pending task with contextual advice.
 *
 * @param {Array} tasks - array of task objects from AppContext
 * @param {Array} goals - array of goal objects from AppContext
 * @param {object} userProfile - student's academic profile from AuthContext
 * @returns {object|null} - the best action recommendation
 */
export function computeNextBestAction(tasks, goals, userProfile) {
  const pendingTasks = tasks.filter(t => t.status === 'Pending')
  if (pendingTasks.length === 0) return null

  const marks = parseFloat(userProfile?.academic?.marks) || 0
  const interests = userProfile?.interests || []

  // Score each pending task
  const scored = pendingTasks.map(task => {
    let score = PRIORITY_WEIGHTS[task.priority] || 30

    // Bonus: Task is linked to a goal
    if (task.goalLink) score += 30

    // Bonus: Marks below 70 → academic tasks get a boost
    if (marks < 70 && /exam|study|test|register|kcet|jee|revision/i.test(task.title)) {
      score += 40
    }

    // Bonus: Task aligns with student interests
    interests.forEach(interest => {
      if (
        (interest === 'coding' && /python|code|programming|project|portfolio/i.test(task.title)) ||
        (interest === 'ai' && /ai|ml|machine|data|model/i.test(task.title)) ||
        (interest === 'design' && /figma|design|ui|ux|prototype/i.test(task.title))
      ) {
        score += 20
      }
    })

    return { ...task, actionScore: score }
  })

  // Sort by actionScore descending and pick the top
  scored.sort((a, b) => b.actionScore - a.actionScore)
  const best = scored[0]

  // Find linked goal name if applicable
  const linkedGoal = best.goalLink
    ? (goals || []).find(g => g.id === best.goalLink)
    : null

  // Generate contextual advice string
  let advice = ''
  if (best.priority === 'High') {
    advice = 'This is your most critical pending task. Completing it now will have the highest positive impact on your academic progress.'
  } else if (linkedGoal) {
    advice = `This task directly advances your goal: "${linkedGoal.title}". Staying consistent on goal-linked tasks accelerates your path.`
  } else {
    advice = 'A smart next step to keep your momentum going. Completing small wins builds consistent habits.'
  }

  return {
    task: best,
    linkedGoal: linkedGoal?.title || null,
    advice,
    pendingCount: pendingTasks.length,
    completedCount: tasks.length - pendingTasks.length
  }
}

/**
 * Decision Matrix scoring engine.
 * Weights: Interest (30%), Salary (25%), Job Security (25%), Difficulty (20%)
 * Difficulty is inverse-scored (lower difficulty = higher score contribution).
 *
 * @param {Array} decisions - array of decision options from AppContext
 * @returns {Array} - sorted ranked decisions with computed scores, pros, and cons
 */
export function scoreDecisions(decisions) {
  if (!decisions || decisions.length === 0) return []

  const WEIGHTS = {
    interest: 0.30,
    salary: 0.25,
    security: 0.25,
    difficulty: 0.20 // inverse
  }

  const scored = decisions.map(dec => {
    const f = dec.factors
    const interest = (f.interest || 5) / 10
    const salary = (f.salary || 5) / 10
    const security = (f.security || 5) / 10
    const difficulty = 1 - ((f.difficulty || 5) / 10) // inverse

    const totalScore = (
      interest * WEIGHTS.interest +
      salary * WEIGHTS.salary +
      security * WEIGHTS.security +
      difficulty * WEIGHTS.difficulty
    ) * 100

    // Generate pros and cons from factors
    const pros = []
    const cons = []
    if (f.interest >= 7) pros.push('High personal interest & passion alignment')
    else if (f.interest <= 4) cons.push('Low personal interest may reduce long-term motivation')
    if (f.salary >= 7) pros.push('Strong salary potential and earning growth')
    else if (f.salary <= 4) cons.push('Limited salary ceiling in early career stages')
    if (f.security >= 7) pros.push('Stable and secure career trajectory')
    else if (f.security <= 4) cons.push('Volatile or uncertain job market stability')
    if (f.difficulty <= 4) pros.push('Lower skill acquisition barrier to entry')
    else if (f.difficulty >= 7) cons.push('Demands high effort, steep learning curve')

    return {
      ...dec,
      totalScore: Math.round(totalScore),
      pros,
      cons
    }
  })

  // Sort descending by total score
  return scored.sort((a, b) => b.totalScore - a.totalScore)
}
