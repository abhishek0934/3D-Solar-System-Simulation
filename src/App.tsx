import React, { useState, useCallback } from 'react';
import { SolarSystemCanvas } from './components/SolarSystemCanvas';
import { ControlPanel } from './components/ControlPanel';
import { SolarSystemControls } from './types';
import { planetsData } from './data/planets';

function App() {
  const [controls, setControls] = useState<SolarSystemControls>(() => ({
    isPaused: false,
    isDarkMode: true,
    planetSpeeds: planetsData.reduce((acc, planet) => {
      acc[planet.name] = 1;
      return acc;
    }, {} as { [key: string]: number })
  }));

  const handleTogglePause = useCallback(() => {
    setControls(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleToggleTheme = useCallback(() => {
    setControls(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  }, []);

  const handleSpeedChange = useCallback((planetName: string, speed: number) => {
    setControls(prev => ({
      ...prev,
      planetSpeeds: {
        ...prev.planetSpeeds,
        [planetName]: speed
      }
    }));
  }, []);

  const handleReset = useCallback(() => {
    setControls(prev => ({
      ...prev,
      isPaused: false,
      planetSpeeds: planetsData.reduce((acc, planet) => {
        acc[planet.name] = 1;
        return acc;
      }, {} as { [key: string]: number })
    }));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <SolarSystemCanvas controls={controls} />
      <ControlPanel
        controls={controls}
        onTogglePause={handleTogglePause}
        onToggleTheme={handleToggleTheme}
        onSpeedChange={handleSpeedChange}
        onReset={handleReset}
      />
      
      {/* Info Panel */}
      <div className={`fixed bottom-4 left-4 p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
        controls.isDarkMode 
          ? 'bg-black/30 border-white/20 text-white' 
          : 'bg-white/30 border-black/20 text-black'
      }`}>
        <h3 className="font-bold mb-2">3D Solar System</h3>
        <p className="text-sm opacity-80">
          Hover over planets for info • Use controls to adjust speeds
        </p>
      </div>
    </div>
  );
}

export default App;