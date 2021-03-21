import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from './../styles/components/ExperienceBar.module.css'

export function ExperienceBar() {
  const { currentExperience, startExperienceCurrentLevel, experienceToNextLevel } = useContext(ChallengesContext)

  const experienceInCurrentLevel = startExperienceCurrentLevel + currentExperience;
  
  const percentToNextLevel = (currentExperience - startExperienceCurrentLevel) * 100 / (experienceToNextLevel - startExperienceCurrentLevel)

  const hasExperienceInCurrentLevel = experienceInCurrentLevel !== 0;

  return (
    <header className={styles.experienceBar}>
      <span>{startExperienceCurrentLevel} xp</span>

      <div>
        {hasExperienceInCurrentLevel &&
          <>
            <div style={{ width: `${percentToNextLevel}%` }} />

            <span className={styles.currentExperience} style={{ left: `${percentToNextLevel}%` }} >
              {currentExperience} xp
          </span>
          </>
        }
      </div>

      <span>{experienceToNextLevel} xp</span>
    </header>
  );
}