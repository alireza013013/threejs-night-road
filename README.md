# Three.js Night Road

## Overview
This project is a visually stunning night road scene created using **Three.js**. It features dynamic elements such as:

- A procedurally distorted road that simulates real-world undulations.
- A moving camera that follows the road's flow for a cinematic effect.
- Cars with customizable speeds and colors moving in both directions.
- Custom shaders written from scratch for road distortion and car visuals.
- Post-processing effects to enhance the scene's visual quality.

[Live Demo](https://threejs-night-road.netlify.app/)

[Live Customize](https://threejs-night-road.netlify.app/#debug)

---

## Features

### 1. Road Generation
- **Procedurally Distorted Road**: The road uses a plane geometry that is procedurally distorted using vertex shaders to create realistic undulations and curvature.
- **Customizable Parameters**: The amplitude and frequency of distortions can be adjusted, allowing for unique road shapes.
- **Uniform Flow**: The road is designed to give the appearance of infinite length, using seamless UV mapping and periodic updates.

### 2. Camera Movement
- **Dynamic Camera Path**: The camera follows a path defined by sinusoidal distortions in the X and Y axes to mimic the undulating nature of the road.
- **Responsive Look Direction**: The camera's `lookAt` target adjusts dynamically based on its position, ensuring smooth tracking of the road.
- **Speed Transitions**: The camera transitions between speeds smoothly using linear interpolation (LERP), creating realistic acceleration and deceleration effects.

### 3. Vehicle Simulation
- **Bidirectional Movement**: Cars move both forward and backward along the road. This is achieved using instanced geometries with directional attributes.
- **Customizable Cars**: Each car can have unique colors, speeds, and sizes, allowing for diverse traffic.
- **Procedural Placement**: Cars are placed procedurally along the road's width and length, ensuring a dynamic and varied scene.

### 4. Custom Shaders
- **Road Shaders**:
  - Custom vertex shaders distort the road geometry procedurally based on sinusoidal functions.
  - Fragment shaders control road colors and lighting for a realistic appearance.
- **Car Shaders**:
  - Vertex shaders define car positions, lengths, and widths dynamically.
  - Fragment shaders add lighting and color effects, making the cars visually distinct.

### 5. Post-Processing
- **Bloom**: Enhances the brightness of lights and reflective surfaces, giving the scene a vibrant nighttime effect.
- **Motion Blur**: Simulates the motion of cars and camera movement for added realism.
- **Color Correction**: Adjusts tones and contrasts for a polished final render.

---

## Installation and Usage

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or later)
- npm or yarn

### Steps to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/alireza013013/threejs-night-road.git
   cd threejs-night-road
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173` to view the scene.

### Build for Production
To create a production-ready build:
```bash
npm run build
```
The output will be located in the `dist` directory.

---

## Customization

### Road
- **Amplitude & Frequency**: Adjust road distortion via uniforms in the vertex shader.
- **Colors**: Modify the road's base color in `roadFragment.glsl`.

### Cars
- **Speed**: Customize car speeds using the `uSpeed` uniform.
- **Colors**: Set car colors in the `LightCar` class.
- **Traffic Density**: Change the number of cars by adjusting `options.countPairCar`.

### Camera
- **Speed**: Adjust camera movement speed using `options.baseSpeed`.
- **FOV**: Update the field of view dynamically via the `increaseFov` and `decreaseFov` methods.

---

## Highlights
- **Fully Customizable**: Road, cars, and camera parameters can all be easily configured.
- **Realistic Night Scene**: Combines dynamic shaders and post-processing for a polished look.
- **Procedural Generation**: Ensures replayability with varied road shapes and vehicle placements.

---

## Credits
- Built with [Three.js](https://threejs.org/)
- Custom shaders and logic developed by [Alireza013013](https://github.com/alireza013013).

