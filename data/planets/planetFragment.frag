varying vec3 varNormal;
varying float surfaceLevel;
varying vec3 sunPosition;

vec3 apply_light(vec3 color, float emission)
{
  return color * max(0.0, emission + (1.0 - emission) * dot(normalize(-sunPosition), normalize(varNormal)));
}

void main()
{
  vec3 color = vec3(surfaceLevel, surfaceLevel, surfaceLevel);
  gl_FragColor = vec4(apply_light(color, 0.0), 1.0);
}
