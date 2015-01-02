varying vec2 vUv;
varying float surfaceLevel;

void main()
{
    gl_FragColor = vec4(surfaceLevel, surfaceLevel, surfaceLevel, 1.0);
}
