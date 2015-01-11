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

	float noise2 = snoise(2)[0];
	bool isCrater = snoise(2)[0] > 0.8 && snoise(1)[0] > 0.6;
	
    for(int i = 0; i < OCTAVES; i++)
    {
        color += multipliers[i] * snoise(i);
    }
    
    for(int i = 0; i < 4; i++)
    {
    	//isCrater = color[i] > 0.85;
        color[i] = float(!isCrater) * (color[i] * color[i] * color[i] + 0.1);
    }

    gl_FragColor = color;
}
