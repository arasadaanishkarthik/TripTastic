import { useState, useEffect, useCallback } from 'react';

export const INTRO_STORAGE_KEY = 'triptastic_intro_seen';

export const useIntroExperience = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introStep, setIntroStep] = useState('entering');

  const skipIntro = useCallback(() => {
    setIntroStep('complete');
    setShowIntro(false);
  }, []);

  const resetIntro = useCallback(() => {
    setShowIntro(true);
    setIntroStep('entering');
  }, []);

  useEffect(() => {
    if (!showIntro) {
      setIntroStep('complete');
      return;
    }

    setIntroStep('entering');

    // Phase 1: Destination cards float in and stay on screen for ~2.5s
    const t1 = setTimeout(() => {
      setIntroStep('converging');
    }, 2800);

    // Phase 2: TT Logo reveals in the center and rests for ~2s
    const t2 = setTimeout(() => {
      setIntroStep('logo');
    }, 3800);

    // Phase 3: Smooth, slow fade out into the main hero
    const t3 = setTimeout(() => {
      setIntroStep('complete');
      setTimeout(() => setShowIntro(false), 1400); // 1.4s graceful dissolve
    }, 6400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [showIntro]);

  return {
    showIntro,
    introStep,
    skipIntro,
    resetIntro,
    isComplete: introStep === 'complete',
  };
};