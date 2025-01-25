#define PI 3.14159265358979

attribute vec3 aOffset;
attribute vec2 aMetrics;

uniform float uTime;
uniform float uSpeed;
uniform float uTravelLength;
uniform vec2 uDistortionX;
uniform vec2 uDistortionY;
uniform float uBaseSpeed;

varying float intensity;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float radius = aMetrics.r;
    float len = aMetrics.g;
    modelPosition.xy *= radius; 
    modelPosition.z *= len;

    float zOffset = uTime * uSpeed + aOffset.z;
    zOffset = len + mod(zOffset, uTravelLength);

	modelPosition.z += zOffset;

    float progress = modelPosition.z + uTime;
    modelPosition.x += uDistortionX.x * sin(progress * uDistortionX.y);
    modelPosition.y += uDistortionY.x  * sin(progress *uDistortionY.y );

    modelPosition.xy += aOffset.xy;

    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vLight = vec3(0.0, 80.0, 200.0);
    intensity = dot(vNormal, vLight) * 0.8 + 0.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}