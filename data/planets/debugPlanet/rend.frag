varying vec2 vUv;
varying float surfaceLevel;
uniform sampler2D heightmapTex;

void main()
{
    gl_FragColor = texture2D(heightmapTex, vUv);
}
