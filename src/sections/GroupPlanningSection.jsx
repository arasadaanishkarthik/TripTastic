import React, { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Users2, ArrowRight } from 'lucide-react';
import { GROUP_TRAVELERS } from '../data/groupPlanningData';
import { TravelerPreferenceCard } from '../components/group/TravelerPreferenceCard';
import { AIPlanningNode } from '../components/group/AIPlanningNode';
import { ConnectionLines } from '../components/group/ConnectionLines';
import { UnifiedTripCard } from '../components/group/UnifiedTripCard';
import { Button } from '../components/Button';

export const GroupPlanningSection = () => {
  const [stage, setStage] = useState('spread'); // 'spread' | 'converging' | 'unified'
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (shouldReduceMotion) {
      setStage('unified');
      return;
    }
    if (progress < 0.35) {
      setStage('spread');
    } else if (progress >= 0.35 && progress < 0.68) {
      setStage('converging');
    } else {
      setStage('unified');
    }
  });

  return (
    <section
      ref={sectionRef}
      id="group-planning"
      className="relative z-20 py-24 sm:py-36 bg-bg text-text-main overflow-hidden border-t border-border transition-colors duration-500"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
          >
            <Users2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">
              The Group Planning Challenge
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight uppercase leading-[1.1]"
          >
            EVERYONE HAS A <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              DIFFERENT IDEA OF THE PERFECT TRIP.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto"
          >
            Different people. Different preferences. Different budgets. TripTastic brings
            everything together into one journey everyone can enjoy.
          </motion.p>
        </div>

        {/* Dynamic Workspace Container */}
        <div className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center">
          <ConnectionLines active={stage === 'converging'} />

          {stage !== 'unified' ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <AIPlanningNode />

              {/* Desktop Floating Layout */}
              <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-10">
                  <TravelerPreferenceCard traveler={GROUP_TRAVELERS[0]} />
                </div>
                <div className="absolute top-4 right-10">
                  <TravelerPreferenceCard traveler={GROUP_TRAVELERS[1]} />
                </div>
                <div className="absolute bottom-4 left-10">
                  <TravelerPreferenceCard traveler={GROUP_TRAVELERS[2]} />
                </div>
                <div className="absolute bottom-4 right-10">
                  <TravelerPreferenceCard traveler={GROUP_TRAVELERS[3]} />
                </div>
              </div>

              {/* Mobile / Tablet Clean Grid Stack */}
              <div className="lg:hidden absolute -bottom-24 inset-x-0 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                {GROUP_TRAVELERS.map((t) => (
                  <TravelerPreferenceCard key={t.id} traveler={t} />
                ))}
              </div>
            </div>
          ) : (
            <UnifiedTripCard />
          )}
        </div>

        {/* Section Resolution Closing Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 sm:mt-28 max-w-xl mx-auto"
        >
          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-main uppercase tracking-tight">
            ONE TRIP. EVERYONE INCLUDED.
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 mb-6">
            TripTastic intelligently balances your group's preferences, budget and interests to create a journey everyone can enjoy.
          </p>
          <Button variant="primary" size="lg" icon={ArrowRight}>
            PLAN YOUR TRIP
          </Button>
        </motion.div>
      </div>
    </section>
  );
};