precision highp float;

uniform sampler2D imageTex;

varying vec4 varColor;

void main()
{
    gl_FragColor = varColor;
    //gl_FragColor = texture2D(imageTex, gl_PointCoord);
}
