precision highp float;

uniform sampler2D sourceTexture;
uniform float multipliers[OCTAVES];
uniform float verticalCount;
uniform float row;

varying vec2 vUV;

vec4 pack_value(const in float value)
{
    const vec4 bit_shift = vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
    const vec4 bit_mask  = vec4(0.0, 1.0/256.0, 1.0/256.0, 1.0/256.0);
    vec4 res = fract(value * bit_shift);
    res -= res.xxyz * bit_mask;
    return res;
}

float unpack_value(const in vec4 rgba_value)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_value, bit_shift);
    return depth;
}

float snoise(int level)
{
    vec2 coords = vec2((vUV.x + float(level)) / FOCTAVES, (vUV.y + row) / verticalCount);
    return unpack_value(texture2D(sourceTexture, coords));
}

void main()
{
    float color = 0.0;

    float noise2 = snoise(2);
	bool isCrater = snoise(2) > 0.8 && snoise(1) > 0.6;
	
    for(int i = 0; i < OCTAVES; i++)
    {
        color += multipliers[i] * snoise(i);
    }
    
    color = float(!isCrater) * (color * color * color + 0.2);

    gl_FragColor = pack_value(color);
}
