'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const onboardingSteps = [
  {
    id: 1,
    title: 'כל אחד',
    subtitle: 'מכמה חניות',
    description: 'אסוף את הקניות שלך ממספר חנויות שונות במקום אחד ושלח אותן בהזמנה אחת',
    icon: (
      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    )
  },
  {
    id: 2,
    title: 'לא רק אוכל',
    subtitle: 'בא מחר...',
    description: 'הזמן מגוון רחב של מוצרים - מכולת, בגדים, אלקטרוניקה ועוד. הכל מגיע אליך במהירות',
    icon: (
      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
    )
  },
  {
    id: 3,
    title: 'כמה זקי לפני',
    subtitle: 'נתזכר אותך',
    description: 'לפני שהמוצרים שלך מגיעים, נשלח לך התראה כדי שתהיה מוכן לקבל את ההזמנה',
    icon: (
      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.828 2.828M9 3l1 2.828L12.828 3M19.071 7.929l-2.828 2.828M10.343 17.657l2.828 2.828" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v6l4 2" />
        </svg>
      </div>
    )
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push('/map');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.push('/map');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 to-primary-600 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 text-white">
        <button
          onClick={handlePrevious}
          className={`p-2 rounded-full ${currentStep === 0 ? 'opacity-50' : 'hover:bg-white/10'}`}
          disabled={currentStep === 0}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleSkip}
          className="text-white/80 hover:text-white font-medium"
        >
          דלג
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center space-x-2 mb-12">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep ? 'bg-white w-8' : 'bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-white text-center">
        {/* Icon */}
        <div className="mb-12 animate-bounce-in">
          {currentStepData.icon}
        </div>

        {/* Text Content */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">{currentStepData.title}</h1>
          <h2 className="text-2xl font-semibold mb-6 text-primary-100">{currentStepData.subtitle}</h2>
          <p className="text-lg leading-relaxed max-w-sm mx-auto text-primary-100">
            {currentStepData.description}
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-6">
        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full bg-white text-primary-600 font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 mb-4"
        >
          {currentStep === onboardingSteps.length - 1 ? 'בואו נתחיל' : 'המשך'}
        </button>

        {/* Step indicator text */}
        <p className="text-center text-white/60 text-sm">
          {currentStep + 1} מתוך {onboardingSteps.length}
        </p>
      </div>
    </div>
  );
} 