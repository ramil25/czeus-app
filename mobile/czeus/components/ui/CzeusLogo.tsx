import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface CzeusLogoProps {
  width?: number;
  height?: number;
}

export function CzeusLogo({ width = 170, height = 60 }: CzeusLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 340 120">
      <Rect width="100%" height="100%" fill="#2362c7" />
    </Svg>
  );
}