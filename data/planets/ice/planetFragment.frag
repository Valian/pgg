varying float surfaceLevel;
uniform sampler2D surfaceTex;

void main()
{
  vec2 tPos = vec2(0.0, surfaceLevel);
  gl_FragColor = texture2D( surfaceTex, tPos);
}
