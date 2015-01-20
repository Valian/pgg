precision highp float;

uniform sampler2D map;

varying vec2 varUV;

void main()
{
    gl_FragColor = vec4(varUV, 0.0, 1.0);
    //gl_FragColor = texture2D(imageTex, varUV);
}
