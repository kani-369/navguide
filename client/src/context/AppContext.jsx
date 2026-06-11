import React, { createContext, useState, useEffect } from 'react'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [goals, setGoals] = useState([])
  const [decisions, setDecisions] = useState([])

  // Load initial data from localStorage or seed defaults
  useEffect(() => {
    try {
      const storedTasks = localStorage.getItem('navguide_tasks')
      const storedGoals = localStorage.getItem('navguide_goals')
      const storedDecisions = localStorage.getItem('navguide_decisions')

      if (storedGoals) {
        setGoals(JSON.parse(storedGoals))
      } else {
        const defaultGoals = [
          { id: 'g1', title: 'Secure Admission in a Top Tier College', type: 'Academic' },
          { id: 'g2', title: 'Become an AI Developer / Software Engineer', type: 'Career' },
          { id: 'g3', title: 'Build a Portfolio Project in React & Tailwind', type: 'Skill' }
        ]
        setGoals(defaultGoals)
        localStorage.setItem('navguide_goals', JSON.stringify(defaultGoals))
      }

      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      } else {
        const defaultTasks = [
          { id: 't1', title: 'Complete KCET/JEE mock exam registration', priority: 'High', status: 'Pending', goalLink: 'g1' },
          { id: 't2', title: 'Review Python & ML roadmap on Roadmap.sh', priority: 'Medium', status: 'Pending', goalLink: 'g2' },
          { id: 't3', title: 'Design NavGuide layout prototype in Figma', priority: 'Low', status: 'Pending', goalLink: 'g3' },
          { id: 't4', title: 'Shortlist top 3 engineering colleges in Mangalore', priority: 'High', status: 'Completed', goalLink: 'g1' }
        ]
        setTasks(defaultTasks)
        localStorage.setItem('navguide_tasks', JSON.stringify(defaultTasks))
      }

      if (storedDecisions) {
        setDecisions(JSON.parse(storedDecisions))
      } else {
        const defaultDecisions = [
          { 
            id: 'd1', 
            title: 'AI Engineering Career Path', 
            factors: { interest: 9, salary: 10, difficulty: 8, security: 7 } 
          },
          { 
            id: 'd2', 
            title: 'General IT Consultancy Path', 
            factors: { interest: 5, salary: 7, difficulty: 4, security: 9 } 
          }
        ]
        setDecisions(defaultDecisions)
        localStorage.setItem('navguide_decisions', JSON.stringify(defaultDecisions))
      }
    } catch (e) {
      console.error('Error loading AppContext data from localStorage:', e)
    }
  }, [])

  // Sync state changes to localStorage
  const syncTasks = (newTasks) => {
    setTasks(newTasks)
    localStorage.setItem('navguide_tasks', JSON.stringify(newTasks))
  }

  const syncGoals = (newGoals) => {
    setGoals(newGoals)
    localStorage.setItem('navguide_goals', JSON.stringify(newGoals))
  }

  const syncDecisions = (newDecs) => {
    setDecisions(newDecs)
    localStorage.setItem('navguide_decisions', JSON.stringify(newDecs))
  }

  // Task Operations
  const addTask = (title, priority = 'Medium', goalLink = '') => {
    const newTask = {
      id: 'task_' + Date.now(),
      title,
      priority,
      status: 'Pending',
      goalLink: goalLink || null
    }
    syncTasks([...tasks, newTask])
  }

  const toggleTaskStatus = (id) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' }
      }
      return t
    })
    syncTasks(updated)
  }

  const deleteTask = (id) => {
    syncTasks(tasks.filter(t => t.id !== id))
  }

  // Goal Operations
  const addGoal = (title, type = 'Skill') => {
    const newGoal = {
      id: 'goal_' + Date.now(),
      title,
      type
    }
    syncGoals([...goals, newGoal])
  }

  const deleteGoal = (id) => {
    syncGoals(goals.filter(g => g.id !== id))
    // Clean up task references linked to this deleted goal
    const cleanedTasks = tasks.map(t => {
      if (t.goalLink === id) {
        return { ...t, goalLink: null }
      }
      return t
    })
    syncTasks(cleanedTasks)
  }

  // Decision matrix operations
  const addDecisionOption = (title, factors) => {
    const newDec = {
      id: 'dec_' + Date.now(),
      title,
      factors: {
        interest: parseInt(factors.interest) || 5,
        salary: parseInt(factors.salary) || 5,
        difficulty: parseInt(factors.difficulty) || 5,
        security: parseInt(factors.security) || 5
      }
    }
    syncDecisions([...decisions, newDec])
  }

  const deleteDecisionOption = (id) => {
    syncDecisions(decisions.filter(d => d.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        tasks,
        goals,
        decisions,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addGoal,
        deleteGoal,
        addDecisionOption,
        deleteDecisionOption
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
