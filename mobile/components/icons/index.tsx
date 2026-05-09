import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface P { size?: number; color?: string; }

export function VehicleIcon({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 13l1.8-5.2A2 2 0 0 1 6.7 6.5h10.6a2 2 0 0 1 1.9 1.3L21 13M3 13v4.5h2v-1.2h14v1.2h2V13M3 13h18" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="7" cy="15.5" r="1.2" fill={color}/>
      <Circle cx="17" cy="15.5" r="1.2" fill={color}/>
    </Svg>
  );
}

export function BoltIcon({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 3L5 13h6l-1 8 8-10h-6l1-8z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </Svg>
  );
}

export function WrenchIcon({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M14.5 5a4.5 4.5 0 0 0-4.4 5.4L4 16.5l3.5 3.5 6.1-6.1A4.5 4.5 0 1 0 14.5 5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    </Svg>
  );
}

export function UserIcon({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.6"/>
      <Path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}

export function PinIcon({ size = 18, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s7-7.5 7-13a7 7 0 1 0-14 0c0 5.5 7 13 7 13z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.6"/>
    </Svg>
  );
}

export function FuelIcon({ size = 16, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M15 9h2a2 2 0 0 1 2 2v6a1.5 1.5 0 0 0 3 0V8l-2.5-2.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export function CalendarIcon({ size = 16, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <Path d="M3 10h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </Svg>
  );
}

export function LockIcon({ size = 18, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.6"/>
      <Path d="M8 11V8a4 4 0 1 1 8 0v3" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}

export function UnlockIcon({ size = 18, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.6"/>
      <Path d="M8 11V8a4 4 0 0 1 7.5-2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}

export function PowerIcon({ size = 22, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <Path d="M7 7a7 7 0 1 0 10 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </Svg>
  );
}

export function CaretIcon({ size = 14, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  );
}

export function FanIcon({ size = 20, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth="1.6"/>
      <Path d="M12 10c0-3 1.5-6 4-6 1.5 0 2 1.5 1 3s-3 2-5 3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <Path d="M14 12c3 0 6 1.5 6 4 0 1.5-1.5 2-3 1s-2-3-3-5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <Path d="M12 14c0 3-1.5 6-4 6-1.5 0-2-1.5-1-3s3-2 5-3z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <Path d="M10 12c-3 0-6-1.5-6-4 0-1.5 1.5-2 3-1s2 3 3 5z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </Svg>
  );
}

export function BellIcon({ size = 18, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    </Svg>
  );
}
