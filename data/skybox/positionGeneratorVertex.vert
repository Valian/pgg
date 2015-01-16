precision highp float;

uniform float seed;
uniform vec3 middlePos;

attribute float floatComponent;
attribute vec3 cornerPosition;

varying float component;
varying vec3 varyingPosition;


void main()
{
    varyingPosition = cornerPosition + middlePos + seed;
    component = floatComponent;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
