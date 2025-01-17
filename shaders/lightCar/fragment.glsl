
precision mediump float;

uniform vec3 uColor;

varying float intensity;

void main(){
    gl_FragColor = vec4(uColor * intensity, 1);
}