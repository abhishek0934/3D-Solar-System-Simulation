# 🌌 3D Solar System Simulation

This is a responsive single-page web application built with **Three.js** that simulates a 3D solar system with realistic lighting, animations, and planetary orbits. Users can adjust the orbital speed of each planet in real-time through an interactive control panel.

---

## 🚀 Features

- 🌞 Sun at the center with point light illumination
- 🪐 All 8 planets orbiting with individual speeds and radii
- 🔁 Smooth orbital animation using `THREE.Clock` and `requestAnimationFrame`
- 🎛️ Speed control panel for real-time orbital speed adjustments
- 🛑 Pause and resume animation functionality *(Bonus)*
- 🌠 Optional starry background and tooltips on hover *(Bonus)*

---

## 📸 Demo Video

Watch the 2–3 minute demo showcasing:
- The 3D solar system in motion
- Real-time speed control
- Code and folder walkthrough  
👉 [Demo Video Link](#) *(Replace with actual video link)*

---

## 🧑‍💻 Tech Stack

- **JavaScript**
- **Three.js** (WebGL-based 3D engine)
- **HTML/CSS** (No animation libraries used)

---

## 📂 Folder Structure

project-root/
│
├── index.html
├── style.css
├── script.js
├── assets/ # Optional textures/images
└── README.md

## 🛠️ Setup & Running Instructions

1. Clone this repository or download the ZIP
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)
3. No server or build tools required

> ✅ Make sure to allow WebGL in your browser settings

---

## ⚙️ How It Works

- Each planet is a `THREE.Mesh` (SphereGeometry + MeshStandardMaterial)
- The Sun is a light-emitting object (PointLight at the center)
- Each planet’s orbit is animated around the Sun using a custom function with angle updates per frame
- A `<div>` control panel contains input sliders for each planet, linked via event listeners to control speed

---

## ✅ Future Improvements (Optional Features)

- 🌒 Dark/Light mode toggle
- 🌌 Background stars with `THREE.Points`
- 🛰️ Zoom in/out with orbit controls
- 🏷️ Planet names with tooltips on hover

---
This Website is live at - https://melodic-fudge-404c69.netlify.app/

---

## 📄 License

This project is open-source and free to use under the MIT License.
