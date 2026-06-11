/**
 * recommendationService.js
 * Generates college eligibility badges and exam recommendations
 * based on the student's academic profile.
 */

import { COLLEGES } from '../utils/constants'
import { scoreAndRankColleges } from '../utils/algorithms'

// Exam database linked to stream/marks/interests
const EXAMS = [
  {
    id: 'kcet',
    name: 'KCET',
    fullName: 'Karnataka Common Entrance Test',
    streams: ['Science'],
    minMarks: 45,
    description: 'State-level entrance exam for engineering and other professional courses in Karnataka government colleges.',
    covers: 'NITK Surathkal, RVCE, BMS, PES, VTU-affiliated colleges',
    difficulty: 'Moderate',
    icon: '🎓'
  },
  {
    id: 'jee_main',
    name: 'JEE Main',
    fullName: 'Joint Entrance Exam — Main',
    streams: ['Science'],
    minMarks: 60,
    description: 'National-level entrance exam for NITs, IIITs, and GFTIs. Qualifying score for JEE Advanced.',
    covers: 'NITs, IIITs, Government institutions nationwide',
    difficulty: 'High',
    icon: '🏛️'
  },
  {
    id: 'comedk',
    name: 'COMEDK UGET',
    fullName: 'Consortium of Medical, Engineering and Dental Colleges of Karnataka',
    streams: ['Science'],
    minMarks: 45,
    description: 'Entrance exam for private engineering colleges in Karnataka — widely accepted alternative to KCET.',
    covers: 'Sahyadri, SJEC, MITE, Alva\'s, and 190+ Karnataka private colleges',
    difficulty: 'Moderate',
    icon: '🔬'
  },
  {
    id: 'cat',
    name: 'CAT',
    fullName: 'Common Admission Test',
    streams: ['Commerce', 'Arts', 'Science'],
    minMarks: 50,
    description: 'National MBA entrance exam for IIMs and top business schools. Highly competitive.',
    covers: 'IIMs, XLRI, MDI, SP Jain and 1200+ B-schools',
    difficulty: 'Very High',
    icon: '💼'
  },
  {
    id: 'clat',
    name: 'CLAT',
    fullName: 'Common Law Admission Test',
    streams: ['Commerce', 'Arts'],
    minMarks: 45,
    description: 'National entrance test for admissions to undergraduate and postgraduate law programs.',
    covers: 'NLUs (National Law Universities) across India',
    difficulty: 'High',
    icon: '⚖️'
  },
  {
    id: 'nata',
    name: 'NATA',
    fullName: 'National Aptitude Test in Architecture',
    streams: ['Science', 'Arts'],
    minMarks: 50,
    description: 'Aptitude test for architecture admissions, testing drawing ability and visual cognition.',
    covers: 'Architecture colleges nationwide, including IITs',
    difficulty: 'Moderate',
    icon: '🏗️'
  },
  {
    id: 'gmat',
    name: 'GMAT',
    fullName: 'Graduate Management Admission Test',
    streams: ['Commerce', 'Science'],
    minMarks: 55,
    description: 'International management aptitude test for global MBA programs.',
    covers: 'International MBA programs, Harvard, Wharton, INSEAD',
    difficulty: 'High',
    icon: '🌐'
  }
]

/**
 * Returns eligible exams based on student profile (stream, marks, interests, career goal).
 */
export function getRecommendedExams(userProfile) {
  const stream = userProfile?.academic?.stream || 'Science'
  const marks = parseFloat(userProfile?.academic?.marks) || 0
  const interests = userProfile?.interests || []
  const goal = (userProfile?.careerGoal || '').toLowerCase()

  return EXAMS
    .filter(exam => {
      // Must match stream
      const streamMatch = exam.streams.includes(stream)
      // Must meet minimum marks threshold
      const marksEligible = marks >= exam.minMarks
      return streamMatch && marksEligible
    })
    .map(exam => {
      let matchScore = 50 // Base score

      // Boost for AI/Coding interests → engineering exams
      if (['coding', 'ai', 'engineering'].some(i => interests.includes(i))) {
        if (['kcet', 'jee_main', 'comedk'].includes(exam.id)) matchScore += 40
      }
      // Boost for Business/Finance → management exams
      if (['business', 'finance'].some(i => interests.includes(i))) {
        if (['cat', 'gmat'].includes(exam.id)) matchScore += 40
      }
      // Boost for Design interests → architecture
      if (interests.includes('design')) {
        if (exam.id === 'nata') matchScore += 40
      }
      // Career goal keyword matching
      if (goal.includes('ai') || goal.includes('software') || goal.includes('engineer')) {
        if (['kcet', 'jee_main', 'comedk'].includes(exam.id)) matchScore += 25
      }
      if (goal.includes('manager') || goal.includes('mba') || goal.includes('business')) {
        if (['cat', 'gmat'].includes(exam.id)) matchScore += 25
      }

      // Marks-based readiness level
      let readiness = 'Ready'
      const gap = marks - exam.minMarks
      if (gap >= 20) readiness = 'Well Prepared'
      else if (gap >= 10) readiness = 'Ready'
      else if (gap >= 0) readiness = 'Borderline Eligible'
      else readiness = 'Needs Improvement'

      return { ...exam, matchScore, readiness }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
}

/**
 * Returns college eligibility batch label based on student marks vs estimated cutoff.
 * Colleges that rank in top 5 have estimated higher cutoff thresholds.
 */
export function getCollegeEligibility(college, studentMarks) {
  const marks = parseFloat(studentMarks) || 0

  // Estimated cutoff tiers based on ranking/rating
  const cutoffByRating = {
    4.5: 90,
    4.3: 85,
    4.1: 78,
    4.0: 72,
    3.9: 65,
    3.8: 58,
    3.7: 50,
    3.6: 45,
    3.5: 40
  }

  // Find closest cutoff tier
  const ratingKeys = Object.keys(cutoffByRating).map(Number).sort((a, b) => b - a)
  let estimatedCutoff = 50
  for (const r of ratingKeys) {
    if (college.rating >= r) {
      estimatedCutoff = cutoffByRating[r]
      break
    }
  }

  const gap = marks - estimatedCutoff

  if (gap >= 15) return { label: 'Highly Eligible', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/25' }
  if (gap >= 5) return { label: 'Eligible', color: 'text-mint bg-mint/10 border-mint/25' }
  if (gap >= -5) return { label: 'Competitive', color: 'text-sand bg-sand/10 border-sand/25' }
  if (gap >= -15) return { label: 'Challenging', color: 'text-orange-400 bg-orange-400/10 border-orange-400/25' }
  return { label: 'Score Boost Needed', color: 'text-coral bg-coral/10 border-coral/25' }
}

/**
 * Returns ranked colleges filtered and scored against user profile.
 */
export function getRankedColleges(userProfile) {
  return scoreAndRankColleges(COLLEGES, userProfile)
}
