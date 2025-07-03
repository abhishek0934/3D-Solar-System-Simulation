import React from 'react';
import { Play, Pause, Sun, Moon, RotateCcw } from 'lucide-react';
import { planetsData } from '../data/planets';
import { SolarSystemControls } from '../types';

interface ControlPanelProps {
  controls: SolarSystemControls;
  onTogglePause: () => void;
  onToggleTheme: () => void;
  onSpeedChange: (planetName: string, speed: number) => void;
  onReset: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  controls,
  onTogglePause,
  onToggleTheme,
  onSpeedChange,
  onReset
}) => {
  return (
    <div className={`fixed top-4 right-4 w-80 max-w-[90vw] p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
      controls.isDarkMode 
        ? 'bg-black/30 border-white/20 text-white' 
        : 'bg-white/30 border-black/20 text-black'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Solar System Controls</h2>
        <div className="flex gap-2">
          <button
            onClick={onTogglePause}
            className={`p-2 rounded-lg transition-all duration-200 ${
              controls.isDarkMode 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-black/20 hover:bg-black/30'
            }`}
          >
            {controls.isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-all duration-200 ${
              controls.isDarkMode 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-black/20 hover:bg-black/30'
            }`}
          >
            {controls.isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onReset}
            className={`p-2 rounded-lg transition-all duration-200 ${
              controls.isDarkMode 
                ? 'bg-white/20 hover:bg-white/30' 
                : 'bg-black/20 hover:bg-black/30'
            }`}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {planetsData.map((planet) => (
          <div key={planet.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{planet.name}</span>
              <span className="text-xs opacity-70">
                {(controls.planetSpeeds[planet.name] || 1).toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: planet.color }}
              />
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={controls.planetSpeeds[planet.name] || 1}
                onChange={(e) => onSpeedChange(planet.name, parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};