import { createContext, ReactNode, useState } from 'react'
import challenges from '../../challenges.json'

interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

interface ChallengesContextData {
  level: number
  currentExperience: number
  challengesCompleted: number
  experienceToNextLevel: number
  startExperienceCurrentLevel: number
  activeChallenge: Challenge,
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void,
  completeChallenge: () => void
}

interface ChallengesProvierProps {
  children: ReactNode
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({ children }: ChallengesProvierProps) {
  const [level, setLevel] = useState(1)
  const [currentExperience, setCurrentExperience] = useState(0)
  const [challengesCompleted, setChallengesCompleted] = useState(0)
  const [activeChallenge, setActiveChallenge] = useState(null)

  const experienceToNextLevel = calculateLevelExperience(level + 1)
  const startExperienceCurrentLevel = level <= 1 ? 0 : calculateLevelExperience(level)

  function calculateLevelExperience(targetLevel) {
    const difficultyMultiplier = 8;
    return Math.pow((targetLevel) * difficultyMultiplier, 2)
  }

  function levelUp() {
    setLevel(level + 1)
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)
  }

  function resetChallenge() {
    setActiveChallenge(null)
  }

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }
    const { amount } = activeChallenge;
    const finalExperience = currentExperience + amount;

    setCurrentExperience(finalExperience)

    if (finalExperience >= experienceToNextLevel) {
      levelUp();
    }

    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  return (
    <ChallengesContext.Provider value={{
      level,
      activeChallenge,
      currentExperience,
      challengesCompleted,
      experienceToNextLevel,
      startExperienceCurrentLevel,
      levelUp,
      startNewChallenge,
      resetChallenge,
      completeChallenge
    }}>
      {children}
    </ChallengesContext.Provider>
  )
}
