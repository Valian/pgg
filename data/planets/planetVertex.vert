precision mediump float;

varying float surfaceLevel;
varying vec3 varNormal;
varying vec3 sunDirection;

uniform float planetRadius;
uniform float planetSurface;
uniform sampler2D heightmapTex;
uniform sampler2D bumpmapTex;

const vec3 sunPos = vec3(0.0, 0.0, 0.0);
const vec3 axisZ = vec3(0.0, 0.0, 1.000001);
//const vec3 axisY = vec3(0.0, 1.0, 0.0);

float unpack_value(const in vec4 rgba_value)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_value, bit_shift);
    return depth;
}

vec3 transform_to_tangent_space(vec3 vector, vec3 N, vec3 T, vec3 B)
{
  return vec3(dot(vector, T), dot(vector, B), dot(vector, N));
}

void main()
{
  vec3 sphereNormal = normalize(position);
  vec3 c1 = cross(sphereNormal, axisZ);
  //vec3 c2 = cross(sphereNormal, axisY);

  //bool c1Bigger = length(c1)>length(c2);

  vec3 tangent = normalize(c1);
  vec3 binormal = normalize(cross(sphereNormal, tangent));


  surfaceLevel = unpack_value(texture2D(heightmapTex, uv));
  varNormal = texture2D(bumpmapTex, uv).xyz;
  //varNormal = transform_to_tangent_space(varNormal, sphereNormal, tangent, binormal);

  vec3 spherePos = sphereNormal * (planetRadius + surfaceLevel * planetSurface);

  vec3 sunPosition = sunPos - vec3(modelMatrix * vec4(spherePos, 1.0));
  sunDirection = transform_to_tangent_space(sunPosition, sphereNormal, tangent, binormal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePos, 1.0);

}
