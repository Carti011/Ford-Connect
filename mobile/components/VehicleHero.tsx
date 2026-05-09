import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Ellipse, G, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../constants/colors';

const W = 280;
const H = 150;

export function VehicleHero() {
  return (
    <View style={{ width: '100%', aspectRatio: 280 / 150 }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <RadialGradient id="vglow" cx="50%" cy="60%" r="55%">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.55} />
            <Stop offset="50%" stopColor={colors.accent} stopOpacity={0.18} />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id="vbody" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={colors.accent} stopOpacity={0.95} />
            <Stop offset="100%" stopColor={colors.accent} stopOpacity={0.55} />
          </LinearGradient>
        </Defs>

        {/* glow embaixo */}
        <Ellipse cx={W / 2} cy={H * 0.78} rx={W * 0.42} ry={H * 0.45} fill="url(#vglow)" />

        {/* silhueta pickup */}
        <G transform={`translate(${W * 0.1}, ${H * 0.32})`}>
          {/* cabine + caçamba */}
          <Path d="M 12 50 L 30 18 L 95 14 L 105 32 L 175 32 L 200 38 L 220 50 L 220 70 L 12 70 Z" fill="url(#vbody)" />
          {/* janelas */}
          <Path d="M 38 22 L 92 19 L 100 33 L 38 33 Z" fill="rgba(0,0,0,0.45)" />
          {/* faróis */}
          <Path d="M 215 48 L 220 55 L 215 60 Z" fill="#fff" fillOpacity={0.9} />
          {/* grade */}
          <Path d="M 195 50 h 22 a 2 2 0 0 1 2 2 v 6 a 2 2 0 0 1 -2 2 h -22 a 2 2 0 0 1 -2 -2 v -6 a 2 2 0 0 1 2 -2 Z" fill="rgba(0,0,0,0.5)" />
          {/* roda traseira */}
          <Circle cx={50} cy={72} r={14} fill="#0A0F1A" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <Circle cx={50} cy={72} r={7} fill="#1A2230" />
          {/* roda dianteira */}
          <Circle cx={180} cy={72} r={14} fill="#0A0F1A" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
          <Circle cx={180} cy={72} r={7} fill="#1A2230" />
          {/* highlight reflexo */}
          <Path d="M 32 22 L 90 19 L 95 24 L 35 27 Z" fill="rgba(255,255,255,0.15)" />
        </G>
      </Svg>
    </View>
  );
}
