varying vec2 vUv;
varying float surfaceLevel;
uniform sampler2D heightmapTex;

void main()
{
  gl_FragColor = texture2D(heightmapTex, vUv);
  //gl_FragColor = vec4(vUv, 0.0, 0.0);
  //gl_FragColor = vec4(surfaceLevel, surfaceLevel, surfaceLevel, 0.0);
}
