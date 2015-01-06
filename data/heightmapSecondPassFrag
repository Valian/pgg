precision highp float;

uniform float multipliers[OCTAVES];
uniform sampler2D sourceTexture;

varying vec2 vUV;

vec4 snoise(int level)
{
    vec2 coords = vec2((vUV.x + float(level)) / FOCTAVES, vUV.y);
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
}
