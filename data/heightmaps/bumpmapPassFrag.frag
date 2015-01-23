precision highp float;

uniform sampler2D heightmapTexture;
uniform float texelSize;
uniform float texelRealSize;
uniform float surfaceHeight;

varying vec2 vUV;

float unpack_value(const in vec4 rgba_value)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_value, bit_shift);
    return depth;
}

void main()
{
    vec3 off = vec3(texelSize, 0, -texelSize);

    float s01 = unpack_value(texture2D(heightmapTexture, vUV + off.zy));
    float s21 = unpack_value(texture2D(heightmapTexture, vUV + off.xy));
    float s10 = unpack_value(texture2D(heightmapTexture, vUV + off.yz));
    float s12 = unpack_value(texture2D(heightmapTexture, vUV + off.yx));

    vec3 va = normalize(vec3(texelRealSize, 0, (s21-s01) * surfaceHeight));
    vec3 vb = normalize(vec3(0, texelRealSize, (s12-s10) * surfaceHeight));

    gl_FragColor = vec4( cross(va,vb), 1.0 );
    //gl_FragColor = vec4(s12-s10, 0.0, 0.0, 1.0);
    //gl_FragColor = vec4(vb, 1.0);
}
