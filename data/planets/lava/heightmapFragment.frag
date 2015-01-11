precision highp float;

uniform sampler2D sourceTexture;
uniform float multipliers[OCTAVES];
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
    
    for(int i = 0; i < 4; i++)
    {
    	bool transform = color[i] < 0.5;
    	color[i] = float(transform) * (1.0 - color[i]) + color[i] * float(!transform);
    	
    	transform = color[i] > 0.52;
    	color[i] = float(transform) * (color[i] * 6.0 - 2.60) + float(!transform) * color[i];
    }

    gl_FragColor = color;
}
