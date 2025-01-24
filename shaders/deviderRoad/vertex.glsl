#define PI 3.14159265358979

uniform vec2 uDistortionX;
uniform vec2 uDistortionY;
uniform float uTravelLength;
uniform float uTime;
uniform float uBaseSpeed;



void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float progress = modelPosition.z + uTime * uBaseSpeed;
    modelPosition.x += uDistortionX.x * sin(progress * uDistortionX.y);
    modelPosition.y += uDistortionY.x * sin(progress * uDistortionY.y);


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}