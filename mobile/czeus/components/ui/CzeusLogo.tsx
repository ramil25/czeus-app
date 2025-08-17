import React from 'react';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

interface CzeusLogoProps {
  width?: number;
  height?: number;
}

export function CzeusLogo({ width = 170, height = 60 }: CzeusLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 340 120">
      <Rect width="100%" height="100%" fill="#2362c7" />
      <SvgText
        x="50%"
        y="55"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="60"
        fontWeight="bold"
        fill="#fff"
      >
        Czeus
      </SvgText>
      <SvgText
        x="50%"
        y="95"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="24"
        fill="#fff"
        letterSpacing="2"
      >
        Boardgame Café
      </SvgText>
    </Svg>
  );
}