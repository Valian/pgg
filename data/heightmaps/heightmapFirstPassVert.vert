precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec3 leftTop;
uniform vec3 leftBottom;
uniform vec3 rightTop;
uniform vec3 seedVector;

attribute float multiplier;
attribute vec3 position;
attribute vec3 cornerPosition;

varying vec3 varyingPosition;
varying float mult;


void main()
{
    vec3 topVector = rightTop - leftTop;
    vec3 leftVector = leftBottom - leftTop;

    varyingPosition = leftTop +
                      cornerPosition.x * topVector +
                      cornerPosition.y * leftVector +
                      seedVector;

    mult = multiplier;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
