export interface PlanetData {
  name: string;
  size: number;
  color: string;
  distance: number;
  baseSpeed: number;
  description: string;
}

export interface PlanetState {
  name: string;
  speed: number;
  angle: number;
  mesh?: THREE.Mesh;
}

export interface SolarSystemControls {
  isPaused: boolean;
  isDarkMode: boolean;
  planetSpeeds: { [key: string]: number };
}