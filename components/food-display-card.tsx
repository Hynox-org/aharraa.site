import React from 'react';

interface FoodDisplayCardProps {
  image: string;
  title: string;
  description?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const FoodDisplayCard: React.FC<FoodDisplayCardProps> = ({
  image,
  title,
  description,
  onClick,
  isSelected = false,
}) => {
  return (
    <div
      className={`
        relative cursor-pointer group
        transition-all duration-500 ease-out
        ${isSelected ? 'scale-105' : 'hover:scale-[1.02]'}
      `}
      onClick={onClick}
    >
      {/* Floating Content - No Card Container */}
      <div className="relative flex flex-col items-center">
        
        {/* Floating Image with Transparent Background */}
        <div className="relative mb-4">
          {/* Subtle glow effect behind image when selected */}
          {isSelected && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-2xl scale-110 animate-pulse" />
          )}
          
          {/* Food Image - Main Focus */}
          <img
            className={`
              relative z-10 w-48 h-48 object-contain
              transition-all duration-700 ease-out
              filter
              ${
                isSelected 
                  ? 'drop-shadow-2xl scale-110 -rotate-6' 
                  : 'drop-shadow-xl group-hover:drop-shadow-2xl group-hover:scale-105 group-hover:rotate-3'
              }
            `}
            src={image}
            alt={title}
          />

          {/* Selected Checkmark Badge */}
          {isSelected && (
            <div className="absolute -top-2 -right-2 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-2 shadow-xl">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Content - Minimal & Clean */}
        <div className="text-center space-y-2">
          {/* Title */}
          <h3
            className={`
              font-bold text-2xl capitalize
              transition-all duration-300
              ${
                isSelected
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700'
                  : 'text-gray-800 group-hover:text-gray-900'
              }
            `}
          >
            {title}
          </h3>

          {/* Description - Optional */}
          {description && (
            <p className={`
              text-sm transition-colors duration-300
              ${isSelected ? 'text-teal-600 font-medium' : 'text-gray-500'}
            `}>
              {description}
            </p>
          )}

          {/* Selection Indicator - Minimalist Pill */}
          <div className="pt-2">
            <div
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-300
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white'
                    : 'bg-transparent border-2 border-gray-200 text-gray-500 group-hover:border-gray-300'
                }
              `}
            >
              <span className="text-xs font-semibold uppercase tracking-wider">
                {isSelected ? 'Selected' : 'Select'}
              </span>
              
              {isSelected && (
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDisplayCard;
