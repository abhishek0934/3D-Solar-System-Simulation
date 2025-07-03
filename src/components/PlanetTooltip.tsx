import React from 'react';
import { PlanetData } from '../types';

interface PlanetTooltipProps {
  planet: PlanetData;
  position: { x: number; y: number };
  isDarkMode: boolean;
}

export const PlanetTooltip: React.FC<PlanetTooltipProps> = ({
  planet,
  position,
  isDarkMode
}) => {
  return (
    <div
      className={`fixed pointer-events-none z-50 p-3 rounded-lg backdrop-blur-md border transition-opacity duration-200 ${
        isDarkMode 
          ? 'bg-black/80 border-white/20 text-white' 
          : 'bg-white/80 border-black/20 text-black'
      }`}
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translate(0, -100%)'
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: planet.color }}
        />
        <h3 className="font-bold">{planet.name}</h3>
      </div>
      <p className="text-sm opacity-80">{planet.description}</p>
      <div className="text-xs opacity-60 mt-1">
        Distance: {planet.distance} AU
      </div>
    </div>
  );
};