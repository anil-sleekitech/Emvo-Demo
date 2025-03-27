import React, { useState } from 'react';

type FeedbackType = {
  naturalness: 'Yes, it felt natural' | 'Somewhat, but could improve' | 'No, it felt robotic' | '';
  emotionalIntelligence: 'Yes, it responded appropriately' | 'Sometimes, but not always' | 'No, it lacked emotional depth' | '';
  businessInterest: 'Yes, let\'s schedule a call' | 'I\'d like more information first' | 'Not at the moment' | '';
  preferredTime: 'Morning' | 'Afternoon' | 'Evening' | '';
};

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: Omit<FeedbackType, ''>) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>({
    naturalness: '',
    emotionalIntelligence: '',
    businessInterest: '',
    preferredTime: '',
  });

  if (!isOpen) return null;

  const questions = [
    {
      title: "Did Emvo AI feel like a human-like assistant in conversation?",
      options: [
        "Yes, it felt natural",
        "Somewhat, but could improve",
        "No, it felt robotic"
      ],
      field: 'naturalness' as keyof FeedbackType
    },
    {
      title: "Did Emvo AI demonstrate emotional intelligence and context awareness?",
      options: [
        "Yes, it responded appropriately",
        "Sometimes, but not always",
        "No, it lacked emotional depth"
      ],
      field: 'emotionalIntelligence' as keyof FeedbackType
    },
    {
      title: "Would you like to explore how Emvo AI can be tailored for your business needs?",
      options: [
        "Yes, let's schedule a call",
        "I'd like more information first",
        "Not at the moment"
      ],
      field: 'businessInterest' as keyof FeedbackType
    },
    {
      title: "What's the best time for us to get in touch with you?",
      options: [
        "Morning",
        "Afternoon",
        "Evening"
      ],
      field: 'preferredTime' as keyof FeedbackType
    }
  ];

  const currentQuestion = questions[currentStep];

  const handleOptionSelect = (option: string) => {
    setFeedback(prev => ({
      ...prev,
      [currentQuestion.field]: option
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // On final submit, send all responses
      console.log('All Feedback Responses:', feedback);
      onSubmit(feedback as Omit<FeedbackType, ''>);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isCurrentQuestionAnswered = Boolean(feedback[currentQuestion.field]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#0A021D] p-8 rounded-2xl w-full max-w-md">
        {/* Header with back button and close button */}
        <div className="flex justify-between items-center mb-6">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#9351E8] via-[#BF4FFF] to-[#E977B4] bg-clip-text text-transparent">
              🤝 We&apos;d love your feedback!
            </h2>
            <p className="text-gray-400 mt-2">
              Your input helps us make Emvo better for you
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-white text-lg">{currentQuestion.title}</h3>
            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className="w-full p-4 bg-[#150C29] rounded-lg text-white hover:bg-purple-700/20 transition flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name={currentQuestion.field}
                    value={option}
                    checked={feedback[currentQuestion.field] === option}
                    onChange={() => handleOptionSelect(option)}
                    className="w-6 h-6 text-purple-500 bg-transparent border-2 border-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isCurrentQuestionAnswered}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep < questions.length - 1 ? 'Next' : 'Submit'} →
            </button>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-purple-500'
                    : index < currentStep
                    ? 'bg-purple-300'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDialog; 