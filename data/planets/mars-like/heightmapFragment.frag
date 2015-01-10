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

	bool isCrater = snoise(0)[0] > 0.75;
	vec4 tmpColor = multipliers[0] * snoise(0);
	
	color = float(isCrater) * (-tmpColor + 1.1) + float(!isCrater) * tmpColor;
	
    for(int i = 1; i < OCTAVES; i++)
    {
    	tmpColor = multipliers[i] * snoise(i);
        color += float(isCrater) * (-tmpColor) + float(!isCrater) * tmpColor;
    }

    gl_FragColor = color;
}
