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
        ${isSelected ? 'scale-[1.01] md:scale-105' : 'hover:scale-[1.005] md:hover:scale-[1.02]'}
      `}
      onClick={onClick}
    >
      {/* Floating Content - No Card Container */}
      <div className="relative flex flex-col items-center">
        
        {/* Floating Image with Transparent Background */}
        <div className="relative mb-2 md:mb-4">
          {/* Subtle glow effect behind image when selected */}
          {isSelected && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 md:from-emerald-400/30 md:to-teal-400/30 rounded-full blur-lg md:blur-2xl scale-110 animate-pulse" />
          )}
          
          {/* Food Image - Main Focus - MUCH SMALLER ON MOBILE */}
          <img
            className={`
              relative z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-48 md:h-48 object-contain
              transition-all duration-700 ease-out
              filter
              ${
                isSelected 
                  ? 'drop-shadow-lg md:drop-shadow-2xl scale-105 md:scale-110 -rotate-3 md:-rotate-6' 
                  : 'drop-shadow-md md:drop-shadow-xl group-hover:drop-shadow-lg md:group-hover:drop-shadow-2xl group-hover:scale-105 group-hover:rotate-2 md:group-hover:rotate-3'
              }
            `}
            src={image}
            alt={title}
          />

          {/* Selected Checkmark Badge - SMALLER ON MOBILE */}
          {isSelected && (
            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 z-20">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm md:blur-md opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full p-0.5 md:p-2 shadow-lg md:shadow-xl">
                  <svg
                    className="w-2.5 h-2.5 md:w-5 md:h-5"
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

        {/* Text Content - Minimal & Clean - MUCH SMALLER ON MOBILE */}
        <div className="text-center space-y-0.5 md:space-y-2">
          {/* Title - SMALLER FONTS */}
          <h3
            className={`
              font-bold text-xs sm:text-sm md:text-2xl capitalize
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

          {/* Description - Optional - SMALLER */}
          {description && (
            <p className={`
              text-[9px] sm:text-[10px] md:text-sm transition-colors duration-300 line-clamp-1
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
              

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDisplayCard;
