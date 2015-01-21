precision highp float;

uniform sampler2D imageTex;

void main()
{
    gl_FragColor = texture2D(imageTex, gl_PointCoord);
}
