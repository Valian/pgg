varying vec3 varNormal;
varying float surfaceLevel;
varying vec3 sunDirection;
uniform sampler2D surfaceTex;

vec3 apply_light(vec3 color, float emission)
{
  return color * max(0.0, emission + (1.0 - emission) * dot(normalize(sunDirection), normalize(varNormal)));
}

void main()
{
  vec2 tPos = vec2(0.0, surfaceLevel);
  vec3 color = texture2D(surfaceTex, tPos).xyz;
  gl_FragColor = vec4(apply_light(color, 0.0), 1.0);
}
