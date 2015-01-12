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

float calculateColor()
{
    float color = 0.0;

    for(int i = 0; i < OCTAVES; i++)
    {
        color += multipliers[i] * snoise(i);
    }

    return color;
}

void main()
{
    float color = calculateColor();

    bool transform = color < 0.5;
    color = float(transform) * (1.0 - color) + color * float(!transform);

    transform = color > 0.52;
    color = float(transform) * (color * 6.0 - 2.60) + float(!transform) * color;
    color = min(color, 0.9999);

    gl_FragColor = pack_value(color);
}
