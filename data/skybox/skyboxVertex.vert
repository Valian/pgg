precision highp float;

#define M_PI 3.14159265359


uniform sampler2D dataTex;
uniform float size;

varying vec4 varColor;

float unpack_value(const in vec4 rgba_value)
{
    const vec4 bit_shift = vec4(1.0/(256.0*256.0*256.0), 1.0/(256.0*256.0), 1.0/256.0, 1.0);
    float depth = dot(rgba_value, bit_shift);
    return depth;
}

void main()
{
    //theta
    vec2 texCoords = vec2(uv.x / 2.0, uv.y);
    float theta = unpack_value(texture2D(dataTex, texCoords));// * M_PI;

    //varColor = texture2D(dataTex, texCoords);

    //phi
    texCoords.x = texCoords.x + 0.5;
    float phi = unpack_value(texture2D(dataTex, texCoords));// ;

    //varColor = vec4(theta / M_PI, phi / ( 2.0 * M_PI), 0.0, 1.0);
    //varColor = texture2D(dataTex, texCoords);

    varColor = vec4(1.0, 1.0, 1.0, 1.0);

    phi = phi * 2.0 * M_PI;
    theta = acos( 2.0 * theta - 1.0);
    vec3 spherePos = vec3(sin(theta) * cos(phi), sin(theta) * sin(phi), cos(theta));

    gl_PointSize = 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePos * 5000000.0, 1.0);
}
