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
    	if(color[i] > 0.55 || color[i] < 0.45)
    	{
    		color[i] = 1.0;
    	}
    	else if(color[i] < 0.52 && color[i] > 0.48) 
    	{
    		//color[i] = 0.0;
    	}
    }

    gl_FragColor = color;
}
