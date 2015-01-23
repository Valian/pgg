varying vec2 vUv;
varying vec3 varNormal;
varying float surfaceLevel;
varying vec3 sunDirection;
uniform sampler2D heightmapTex;
uniform sampler2D bumpmapTex;

void main()
{
  //gl_FragColor = texture2D(heightmapTex, vUv);
  //gl_FragColor = texture2D(bumpmapTex, vUv) * max(0.0, dot(normalize(varNormal), normalize(sunDirection)));
  gl_FragColor = vec4(normalize(varNormal), 1.0);
  //gl_FragColor = vec4(surfaceLevel, surfaceLevel, surfaceLevel, 0.0);
}
