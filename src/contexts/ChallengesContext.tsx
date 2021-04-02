import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json'
import Cookies from 'js-cookie'
import { LevelUpModal } from '../components/LevelUpModal'

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
  completeChallenge: () => void,
  closeLevelUpModal: () => void
}

interface ChallengesProvierProps {
  children: ReactNode
  level: number
  currentExperience: number
  challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider({
  children,
  ...rest
}: ChallengesProvierProps) {
  const [level, setLevel] = useState(rest.level)
  const [currentExperience, setCurrentExperience] = useState(rest.currentExperience)
  const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted)

  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceToNextLevel = calculateLevelExperience(level + 1)
  const startExperienceCurrentLevel = level <= 1 ? 0 : calculateLevelExperience(level)

  function calculateLevelExperience(targetLevel) {
    const difficultyMultiplier = 8;
    return Math.pow((targetLevel) * difficultyMultiplier, 2)
  }

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    Cookies.set('level', String(level))
    Cookies.set('currentExperience', String(currentExperience))
    Cookies.set('challengesCompleted', String(challengesCompleted))
  }, [level, currentExperience, challengesCompleted])

  function levelUp() {
    setLevel(level + 1)
    setIsLevelUpModalOpen(true)
  }

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false)
  }

  function startNewChallenge() {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[randomChallengeIndex]

    setActiveChallenge(challenge)

    if (Notification.permission === 'granted') {
      new Notification('Novo desafio 🎉')
    }

    new Audio('/notification.mp3').play()
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
      completeChallenge,
      closeLevelUpModal
    }}>
      {children}

      { isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}
