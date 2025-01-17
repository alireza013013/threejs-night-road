#define PI 3.14159265358979

attribute vec3 aOffset;
attribute vec2 aMetrics;

uniform float uTime;
uniform float uSpeed;
uniform float uTravelLength;
uniform vec2 uDistortionX;
uniform vec2 uDistortionY;

varying float intensity;

float nsin(float val){
   return sin(val) * 0.5 + 0.5;
}

vec3 getDistortion(float progress){
    progress = clamp(progress, 0.0,1.0);
    float xAmp = uDistortionX.r;
    float xFreq = uDistortionX.g;
    float yAmp = uDistortionY.r;
    float yFreq = uDistortionY.g;
    return vec3( 
        xAmp * nsin(progress* PI * xFreq   - PI / 2.0 ) ,
        yAmp * nsin(progress * PI *yFreq - PI / 2.0  ) ,
        0.0
    );
}


void main() {
    vec4 modelPosition = modelMatrix * vec4(position,1.0);

    float radius = aMetrics.r;
    float len = aMetrics.g;
    modelPosition.xy *= radius; 
    modelPosition.z *= len;

    float zOffset = uTime * uSpeed + aOffset.z;
    zOffset = len + mod(zOffset, uTravelLength);




	modelPosition.z += zOffset;

    float progress = (modelPosition.z + uTravelLength / 22.0) / uTravelLength;
    vec3 distortion = getDistortion(progress);
    modelPosition.x += distortion.x;
    modelPosition.y += distortion.y;
    
    modelPosition.xy += aOffset.xy;


    vec3 vNormal = normalize(normalMatrix * normal);
    vec3 vLight = vec3(0.0, 40.0, 200.0);
    intensity = dot(vNormal, vLight) * 0.8 + 0.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}