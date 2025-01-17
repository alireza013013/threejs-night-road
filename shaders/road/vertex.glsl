#define PI 3.14159265358979

uniform vec2 uDistortionX;
uniform vec2 uDistortionY;
uniform float uTravelLength;

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
 
    float progress = (modelPosition.z + uTravelLength / 22.0) / uTravelLength;
    vec3 distortion = getDistortion(progress);
    modelPosition.x += distortion.x;
    modelPosition.y += distortion.y;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}