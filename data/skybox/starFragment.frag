precision highp float;

uniform sampler2D imageTex;

varying vec4 varColor;
varying vec2 varUV;

void main()
{
    gl_FragColor = varColor;
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    //gl_FragColor = texture2D(imageTex, gl_PointCoord);
}
