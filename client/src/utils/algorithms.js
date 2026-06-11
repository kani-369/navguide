/**
 * DAA Logic: Scoring and Sorting Algorithm
 * Ranks colleges based on student stream, grades, interests, budget, and location preferences.
 */

export function scoreAndRankColleges(colleges, studentProfile) {
  if (!studentProfile) return []

  const studentBudget = parseFloat(studentProfile.preferences?.budget) || 100000
  const prefLocation = studentProfile.preferences?.location?.toLowerCase()?.trim() || ''
  const prefType = studentProfile.preferences?.collegeType?.toLowerCase() || ''
  const studentInterests = studentProfile.interests || []

  const rankedColleges = colleges.map((college) => {
    let score = 0
    const matchReasons = []
    
    // Annual fee calculation (Total fees divided by standard 4 years)
    const annualFee = college.total_fees / 4
    
    // 1. Budget Filtering & Scoring (Soft constraint with scaling)
    // If it exceeds budget by more than 15%, mark as ineligible for ranking
    const budgetBuffer = studentBudget * 1.15
    if (annualFee > budgetBuffer) {
      return { ...college, score: -1, isEligible: false }
    }
    
    if (annualFee <= studentBudget) {
      // Cost-savings bonus
      const savingsPercent = (studentBudget - annualFee) / studentBudget
      score += Math.round(savingsPercent * 20) // Up to 20 points for affordability
      matchReasons.push('Fits within your annual budget')
    } else {
      score -= 15 // Slight penalty for borderline budget
    }

    // 2. College Type Match (Government vs Private)
    if (prefType && college.college_type.toLowerCase() === prefType) {
      score += 35
      matchReasons.push(`Matches preferred type (${college.college_type})`)
    }

    // 3. Location Match (e.g. Mangalore, Surathkal, Nitte)
    if (prefLocation && prefLocation !== 'anywhere') {
      const collegeLoc = college.location.toLowerCase()
      if (collegeLoc.includes(prefLocation) || prefLocation.includes(collegeLoc)) {
        score += 45
        matchReasons.push(`Located in your preferred area: ${college.location}`)
      } else {
        // Location mismatch - soft penalty, doesn't exclude completely
        score -= 20
      }
    } else {
      score += 20 // Anywhere bonus
      matchReasons.push('Flexible location compatibility')
    }

    // 4. Rating Score (Scaled)
    // rating is 1.0 - 5.0. e.g. 4.6 * 12 = 55 points
    score += Math.round((college.rating || 3.0) * 12)

    // 5. NAAC Grade Accreditation
    const naacWeights = {
      'A++': 25,
      'A+': 20,
      'A': 15,
      'B+': 10,
      'B': 5,
      'NA': 0
    }
    const gradeVal = naacWeights[college.naac_grade] || 0
    score += gradeVal
    if (college.naac_grade !== 'NA') {
      matchReasons.push(`Premium NAAC rating: ${college.naac_grade}`)
    }

    // 6. Placement Success (Highest package)
    // Packages are represented as LPA equivalents. e.g. 5,400,000 (54L) / 300,000 = +18 points
    const packageBonus = Math.round(college.highest_package / 300000)
    score += packageBonus
    if (college.highest_package >= 2000000) {
      matchReasons.push(`Excellent highest package of ₹${(college.highest_package / 100000).toFixed(1)} LPA`)
    }

    // 7. Stream & Interest Compatibility
    const courseTitle = college.top_course.toLowerCase()
    let courseInterestMatch = false

    studentInterests.forEach((interest) => {
      if (interest === 'ai' && (courseTitle.includes('ai') || courseTitle.includes('artificial') || courseTitle.includes('robotics') || courseTitle.includes('aiml'))) {
        score += 30
        courseInterestMatch = true
      }
      if (interest === 'coding' && (courseTitle.includes('computer') || courseTitle.includes('information') || courseTitle.includes('science') || courseTitle.includes('dev'))) {
        score += 30
        courseInterestMatch = true
      }
      if (interest === 'business' && (courseTitle.includes('management') || courseTitle.includes('business'))) {
        score += 20
        courseInterestMatch = true
      }
    })

    if (courseInterestMatch) {
      matchReasons.push('Top course aligns with your career streams')
    }

    // Clean match reasons: unique values, max of 3 highlights
    const uniqueReasons = Array.from(new Set(matchReasons)).slice(0, 3)

    return {
      ...college,
      score: Math.max(0, score),
      annual_fee: annualFee,
      matchReasons: uniqueReasons,
      isEligible: true
    }
  })

  // Filter out ineligible and sort by score descending
  return rankedColleges
    .filter((c) => c.isEligible)
    .sort((a, b) => b.score - a.score)
}
