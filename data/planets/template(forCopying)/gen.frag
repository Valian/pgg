precision highp float;

// OCTAVES defined in shadermaterial
// available float version FOCTAVES
uniform float multipliers[OCTAVES];
uniform sampler2D sourceTexture;

varying vec2 vUV;

// returns precomputed noise at specific level < OCTAVES
// For noise level multipliers, look into properties.json
vec4 snoise(int level)
{
    vec2 coords = vec2((vUV.x + float(level)) / FOCTAVES, vUV.y);
    return texture2D(sourceTexture, coords);
}

void main()
{
    vec4 color = vec4(0.0, 0.0, 0.0, 0.0);

    //TODO - add here planet-specific code.
    for(int i = 0; i < OCTAVES; i++)
    {
        color += multipliers[i] * snoise(i);
    }

    gl_FragColor = color;
}
