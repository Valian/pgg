precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute float multiplier;
attribute vec3 position;
attribute vec4 cornerPosition;

varying vec3 varyingPosition;
varying float mult;
varying float seed;


void main()
{
    varyingPosition = cornerPosition.xyz;
    seed = cornerPosition.w;
    mult = multiplier;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
