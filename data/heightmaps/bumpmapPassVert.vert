precision highp float;

varying vec2 vUV;

void main()
{
    vUV = position.xy;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
