import React from 'react';
import Lottie from 'lottie-react';

interface LottieAnimationProps {
  animationData: object;
  loop?: boolean;
  autoplay?: boolean;
  style?: React.CSSProperties;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
  animationData,
  loop = true,
  autoplay = true,
  style,
}) => {
  return <Lottie animationData={animationData} loop={loop} autoplay={autoplay} style={style} />;
};

export default LottieAnimation;
