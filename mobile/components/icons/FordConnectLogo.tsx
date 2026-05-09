import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface Props {
  size?: number;
  color?: string;
}

export function FordConnectLogo({ size = 28, color = '#fff' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M4 11c5-3 9-3 12 0s7 3 12 0v6c-5 3-9 3-12 0s-7-3-12 0v-6z"
        fill={color}
        fillOpacity={0.9}
      />
      <Path
        d="M4 18c5-3 9-3 12 0s7 3 12 0"
        stroke={color}
        strokeWidth={1.4}
        strokeOpacity={0.4}
        fill="none"
      />
    </Svg>
  );
}
