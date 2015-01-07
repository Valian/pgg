varying vec2 vUv;
varying float surfaceLevel;

uniform float planetRadius;
uniform float planetSurface;
uniform sampler2D heightmapTex;

void main()
{
  surfaceLevel = texture2D(heightmapTex, uv).r;

  vec3 sphereNormal = normalize(position);
  vec3 spherePos = sphereNormal * (planetRadius + surfaceLevel * planetSurface);

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePos, 1.0);
}
