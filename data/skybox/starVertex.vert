precision highp float;

attribute float phi;
attribute float theta;
attribute float size;

varying vec4 varColor;
varying vec2 varUV;

vec3 computeSpherePos(float t, float p)
{
    return vec3(sin(t) * cos(p), sin(t) * sin(p), cos(t));
}

void main()
{
    vec3 spherePos = computeSpherePos(theta, phi);
    vec3 firstDir = normalize(vec3(-spherePos.y, -spherePos.x, 0.0));
    vec3 secondDir = normalize(cross(spherePos, firstDir));

    spherePos = spherePos + firstDir * position.x * size + secondDir * position.y * size;

    varColor = vec4(theta / 6.0, phi / 3.0, 1.0, 1.0);
    varUV = position.xy + 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(spherePos * 500000.0, 1.0);
}
