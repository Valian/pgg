precision highp float;

uniform float multipliers[OCTAVES];
uniform sampler2D sourceTexture;
uniform float verticalCount;
uniform float row;

varying vec2 vUV;

vec4 snoise(int level)
{
    vec2 coords = vec2((vUV.x + float(level)) / FOCTAVES, (vUV.y + row) / verticalCount);
    return texture2D(sourceTexture, coords);
}

void main()
{
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

    for(int i = 0; i < OCTAVES; i++)
    {
        color += multipliers[i] * snoise(i);
    }

    gl_FragColor = color;
    //gl_FragColor = vec4(row / verticalCount, row / verticalCount, row / verticalCount, 1.0);
}
