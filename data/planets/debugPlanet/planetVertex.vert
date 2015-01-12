precision mediump float;

varying float surfaceLevel;
varying vec2 vUv;

uniform float planetRadius;
uniform float planetSurface;
uniform sampler2D heightmapTex;

float unpack_value(const in vec4 rgba_value)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_value, bit_shift);
    return depth;
}

void main()
{
  surfaceLevel = unpack_value(texture2D(heightmapTex, uv));

  vec3 sphereNormal = normalize(position);
  vec3 spherePos = sphereNormal * (planetRadius + surfaceLevel * planetSurface);

  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePos, 1.0);
}
