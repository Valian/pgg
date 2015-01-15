precision highp float;

attribute float multiplier;
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
