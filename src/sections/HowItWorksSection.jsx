import React, { useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Cpu } from 'lucide-react';
import { JOURNEY_STEPS } from '../data/howItWorksData';
import { TripSetupPreview } from '../components/how/TripSetupPreview';
import { CrewPreview } from '../components/how/CrewPreview';
import { AIPlanningPreview } from '../components/how/AIPlanningPreview';
import { ItineraryPreview } from '../components/how/ItineraryPreview';

export const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (shouldReduceMotion) return;
    if (progress < 0.25) setActiveStep(1);
    else if (progress >= 0.25 && progress < 0.5) setActiveStep(2);
    else if (progress >= 0.5 && progress < 0.75) setActiveStep(3);
    else setActiveStep(4);
  });

  const renderActivePreview = () => {
    switch (activeStep) {
      case 1:
        return <TripSetupPreview />;
      case 2:
        return <CrewPreview />;
      case 3:
        return <AIPlanningPreview />;
      case 4:
        return <ItineraryPreview />;
      default:
        return <TripSetupPreview />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative z-20 py-24 sm:py-36 bg-bg text-text-main overflow-hidden border-t border-border transition-colors duration-500"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase">HOW IT WORKS</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight uppercase leading-[1.1]"
          >
            FROM "WHERE SHOULD WE GO?" <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              TO "LET'S GO."
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed max-w-xl mx-auto"
          >
            TripTastic turns group travel planning into a simple, intelligent and collaborative experience.
          </motion.p>
        </div>

        {/* Desktop & Tablet Horizontal Timeline Steps */}
        <div className="relative max-w-5xl mx-auto mb-16 hidden md:block">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 h-0.5 bg-border z-0" />
          {/* Active Connecting Line Progress */}
          <div
            className="absolute top-1/2 left-10 -translate-y-1/2 h-0.5 bg-primary z-0 transition-all duration-500"
            style={{ width: `${((activeStep - 1) / (JOURNEY_STEPS.length - 1)) * 85}%` }}
          />

          <div className="relative z-10 grid grid-cols-4 gap-4">
            {JOURNEY_STEPS.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`text-left p-5 rounded-2xl transition-all duration-300 backdrop-blur-md border ${
                    isActive
                      ? 'bg-surface/90 border-primary shadow-xl shadow-primary/10 scale-105'
                      : 'bg-surface/40 border-border hover:bg-surface/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-heading font-extrabold text-sm ${isActive ? 'text-primary' : 'text-text-secondary'}`}>
                      {step.number}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-ping' : 'bg-border'}`} />
                  </div>
                  <h4 className={`font-heading font-bold text-xs uppercase tracking-wider mb-1 ${isActive ? 'text-text-main' : 'text-text-secondary'}`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-text-secondary truncate">{step.subtitle}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-3 mb-10">
          {JOURNEY_STEPS.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  isActive ? 'bg-surface border-primary shadow-lg' : 'bg-surface/40 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-xs text-primary">{step.number} — {step.title}</span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary' : 'bg-border'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Visual Preview Box */}
        <div className="relative min-h-[340px] flex items-center justify-center">
          {renderActivePreview()}
        </div>
      </div>
    </section>
  );
};