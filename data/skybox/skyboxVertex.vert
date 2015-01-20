precision highp float;

varying vec2 varUV;

void main()
{
    varUV = uv;

    gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0)
}
